import DynamicLineHeightPlugin from "main";
import { PluginSettingTab, Setting } from "obsidian";

export interface DynamicLineHeightSettings {
    "CJK Unified Ideographs": boolean;
    "CJK Unified Ideographs Extension A": boolean;
    "CJK Unified Ideographs Extension B": boolean;
    "CJK Unified Ideographs Extension C": boolean;
    "CJK Unified Ideographs Extension D": boolean;
    "CJK Unified Ideographs Extension E": boolean;
    "CJK Unified Ideographs Extension F": boolean;
    "CJK Unified Ideographs Extension G": boolean;
    "CJK Unified Ideographs Extension H": boolean;
    "CJK Unified Ideographs Extension I": boolean;
    "CJK Compatibility Ideographs": boolean;
}

export const DEFAULT_SETTINGS: DynamicLineHeightSettings = {
    "CJK Unified Ideographs": true,
    "CJK Unified Ideographs Extension A": false,
    "CJK Unified Ideographs Extension B": false,
    "CJK Unified Ideographs Extension C": false,
    "CJK Unified Ideographs Extension D": false,
    "CJK Unified Ideographs Extension E": false,
    "CJK Unified Ideographs Extension F": false,
    "CJK Unified Ideographs Extension G": false,
    "CJK Unified Ideographs Extension H": false,
    "CJK Unified Ideographs Extension I": false,
    "CJK Compatibility Ideographs": false
};

export class DynamicLineHeightSettingTab extends PluginSettingTab {
    constructor(public plugin: DynamicLineHeightPlugin) {
        super(plugin.app, plugin);
    }

    display(): void {
        this.containerEl.empty();
        
        new Setting(this.containerEl)
            .setDesc('Choose which Unicode blocks should be considered CJK.')

        this.addToggleSetting('CJK Unified Ideographs')
            .setDesc('The most common CJK ideographs used in modern Chinese, Japanese, Korean and Vietnamese characters.');
        this.addToggleSetting('CJK Unified Ideographs Extension A');
        this.addToggleSetting('CJK Unified Ideographs Extension B');
        this.addToggleSetting('CJK Unified Ideographs Extension C');
        this.addToggleSetting('CJK Unified Ideographs Extension D');
        this.addToggleSetting('CJK Unified Ideographs Extension E');
        this.addToggleSetting('CJK Unified Ideographs Extension F');
        this.addToggleSetting('CJK Unified Ideographs Extension G');
        this.addToggleSetting('CJK Unified Ideographs Extension H');
        this.addToggleSetting('CJK Unified Ideographs Extension I');
        this.addToggleSetting('CJK Compatibility Ideographs');
    }

    addToggleSetting(key: keyof DynamicLineHeightSettings) {
        return new Setting(this.containerEl)
            .setName(key)
            .addToggle((toggle) => toggle
                .setValue(this.plugin.settings[key])
                .onChange(async (value) => {
                    this.plugin.settings[key] = value;
                    await this.plugin.saveSettings();
                }));
    }
}
