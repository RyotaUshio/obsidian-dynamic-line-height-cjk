import { Plugin } from 'obsidian';
import { dynamicLineHeightField } from 'editing-view';
import { dynamicLineHeightPostProcessor } from 'reading-view';

export default class MyPlugin extends Plugin {
	async onload() {
		this.registerMarkdownPostProcessor(dynamicLineHeightPostProcessor);
		this.registerEditorExtension(dynamicLineHeightField);
	}
}
