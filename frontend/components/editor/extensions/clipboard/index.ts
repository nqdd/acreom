import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Fragment, Node, Slice } from '@tiptap/pm/model';
import { registerEditorExtension } from '~/components/editor/extensions';
import { EditorTypes } from '~/constants';
import { EditorContext } from '~/@types/app';
import './table';

registerEditorExtension({
    type: EditorTypes.BASIC,
    createInstance(_: EditorContext) {
        return Extension.create({
            name: 'empty-line-paste-handler',
            addProseMirrorPlugins() {
                return [
                    new Plugin({
                        key: new PluginKey<any>('empty-line-paste-handler-key'),
                        props: {
                            clipboardTextParser: (text, context, plain) => {
                                if (!plain) return null as any;
                                const blocks = text.split(/(?:\r\n?|\n)/);
                                const nodes: any[] = [];

                                blocks.forEach(line => {
                                    const nodeJson = {
                                        type: 'paragraph',
                                    } as any;
                                    if (line.length > 0) {
                                        nodeJson.content = [
                                            { type: 'text', text: line },
                                        ];
                                    }
                                    const node = Node.fromJSON(
                                        context.doc.type.schema,
                                        nodeJson,
                                    );
                                    nodes.push(node);
                                });

                                const fragment = Fragment.fromArray(nodes);
                                return Slice.maxOpen(fragment);
                            },
                        },
                    }),
                ];
            },
        });
    },
});
