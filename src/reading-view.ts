import DynamicLineHeightPlugin from 'main';
import { MarkdownPostProcessorContext } from "obsidian";

export const dynamicLineHeightPostProcessor = (plugin: DynamicLineHeightPlugin) => (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
    for (const paragraph of el.querySelectorAll('p, li')) {
        if (paragraph.textContent) {
            if (Array.from(paragraph.textContent).some(char => plugin.isCJK(char))) {
                paragraph.classList.add('cjk');
            }
        }
    }
}