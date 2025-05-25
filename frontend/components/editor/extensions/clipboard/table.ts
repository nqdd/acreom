import { Plugin } from '@tiptap/pm/state';
import { Node } from '@tiptap/pm/model';

import MarkdownIt from 'markdown-it';
import { Fragment, Slice, Schema } from 'prosemirror-model';
import { Extension } from '@tiptap/core';
import { registerEditorExtension } from '~/components/editor/extensions';
import { EditorTypes } from '~/constants';
import { EditorContext } from '~/@types/app';

const md = new MarkdownIt();

registerEditorExtension({
    type: EditorTypes.BASIC,
    createInstance(_: EditorContext) {
        return Extension.create({
            name: 'table-clipboard-handler',
            addProseMirrorPlugins() {
                return [markdownTablePastePlugin(this.editor.schema)];
            },
        });
    },
});

function parseMarkdownTable(markdown: string, schema: Schema) {
    const html = md.render(markdown);
    const container = document.createElement('div');
    container.innerHTML = html;

    const table = container.querySelector('table');
    if (!table) return null;

    const rows = Array.from(table.querySelectorAll('tr'));
    const tableRows = rows.map(row => {
        const cells = Array.from(row.querySelectorAll('th, td')).map(cell =>
            schema.nodes.tableCell.createAndFill(
                {},
                schema.nodes.paragraph.createAndFill(
                    {},
                    schema.text(cell.textContent || ' '),
                ),
            ),
        ) as Node[];
        return schema.nodes.tableRow.createAndFill(
            {},
            Fragment.fromArray(cells),
        );
    }) as Node[];

    return schema.nodes.table.createAndFill({}, Fragment.fromArray(tableRows));
}

function markdownTablePastePlugin(schema: Schema) {
    return new Plugin({
        props: {
            handlePaste(view, event, _) {
                const { state } = view;
                const { selection } = state;

                const clipboardData = event.clipboardData;
                const text = clipboardData?.getData('text/plain');

                if (!text) return false;

                // ⛔ Check if cursor is inside an existing table
                const $from = selection.$from;
                let currentNode = $from.node($from.depth);
                for (let d = $from.depth; d > 0; d--) {
                    currentNode = $from.node(d);
                    if (
                        currentNode.type === schema.nodes.table ||
                        currentNode.type === schema.nodes.tableRow ||
                        currentNode.type === schema.nodes.tableCell
                    ) {
                        return false; // Don't parse if inside table
                    }
                }

                if (/^\s*\|(.+\|)+\s*\n/.test(text)) {
                    const tableNode = parseMarkdownTable(text, schema);
                    if (tableNode) {
                        const tr = view.state.tr.replaceSelection(
                            new Slice(Fragment.from(tableNode), 0, 0),
                        );
                        view.dispatch(tr.scrollIntoView());
                        return true;
                    }
                }

                return false;
            },
        },
    });
}
