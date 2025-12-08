import { create } from 'zustand'
import { AppConfig, loadConfig, saveConfig } from '../api/config'

interface ConfigState {
	config: AppConfig | null
	loading: boolean
	load: () => Promise<void>
	updateConfig: (c: AppConfig) => Promise<void>
}

export const useConfig = create<ConfigState>(set => ({
	config: null,
	loading: true,

	load: async () => {
		try {
			const cfg = await loadConfig()

			set({ config: cfg, loading: false })
		} catch {
			set({ config: null, loading: false })
		}
	},

	updateConfig: async c => {
		await saveConfig(c)
		set({ config: c })
	},
}))
