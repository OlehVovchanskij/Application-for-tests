import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { loadTestResults, TestResult } from '../../api/results'
import { useConfig } from '../../store/useConfig'
import { GoBack } from '../ui/GoBack'

export const TestResults = () => {
	const params = useParams<{ testId: string }>()
	const [results, setResults] = useState<TestResult[]>([])
	const { config } = useConfig()
	useEffect(() => {
		async function fetchResults() {
			if (config?.results_path && params.testId) {
				const res = await loadTestResults(params.testId, config.results_path)
				const sortedRes = res.sort(
					(a, b) =>
						new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
				)
				setResults(sortedRes)
			}
		}

		fetchResults()
	}, [])

	return (
		<div className='h-full bg-gradient-to-b from-blue-900 to-black overflow-auto'>
			<GoBack className='absolute top-6 left-6' color='white' />
			<h1 className='text-white text-center text-2xl p-6 '>
				Результати тесту: {params.testId}
			</h1>
			<div className='p-6 space-y-4'>
				{results.length === 0 ? (
					<p className='text-white'>Результатів немає.</p>
				) : (
					results.map((result, index) => (
						<div key={index} className='bg-white/10 p-4 rounded-lg shadow-md'>
							<p className='text-white'>
								<strong>Ім'я студента:</strong> {result.student_name}
							</p>
							<p className='text-white'>
								<strong>Оцінка:</strong> {result.score}/5
							</p>
							<p className='text-white'>
								<strong>Дата:</strong>{' '}
								{new Date(result.timestamp).toLocaleString()}
							</p>
						</div>
					))
				)}
			</div>
		</div>
	)
}
