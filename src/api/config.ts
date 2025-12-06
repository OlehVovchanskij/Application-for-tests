import { invoke } from '@tauri-apps/api/core'

export interface AppConfig {
	tests_path: string
	results_path: string
}
export function isTauri() {
	return '__TAURI_IPC__' in window
}

// збереження конфігу
export async function saveConfig(config: AppConfig) {
	return invoke('save_config', { config })
}

// завантаження конфігу
export async function loadConfig(): Promise<AppConfig | null> {
	return invoke('load_config')
}
