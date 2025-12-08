import { open } from '@tauri-apps/plugin-dialog'
import { useState } from 'react'
import { useConfig } from '../store/useConfig'
import Button from './ui/Button'
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

			if (folder) setTestsPath(folder as string)
		} catch (err) {}
	}

	const pickResultsFolder = async () => {
		const path = await open({ directory: true })
		if (path) setResultsPath(path as string)
	}

	const save = async () => {
		await updateConfig({ tests_path: testsPath, results_path: resultsPath })

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

			<div className='border rounded-2xl p-4 mt-5'>
				<label>Папка результатів:</label>
				<div style={{ display: 'flex', gap: 10 }}>
					<input
						value={resultsPath}
						onChange={e => setResultsPath(e.target.value)}
						style={{ width: '300px' }}
					/>
					<button className='cursor-pointer' onClick={pickResultsFolder}>
						Обрати
					</button>
				</div>
			</div>

			<Button
				text='Зберегти'
				onClick={save}
				className='px-10 py-3 text-lg mt-5'
			/>

			{saved && <p style={{ color: 'green' }}>Збережено!</p>}
		</div>
	)
}
