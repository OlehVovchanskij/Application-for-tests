import { open } from '@tauri-apps/plugin-dialog'
import { useState } from 'react'
import { useConfig } from '../store/useConfig'
import { GoBack } from './ui/GoBack'

export default function Settings() {
	const { config, updateConfig } = useConfig()
	const [testsPath, setTestsPath] = useState(config?.tests_path || '')
	const [resultsPath, setResultsPath] = useState(config?.results_path || '')
	const [saved, setSaved] = useState(false)

	const pickTestsFolder = async () => {
		// if (!isTauri()) {
		// 	console.error('Tauri is not ready')
		// 	return
		// }
		try {
			const folder = await open({ directory: true })
			console.log('Selected folder:', folder)
			if (folder) setTestsPath(folder as string)
		} catch (err) {
			console.error('Dialog error:', err)
		}
	}

	const pickResultsFolder = async () => {
		const path = await open({ directory: true })
		if (path) setResultsPath(path as string)
	}

	const save = async () => {
		await updateConfig({ tests_path: testsPath, results_path: resultsPath })
		console.log('Config saved:', {
			tests_path: testsPath,
			results_path: resultsPath,
			config,
		})
		setSaved(true)
		setTimeout(() => setSaved(false), 2000)
	}

	return (
		<div className='flex flex-col items-center justify-center h-full bg-gradient-to-b from-blue-900 to-black gap-8 text-white'>
			<GoBack className='absolute top-6 left-6' />
			<h2 className='text-2xl'>Налаштування</h2>

			<div className='border rounded-2xl p-4'>
				<label className='mb-4'>Папка тестів:</label>
				<div style={{ display: 'flex', gap: 10 }}>
					<input
						value={testsPath}
						onChange={e => setTestsPath(e.target.value)}
						style={{ width: '300px' }}
					/>
					<button className='cursor-pointer' onClick={pickTestsFolder}>
						Обрати
					</button>
				</div>
			</div>

			<div style={{ marginTop: 20 }}>
				<label>Папка результатів:</label>
				<div style={{ display: 'flex', gap: 10 }}>
					<input
						value={resultsPath}
						onChange={e => setResultsPath(e.target.value)}
						style={{ width: '300px' }}
					/>
					<button onClick={pickResultsFolder}>Обрати</button>
				</div>
			</div>

			<button onClick={save} style={{ marginTop: 30 }}>
				Зберегти
			</button>

			{saved && <p style={{ color: 'green' }}>Збережено!</p>}
		</div>
	)
}
