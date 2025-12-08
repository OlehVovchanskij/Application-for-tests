import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { saveTestResult } from '../../api/results'
import { RoutesConfig } from '../../config/PagesConfig'
import { useConfig } from '../../store/useConfig'
import { useTest } from '../../store/useTest'
import { useTestSession } from '../../store/useTestSession'
import Button from '../ui/Button'
import { QuestionCard } from '../ui/test-page/QuestionCard'
import { StudentForm } from '../ui/test-page/StudentForm'
import { TestProgressBar } from '../ui/test-page/TestProgressBar'
import { TestSidebar } from '../ui/test-page/TestSidebar'

export const TestPage: React.FC = () => {
	const { testId } = useParams<{ testId: string }>()
	const { tests } = useTest()
	const { config } = useConfig()
	const session = useTestSession()

	const testFile = tests?.map(t => t.content).find(t => t.id === testId)

	useEffect(() => {
		if (testFile) {
			session.initSession(testFile.questions)
		}
		return () => session.resetSession()
	}, [testFile?.id]) // eslint-disable-line

	useEffect(() => {
		if (session.status === 'finished' && config?.results_path && testFile) {
			saveTestResult(config.results_path, testFile.title.trim(), {
				student_id: `${session.student.name.trim()}_${session.student.group.trim()}`,
				student_name: session.student.name.trim(),
				student_group: session.student.group.trim(),
				score: session.score,
				answers: session.answers,
				timestamp: new Date(),
			})
		}
	}, [session.status]) // eslint-disable-line

	if (!testFile) return <div className='p-6 text-white'>Тест не знайдено</div>

	return (
		<div className='flex h-full bg-gray-900 text-white'>
			<TestSidebar />

			<div className='flex-1 p-6 flex flex-col'>
				<TestProgressBar testTitle={testFile.title} />

				{session.status === 'idle' && <StudentForm />}

				{session.status === 'running' && <QuestionCard />}

				{session.status === 'finished' && (
					<div className='flex flex-col items-center justify-center h-full space-y-4'>
						<h3 className='text-2xl font-bold text-green-400'>
							Тест успішно завершено!
						</h3>
						<p className='text-xl'>Ваш результат: {session.score} з 5</p>
						<Link to={RoutesConfig.HOME}>
							<Button text='На головну' className='py-2 px-6' />
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}
