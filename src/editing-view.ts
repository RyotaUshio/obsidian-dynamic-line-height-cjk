import { syntaxTree } from '@codemirror/language';
import { Range, StateField, EditorState } from '@codemirror/state';
import { DecorationSet, Decoration, EditorView } from '@codemirror/view';
import DynamicLineHeightPlugin from 'main';


/**
 * At first, I tried to use a ViewPlugin to implement this feature, but it didn't work for notes with a callout, for example:
 * 
 * ---
 * > [!NOTE] 
 * > 
 * 
 * 日本語
 * こんにちは
 * 
 * English
 * Hello
 * ---
 * 
 * I don't understand why, but the two lines in Japanese ("日本語", "こんにちは") were not line-decorated
 * when the cursor is outside of the callout. (When it's inside the callout, the lines are decorated.)
 * 
 * So for now, I decided to use a StateField below instead, and it worked.
 */

// export const dynamicLineHeightViewPlugin = ViewPlugin.fromClass(
//     class implements PluginValue {
//         decorations: DecorationSet;

//         constructor(view: EditorView) {
//             this.decorations = Decoration.set(this.remake(view));
//         }

//         update(update: ViewUpdate) {
//             if (update.docChanged) {
//                 this.decorations = this.decorations.map(update.changes);
//                 update.changes.iterChangedRanges((fromA, toA, fromB, toB) => {
//                     this.decorations = this.decorations.update({
//                         add: this.remake(update.view, fromB, toB),
//                         filter: () => false,
//                         filterFrom: update.state.doc.lineAt(fromB).from,
//                         filterTo: update.state.doc.lineAt(toB).from
//                     });
//                 });
//             } else if (update.viewportChanged) {
//                 this.decorations = Decoration.set(this.remake(update.view));
//             }
//         }

//         remake(view: EditorView, from?: number, to?: number): Range<Decoration>[] {
//             const decorations: Range<Decoration>[] = [];
//             const { state } = view;

//             for (const range of view.visibleRanges) {
//                 from = Math.max(from ?? 0, range.from);
//                 to = Math.min(to ?? state.doc.length, range.to);
//                 for (let i = state.doc.lineAt(from).number; i <= state.doc.lineAt(to).number; i++) {
//                     const line = state.doc.line(i);
//                     if (Array.from(line.text).some(char => isCJK(char))) {
//                         decorations.push(
//                             Decoration.line({ class: 'cjk' }).range(line.from, line.from)
//                         )
//                     }
//                 }
//             }

//             return decorations;
//         }

//     }, {
//     decorations: v => v.decorations
// });


export const dynamicLineHeightField = (plugin: DynamicLineHeightPlugin) => StateField.define<DecorationSet>({
    create(state) {
        return Decoration.set(remake(plugin, state));
    },
    update(prev, tr) {
        if (tr.docChanged) {
            let ret = prev.map(tr.changes);
            tr.changes.iterChangedRanges((fromA, toA, fromB, toB) => {
                ret = ret.update({
                    add: remake(plugin, tr.state, fromB, toB),
                    filter: () => false,
                    filterFrom: tr.state.doc.lineAt(fromB).from,
                    filterTo: tr.state.doc.lineAt(toB).from
                });
            });
            return ret;
        } else {
            return prev;
            // return tr.startState.doc.length ? prev : Decoration.set(remake(tr.state));
        }
    },
    provide(field) {
        return EditorView.decorations.from(field);
    }
});

function remake(plugin: DynamicLineHeightPlugin, state: EditorState, from?: number, to?: number): Range<Decoration>[] {
    const decorations: Range<Decoration>[] = [];
    const tree = syntaxTree(state);

    from = from ?? 0;
    to = to ?? state.doc.length;
    for (let i = state.doc.lineAt(from).number; i <= state.doc.lineAt(to).number; i++) {
        const line = state.doc.line(i);

        if (plugin.containsCJK(line.text)) {
            decorations.push(
                Decoration.line({ class: 'cjk' }).range(line.from)
            )
        }
    }
    return decorations;
}
