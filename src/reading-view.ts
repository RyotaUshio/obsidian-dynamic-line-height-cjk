import DynamicLineHeightPlugin from 'main';
import { MarkdownPostProcessorContext } from "obsidian";

export const dynamicLineHeightPostProcessor = (plugin: DynamicLineHeightPlugin) => (el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
    for (const paragraph of el.querySelectorAll('p, li')) {
        if (paragraph.textContent) {
            if (plugin.containsCJK(paragraph.textContent)) {
                paragraph.classList.add('cjk');
            }
        }
    }
}