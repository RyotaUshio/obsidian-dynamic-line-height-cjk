import { MarkdownPostProcessorContext } from "obsidian";
import { isCJK } from "utils";

export const dynamicLineHeightPostProcessor = (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
    for (const paragraph of el.querySelectorAll('p, li')) {
        if (paragraph.textContent) {
            if (Array.from(paragraph.textContent).some(char => isCJK(char))) {
                paragraph.classList.add('cjk');
            }
        }
    }
}