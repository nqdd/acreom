<template>
    <div>
        <tippy
            :content="$utils.tooltip.getRefText"
            :delay="[300, 20]"
            :touch="false"
            boundary="window"
            placement="top"
            theme="tooltip"
            target=".has-tippy"
        />
        <div
            v-if="
                editor.isActive('table') &&
                utils.isCellSelection(editor.state.selection)
            "
            :class="{ visible }"
            class="bubble-menu-wrapper"
            @mousedown="handleMouseDown"
        >
            <div class="bubble-menu">
                <button
                    class="table-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Add row above</div>`"
                    :disabled="!editor.can().addRowBefore()"
                    @click="editor.chain().focus().addRowBefore().run()"
                >
                    <TableRowPlusBefore />
                </button>
                <button
                    class="table-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Add row below</div>`"
                    :disabled="!editor.can().addRowAfter()"
                    @click="editor.chain().focus().addRowAfter().run()"
                >
                    <TableRowPlusAfter />
                </button>
                <button
                    class="table-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Delete row</div>`"
                    :disabled="!editor.can().deleteRow()"
                    @click="editor.chain().focus().deleteRow().run()"
                >
                    <TableRowRemove />
                </button>
                <div class="divider"></div>
                <button
                    class="table-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Add column before</div>`"
                    :disabled="!editor.can().addColumnBefore()"
                    @click="editor.chain().focus().addColumnBefore().run()"
                >
                    <TableColumnPlusBefore />
                </button>
                <button
                    class="table-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Add column after</div>`"
                    :disabled="!editor.can().addColumnAfter()"
                    @click="editor.chain().focus().addColumnAfter().run()"
                >
                    <TableColumnPlusAfter />
                </button>
                <button
                    class="table-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Delete column</div>`"
                    :disabled="!editor.can().deleteColumn()"
                    @click="editor.chain().focus().deleteColumn().run()"
                >
                    <TableColumnRemove />
                </button>
                <div class="divider"></div>
                <button
                    class="table-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Merge cells</div>`"
                    :disabled="!editor.can().mergeCells()"
                    @click="editor.chain().focus().mergeCells().run()"
                >
                    <TableMergeCells />
                </button>
                <button
                    class="table-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Split cells</div>`"
                    :disabled="!editor.can().splitCell()"
                    @click="editor.chain().focus().splitCell().run()"
                >
                    <TableSplitCell />
                </button>
                <div class="divider"></div>
                <button
                    class="table-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Delete table</div>`"
                    :disabled="!editor.can().deleteTable()"
                    @click="editor.chain().focus().deleteTable().run()"
                >
                    <TableDeleteIcon />
                </button>
                <div class="divider"></div>
                <button
                    class="table-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Copy as markdown</div>`"
                    @click="onCopyTableAsMarkdown"
                >
                    <InterfaceFileClipboard size="14" class="icon" />
                </button>
            </div>
        </div>
        <div
            v-else
            :class="{ visible }"
            class="bubble-menu-wrapper"
            @mousedown="handleMouseDown"
        >
            <div v-if="!editingLink" class="bubble-menu">
                <button
                    ref="convertToMenuButton"
                    class="action-button"
                    data-e2e="convert-to-trigger"
                    :class="{ 'is-active': convertToMenuActive }"
                    @mousedown.stop="onConvertToMenuHandler"
                >
                    {{ selectionType }}
                    <ChevronUpIcon v-if="convertToMenuActive" size="20" />
                    <ChevronDownIcon v-else size="20" />
                </button>
                <div class="colorpicker-component">
                    <div
                        name="highlight-color"
                        class="colorpicker-component__colorpicker-wrapper"
                    >
                        <button
                            class="
                                colorpicker-component__colorpicker-wrapper__colorpicker
                                has-tippy
                            "
                            :data-tippy-content="`<div class='tooltip'>Highlight</div>`"
                            :class="{ 'is-active': highlightColorMenuActive }"
                            :style="{
                                background: computeColorHex(highlightColor),
                            }"
                            @click="handleHighlight"
                        ></button>
                    </div>
                    <button
                        ref="highlighColorMenuButton"
                        class="
                            colorpicker-component__colorpicker-wrapper__colorpalette-button
                        "
                        :class="{ active: highlightColorMenuActive }"
                        @click="onHighlightColorMenuHandler"
                    >
                        <ChevronDownIcon size="20" />
                    </button>
                </div>
                <button
                    class="mark-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Bold</div>`"
                    name="bold"
                    :class="{ 'is-active': editor.isActive('bold') }"
                    @click="editor.chain().focus().toggleBold().run()"
                >
                    <BoldIcon />
                </button>
                <button
                    class="mark-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Italic</div>`"
                    name="italic"
                    :class="{ 'is-active': editor.isActive('italic') }"
                    @click="editor.chain().focus().toggleItalic().run()"
                >
                    <ItalicIcon />
                </button>
                <button
                    class="mark-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Underline</div>`"
                    name="underline"
                    :class="{ 'is-active': editor.isActive('underline') }"
                    @click="editor.chain().focus().toggleUnderline().run()"
                >
                    <UnderlineIcon />
                </button>
                <button
                    class="mark-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Strikethrough</div>`"
                    name="strikethrough"
                    :class="{ 'is-active': editor.isActive('strike') }"
                    @click="editor.chain().focus().toggleStrike().run()"
                >
                    <StrikeIcon />
                </button>
                <button
                    class="mark-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Clear Formatting</div>`"
                    name="clear"
                    @click="editor.chain().focus().unsetAllMarks().run()"
                >
                    <span class="strike"
                        ><ClearFormattingIcon size="20"
                    /></span>
                </button>
                <button
                    class="mark-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Inline Code</div>`"
                    name="inline-code"
                    :class="{ 'is-active': editor.isActive('code') }"
                    @click="editor.chain().focus().toggleCode().run()"
                >
                    <CodeIcon size="20" />
                </button>
                <button
                    class="mark-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Link</div>`"
                    name="link"
                    :class="{ 'is-active': editor.isActive('link') }"
                    @click="setLink"
                >
                    <LinkIcon size="20" />
                </button>
                <button
                    v-if="assistantSettings.assistantEnabled"
                    class="mark-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>TL;DR</div>`"
                    name="summarize"
                    @click="summarizeHandler"
                >
                    <InterfaceEditMagicWand />
                </button>
                <button
                    v-if="assistantSettings.assistantEnabled"
                    class="mark-button has-tippy"
                    :data-tippy-content="`<div class='tooltip'>Mermaid Wizard</div>`"
                    name="make mermaid"
                    @click="makeMermaidHandler"
                >
                    <InterfaceHierarchy3 />
                </button>
                <button
                    ref="miscMenuButton"
                    class="action-button"
                    :class="{ 'is-active': miscMenuActive }"
                    @click="onMiscMenuHandler"
                >
                    <DotsHorizontalIcon size="20" />
                </button>
            </div>
            <div v-else class="bubble-menu link-edit">
                <CInput
                    ref="linkInput"
                    v-model="linkText"
                    class="link-input"
                    placeholder="Paste in or type URL"
                    @keydown.enter="confirmLink"
                    @keydown.esc="editingLink = false"
                />
                <button
                    class="mark-button"
                    :disabled="!editor.isActive('link')"
                    @click="deleteLink"
                >
                    <TrashIcon size="20" />
                </button>
                <button
                    class="mark-button"
                    :disabled="linkText.length === 0"
                    @click="confirmLink"
                >
                    <CheckCircleIcon size="20" />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
    LinkIcon,
    LightningBoltIcon,
    DocumentIcon,
    TerminalIcon,
    CheckIcon,
    TrashIcon,
    CheckCircleIcon,
    CodeIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from '@vue-hero-icons/solid';
import { Editor, findParentNodeClosestToPos } from '@tiptap/core';
import { Level } from '@tiptap/extension-heading';
import ConvertMenu from './ConvertMenu.vue';
import MiscMenu from './MiscMenu.vue';
import TableRowPlusBefore from '~/components/icons/TableRowPlusBefore.vue';
import TableRowPlusAfter from '~/components/icons/TableRowPlusAfter.vue';
import TableRowRemove from '~/components/icons/TableRowRemove.vue';
import TableColumnPlusBefore from '~/components/icons/TableColumnPlusBefore.vue';
import TableColumnPlusAfter from '~/components/icons/TableColumnPlusAfter.vue';
import TableColumnRemove from '~/components/icons/TableColumnRemove.vue';
import TableMergeCells from '~/components/icons/TableMergeCells.vue';
import TableSplitCell from '~/components/icons/TableSplitCell.vue';
import TableDeleteIcon from '~/components/icons/TableDeleteIcon.vue';
import CInput from '~/components/CInput.vue';
import { addScheme } from '~/helpers';
import AColorPicker from '~/components/system/AColorPicker.vue';
import InterfaceEditMagicWand from '~/components/streamline/InterfaceEditMagicWand.vue';
import InterfaceHierarchy3 from '~/components/streamline/InterfaceHierarchy3.vue';
import {
    ClearFormattingIcon,
    HighlightIcon,
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    StrikeIcon,
} from '~/components/icons';
import { APP_COLORS, Color } from '~/constants';
import { EditorUtils } from '~/components/editor/utils';
import { ThemeOptions } from '~/helpers/date';
import { TrackEvent } from '~/helpers/decorators';
import {
    TrackingAction,
    TrackingActionSource,
    TrackingType,
} from '~/@types/tracking';
import InterfaceFileClipboard from '~/components/streamline/InterfaceFileClipboard.vue';

@Component({
    components: {
        CInput,
        TableSplitCell,
        TableMergeCells,
        TableColumnRemove,
        TableColumnPlusAfter,
        TableColumnPlusBefore,
        TableRowRemove,
        TableRowPlusAfter,
        TableRowPlusBefore,
        LinkIcon,
        LightningBoltIcon,
        DocumentIcon,
        TerminalIcon,
        CheckIcon,
        TrashIcon,
        CheckCircleIcon,
        TableDeleteIcon,
        CodeIcon,
        ConvertMenu,
        MiscMenu,
        ChevronUpIcon,
        ChevronDownIcon,
        DotsHorizontalIcon,
        ClearFormattingIcon,
        HighlightIcon,
        BoldIcon,
        ItalicIcon,
        UnderlineIcon,
        StrikeIcon,
        InterfaceEditMagicWand,
        InterfaceHierarchy3,
        InterfaceFileClipboard,
    },
    name: 'AcreomBubbleMenu',
})
export default class AcreomBubbleMenu extends Vue {
    @Prop({
        default: null,
    })
    editor!: Editor;

    @Prop({
        default: false,
    })
    isActive!: boolean;

    @Prop({
        default: '',
    })
    documentId!: string;

    @Prop()
    utils!: EditorUtils;

    @Prop({
        required: true,
    })
    visible!: boolean;

    convertToMenuActive: boolean = false;
    miscMenuActive: boolean = false;
    highlightColorMenuActive: boolean = false;
    highlightColor: Color = Color.TURQUOISE;
    editingLink: boolean = false;
    linkText: string = '';

    $refs!: {
        bubbleMenuOne: HTMLElement;
        linkInput: CInput;
        highlighColorMenuButton: HTMLButtonElement;
        miscMenuButton: HTMLButtonElement;
        convertToMenuButton: HTMLButtonElement;
    };

    get selectionType() {
        if (this.editor.isActive('paragraph')) return 'Paragraph';
        if (this.editor.isActive('heading', { level: 1 })) return 'Heading 1';
        if (this.editor.isActive('heading', { level: 2 })) return 'Heading 2';
        if (this.editor.isActive('heading', { level: 3 })) return 'Heading 3';
        if (this.editor.isActive('heading', { level: 4 })) return 'Heading 4';
        return 'Convert To';
    }

    get assistantSettings() {
        return this.$store.getters['vaultSettings/assistantOptions'];
    }

    computeColorHex(color: Color) {
        const theme: ThemeOptions.DARK | ThemeOptions.LIGHT =
            this.$store.getters['appSettings/theme'];

        return APP_COLORS[color][theme].COLOR;
    }

    handleHighlight() {
        const theme: ThemeOptions.DARK | ThemeOptions.LIGHT =
            this.$store.getters['appSettings/theme'];

        const selectedColor = `rgba(${
            APP_COLORS[this.highlightColor][theme].TRIPLET
        }, 0.4)`;
        this.editor
            .chain()
            .focus()
            .toggleHighlight({ color: selectedColor })
            .run();
    }

    handleMouseDown(e: MouseEvent) {
        if (this.$utils.isMobile) {
            e.preventDefault();
        }
    }

    onHighlightColorMenuHandler() {
        this.highlightColorMenuActive = true;
        this.convertToMenuActive = false;
        this.miscMenuActive = false;
        this.$dropdown.show({
            parent: this.$refs.highlighColorMenuButton,
            component: AColorPicker,
            preventBackdrop: true,
            bind: {
                colors: APP_COLORS,
                value: this.highlightColor,
                includeClear: true,
            },
            on: {
                select: (value: Color) => {
                    this.highlightColor = value;
                    this.handleHighlight();
                },
                clear: () => {
                    this.editor.chain().focus().unsetHighlight().run();
                },
            },
            popperOptions: {
                placement: 'bottom-start',
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [-45, 8],
                        },
                    },
                ],
            },
            onClose: () => {
                this.highlightColorMenuActive = false;
            },
        });
    }

    onConvertToMenuHandler() {
        this.highlightColorMenuActive = false;
        this.convertToMenuActive = true;
        this.miscMenuActive = false;
        this.$dropdown.show({
            parent: this.$refs.convertToMenuButton,
            component: ConvertMenu,
            preventBackdrop: true,
            bind: {
                editor: Object.freeze(this.editor),
                documentId: this.documentId,
            },
            on: {
                heading: (level: Level) => {
                    const selection = this.editor.view.state.selection;
                    this.editor.chain().focus().setHeading({ level }).run();
                    this.$nextTick(() => {
                        this.editor.commands.focus(selection.to);
                    });
                    this.convertToMenuActive = false;
                },
                paragraph: () => {
                    const selection = this.editor.view.state.selection;

                    this.editor
                        .chain()
                        .focus()
                        .setParagraph()
                        // double set paragraph to remove any tasks in selection
                        // first set paragraph will convert tasks inside list to paragraph
                        // second set paragraph will convert list to paragraph
                        .setParagraph()
                        .run();
                    this.$nextTick(() => {
                        this.editor.commands.focus(selection.to);
                    });
                    this.convertToMenuActive = false;
                },
                close: () => {
                    this.convertToMenuActive = false;
                },
            },
            popperOptions: {
                placement: 'bottom-start',
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [-4, 8],
                        },
                    },
                ],
            },
            onClose: () => {
                this.convertToMenuActive = false;
            },
        });
    }

    onMiscMenuHandler() {
        this.highlightColorMenuActive = false;
        this.convertToMenuActive = false;
        this.miscMenuActive = true;
        this.$dropdown.show({
            parent: this.$refs.miscMenuButton,
            component: MiscMenu,
            preventBackdrop: true,
            bind: {
                editor: Object.freeze(this.editor),
            },
            on: {
                superscript: () => {
                    this.editor.chain().focus().toggleSuperscript().run();
                },
                subscript: () => {
                    this.editor.chain().focus().toggleSubscript().run();
                },
                kbd: () => {
                    this.editor.commands.focus();
                    this.editor.commands.toggleKbd();
                },
            },
            popperOptions: {
                placement: 'bottom-start',
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [-8, 8],
                        },
                    },
                ],
            },
            onClose: () => {
                this.miscMenuActive = false;
            },
        });
    }

    @TrackEvent(TrackingType.ASSISTANT, {
        action: TrackingAction.SUMMARIZE,
        source: TrackingActionSource.BUBBLE_MENU,
    })
    summarizeHandler() {
        this.highlightColorMenuActive = false;
        this.convertToMenuActive = false;
        this.miscMenuActive = false;
        this.$tracking.trackEvent('assistant', {
            action: 'summary',
        });
        if (this.$utils.assistant.allowAssistantUsage) {
            this.$utils.assistant.incrementAssistantUsage();
            this.$nuxt.$emit(
                `assistant:summary-${this.editor.storage.groupId.value}`,
            );
        }
    }

    makeMermaidHandler() {
        this.highlightColorMenuActive = false;
        this.convertToMenuActive = false;
        this.miscMenuActive = false;
        this.$tracking.trackEvent('assistant', {
            action: 'mermaid',
        });
        if (this.$utils.assistant.allowAssistantUsage) {
            this.$utils.assistant.incrementAssistantUsage();
            this.$nuxt.$emit(
                `assistant:mermaid-${this.editor.storage.groupId.value}`,
            );
        }
    }

    deleteLink() {
        if (!this.editor) return;
        this.editor.chain().focus().unsetLink().run();
        this.editingLink = false;
        this.linkText = '';
    }

    confirmLink(event?: KeyboardEvent) {
        if (event && event.isComposing && !this.$utils.isMobile) return;
        if (!this.editor) return;
        const href = addScheme(this.linkText);
        this.editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href })
            .run();
        this.editingLink = false;
        this.linkText = '';
    }

    setLink() {
        if (!this.editor) return;
        this.editingLink = true;
        if (this.editor.getAttributes('link').href) {
            this.linkText = this.editor.getAttributes('link').href;
        }
        this.$nextTick(() => {
            if (!this.$refs.linkInput) return;
            this.$refs.linkInput.setFocus();
        });
    }

    onCopyTableAsMarkdown(e: MouseEvent) {
        try {
            e.preventDefault();
            e.stopPropagation();
            const { state } = this.editor;
            const { selection } = state;
            const table = findParentNodeClosestToPos(
                selection.ranges[0].$from,
                (node: { type: { name: string } }) => {
                    return node.type.name === 'table';
                },
            );
            const markdown = this.parseTableToMarkdown(table);
            if (!markdown) {
                throw new Error('Parse table to markdown failed');
            }
            const prettyMarkdown = this.beautifyMarkdownTable(markdown);
            return this.$utils.copyToClipboard(
                prettyMarkdown || markdown,
                'Copied to clipboard',
            );

        } catch (error) {
            console.error(error);
            this.$notification.show({
                component: () =>
                    import('@/components/notifications/MiscNotification.vue'),
                bind: {
                    displayText: 'Failed to copy table to clipboard',
                },
            });
        }
    }

    parseTableToMarkdown(
        table: ReturnType<typeof findParentNodeClosestToPos>,
    ): string {
        if (!table) {
            return '';
        }

        const tableNode = JSON.parse(JSON.stringify(table.node));

        if (!tableNode.content) {
            return '';
        }

        type Row = {
            type: string;
            text: string;
            content: Array<{
                type: string;
                text: string;
                content: [];
            }>;
        };

        const rows: Row[] = tableNode.content;

        const extractText = (node: Row): string => {
            if (!node) return '';

            if (node.type === 'text') {
                return node.text ?? '';
            }

            if (Array.isArray(node.content)) {
                return node.content.map(extractText).join('').trim();
            }

            return '';
        };

        const parseRow = (row: Row) =>
            row.content?.map(cell => extractText(cell)) ?? [];

        const headerRow = parseRow(rows[0]);
        const header = `| ${headerRow.join(' | ')} |`;
        const separator = `| ${headerRow.map(() => '---').join(' | ')} |`;

        const bodyRows = rows.slice(1).map((row) => {
            const cells = parseRow(row);
            return `| ${cells.join(' | ')} |`;
        });

        return [header, separator, ...bodyRows].join('\n');
    }

    beautifyMarkdownTable(markdown: string): string {
        const lines = markdown.trim().split('\n');
        const rows = lines.map(line =>
            line
                .trim()
                .slice(1, -1) // remove leading and trailing pipes
                .split('|')
                .map(cell => cell.trim()),
        );

        const columnCount = Math.max(...rows.map(row => row.length));
        const colWidths = new Array(columnCount).fill(0);

        // Find max width of each column
        for (const row of rows) {
            row.forEach((cell, i) => {
                colWidths[i] = Math.max(colWidths[i], cell.length);
            });
        }

        // Pad cells
        const formatRow = (row: string[], isSeparator = false) =>
            '| ' +
            row
                .map((cell, i) => {
                    const pad = colWidths[i] - cell.length;
                    if (isSeparator) {
                        return '-'.repeat(colWidths[i]);
                    }
                    return cell + ' '.repeat(pad);
                })
                .join(' | ') +
            ' |';

        return rows
            .map((row, i) => formatRow(row, i === 1)) // second row is the separator
            .join('\n');
    }
}
</script>

<style scoped lang="scss">
.bubble-menu-wrapper {
    display: flex;
    justify-content: center;

    opacity: 0;
    transition: opacity 0.15s;

    &.visible {
        opacity: 1;
    }
}

.bubble-menu {
    @include frostedGlassBackground;
    padding: 4px;
    border-radius: 12px;
    display: flex;
    position: relative;
    gap: 4px;
    align-items: center;
    vertical-align: middle;
    width: 100%;

    &.link-edit {
        .link-input {
            width: 201px;
            margin-right: 4px;
        }
    }

    button {
        outline: none;
    }

    .divider {
        margin: 0 10px 0px 6px;

        &-bubble-menu {
            margin: 0 -2px 0 0;
        }

        width: 1px;
        height: 24px;
        background: var(--bubble-menu-divider);
    }

    .colorpicker-component {
        display: flex;
        justify-content: space-between;
        gap: 2px;
        align-items: center;
        vertical-align: middle;
        height: 28px;

        &__colorpicker-wrapper {
            display: flex;
            height: 100%;
            align-items: center;
            padding: 2px 6px;
            border-radius: 6px 2px 2px 6px;

            &:hover {
                color: var(--context-menu-button-text-color__hover);
                @include frostedGlassButton;
            }

            &__colorpalette-button {
                border-radius: 2px 6px 6px 2px;
                color: var(--bubble-menu-color-picker-button-color);
                height: 100%;

                &.active,
                &.is-active,
                &:hover {
                    color: var(--context-menu-button-text-color__hover);
                    @include frostedGlassButton;
                }
            }

            &__colorpicker {
                display: block;
                flex-shrink: 0;
                outline: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
            }
        }
    }

    button {
        &.table-button {
            padding: 4px;
            height: 28px;
            font-size: 13px;
            border-radius: 6px;
            font-size: 20px;
            color: var(--bubble-menu-button-color);

            &:not(:last-of-type) {
                margin-right: 4px;
            }

            &:disabled {
                color: var(--bubble-menu-button-color__disabled);
            }

            &.is-active,
            &:hover:not(:disabled) {
                color: var(--context-menu-button-text-color__hover);
                @include frostedGlassButton;
            }
        }

        &.action-button {
            @include font12-500;
            padding: 4px 6px 4px 8px;
            border-radius: 8px;
            color: var(--bubble-menu-button-color);
            font-weight: 500;
            display: flex;
            gap: 4px;
            align-items: center;
            vertical-align: middle;
            white-space: nowrap;

            .icon {
                flex-shrink: 0;
            }

            &.is-active,
            &:hover {
                color: var(--context-menu-button-text-color__hover);
                @include frostedGlassButton;
            }
        }

        &.mark-button {
            @include animateBackgroundColor;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--bubble-menu-button-color);
            font-size: 15px;

            &:disabled {
                color: var(--bubble-menu-button-color__disabled);
            }

            &.is-active,
            &:hover:not(:disabled) {
                color: var(--context-menu-button-text-color__hover);
                @include frostedGlassButton;
            }
        }
    }
}
</style>
