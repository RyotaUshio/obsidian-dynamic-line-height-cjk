import { Plugin } from 'obsidian';
import { dynamicLineHeightField } from 'editing-view';
import { dynamicLineHeightPostProcessor } from 'reading-view';
import { DEFAULT_SETTINGS, DynamicLineHeightSettingTab, DynamicLineHeightSettings } from 'settings';

export default class DynamicLineHeightPlugin extends Plugin {
	settings: DynamicLineHeightSettings;
	_regexp: RegExp;

	async onload() {
		await this.loadSettings();
		this.setRegExp();
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

	setRegExp() {
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

		if (this.settings['Hiragana']) pattern += '\\u3040-\\u309F';
		if (this.settings['Katakana']) pattern += '\\u30A0-\\u30FF';
		if (this.settings['Half-width Katakana']) pattern += '\\uFF65-\\uFF9F';
		if (this.settings['Katakana Phonetic Extensions']) pattern += '\\u31F0-\\u31FF';
		if (this.settings['Japanese Punctuation']) pattern += '\\u3000-\\u303F';

		if (this.settings['Hangul Jamo']) pattern += '\\u1100-\\u11FF';
		if (this.settings['Hangul Jamo Extended-A']) pattern += '\\uA960-\\uA97F';
		if (this.settings['Hangul Jamo Extended-B']) pattern += '\\uD7B0-\\uD7FF';
		if (this.settings['Hangul Compatibility Jamo']) pattern += '\\u3130-\\u318F';
		if (this.settings['Hangul Syllables']) pattern += '\\uAC00-\\uD7AF';

		this._regexp = new RegExp(`[${pattern}]`);
	}

	isCJK(char: string): boolean {
		return this._regexp.test(char);
	}
}
