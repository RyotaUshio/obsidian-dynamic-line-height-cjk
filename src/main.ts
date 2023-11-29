import { Plugin } from 'obsidian';
import { dynamicLineHeightField } from 'editing-view';
import { dynamicLineHeightPostProcessor } from 'reading-view';
import { DEFAULT_SETTINGS, DynamicLineHeightSettingTab, DynamicLineHeightSettings } from 'settings';

export default class DynamicLineHeightPlugin extends Plugin {
	settings: DynamicLineHeightSettings;

	async onload() {
		await this.loadSettings();
		await this.saveSettings();
		this.addSettingTab(new DynamicLineHeightSettingTab(this));

		this.registerMarkdownPostProcessor(dynamicLineHeightPostProcessor(this));
		this.registerEditorExtension(dynamicLineHeightField(this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	isCJK(char: string): boolean {
		let pattern = ''
		if (this.settings['CJK Unified Ideographs']) pattern += '\\u4e00-\\u9fff';
		if (this.settings['CJK Unified Ideographs Extension A']) pattern += '\\u3400-\\u4dbf';
		if (this.settings['CJK Unified Ideographs Extension B']) pattern += '\\u20000-\\u2A6DF';
		if (this.settings['CJK Unified Ideographs Extension C']) pattern += '\\u2A700-\\u2B73F';
		if (this.settings['CJK Unified Ideographs Extension D']) pattern += '\\u2B740-\\u2B81F';
		if (this.settings['CJK Unified Ideographs Extension E']) pattern += '\\u2B820-\\u2CEAF';
		if (this.settings['CJK Unified Ideographs Extension F']) pattern += '\\u2CEB0-\\u2EBEF';
		if (this.settings['CJK Unified Ideographs Extension G']) pattern += '\\u30000-\\u3134F';
		if (this.settings['CJK Unified Ideographs Extension H']) pattern += '\\u31350-\\u323AF';
		if (this.settings['CJK Unified Ideographs Extension I']) pattern += '\\u2EBF0-\\u2EE5F';
		if (this.settings['CJK Compatibility Ideographs']) pattern += '\\uF900-\\uFAFF';
		return new RegExp(`[${pattern}]`).test(char);
	}
}
