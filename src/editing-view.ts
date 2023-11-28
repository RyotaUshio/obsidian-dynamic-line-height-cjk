import { Range } from '@codemirror/state';
import { ViewUpdate, DecorationSet, Decoration, EditorView, PluginValue, ViewPlugin } from '@codemirror/view';
import { isCJK } from 'utils';

export const dynamicLineHeightViewPlugin = ViewPlugin.fromClass(
    class implements PluginValue {
        decorations: DecorationSet;

        constructor(view: EditorView) {
            this.decorations = Decoration.set(this.remake(view));
        }

        update(update: ViewUpdate) {
            if (update.docChanged) {
                this.decorations = this.decorations.map(update.changes);
                update.changes.iterChangedRanges((fromA, toA, fromB, toB) => {
                    this.decorations = this.decorations.update({
                        add: this.remake(update.view, fromB, toB),
                        filter: () => true,
                        filterFrom: update.state.doc.lineAt(fromB).from,
                        filterTo: update.state.doc.lineAt(toB).from
                    });
                });
            } else if (update.viewportChanged) {
                this.decorations = Decoration.set(this.remake(update.view));
            }
        }

        remake(view: EditorView, from?: number, to?: number): Range<Decoration>[] {
            const decorations: Range<Decoration>[] = [];
            const { state } = view;

            for (const range of view.visibleRanges) {
                from = Math.max(from ?? 0, range.from);
                to = Math.min(to ?? state.doc.length, range.to);
                for (let i = state.doc.lineAt(from).number; i <= state.doc.lineAt(to).number; i++) {
                    const line = state.doc.line(i);
                    if (Array.from(line.text).some(char => isCJK(char))) {
                        decorations.push(
                            Decoration.line({ class: 'cjk' }).range(line.from)
                        )
                    }
                }
            }

            return decorations;
        }

    }, {
    decorations: v => v.decorations
});