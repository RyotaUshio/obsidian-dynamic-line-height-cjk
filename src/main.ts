import { Plugin } from 'obsidian';
import { dynamicLineHeightViewPlugin } from 'editing-view';
import { dynamicLineHeightPostProcessor } from 'reading-view';

export default class MyPlugin extends Plugin {
	async onload() {
		this.registerMarkdownPostProcessor(dynamicLineHeightPostProcessor);
		this.registerEditorExtension(dynamicLineHeightViewPlugin);
	}
}
