import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { saveTestResult } from '../../api/results'
import { TestFile } from '../../api/tests'
import { RoutesConfig } from '../../config/PagesConfig'
import { useConfig } from '../../store/useConfig'
import { useTest } from '../../store/useTest'

export const TestPage: React.FC = () => {
	const { testId } = useParams<{ testId: string }>()
	const { tests } = useTest()
	const { config } = useConfig()
	const testsData = tests?.map((t: TestFile) => t.content)
	const test = testsData?.find(t => t.id === testId)
	const totalQuestions = test?.questions.length || 0

	const [currentIndex, setCurrentIndex] = useState(0)
	const [answers, setAnswers] = useState<number[]>(
		Array(totalQuestions).fill(-1)
	)
	const [studentName, setStudentName] = useState('')
	const [studentGroup, setStudentGroup] = useState('')

	if (!test) return <div className='p-6 text-white'>Тест не знайдено</div>

	const handleAnswer = (optionIndex: number) => {
		const newAnswers = [...answers]
		newAnswers[currentIndex] = optionIndex
		setAnswers(newAnswers)

		if (currentIndex < totalQuestions) setCurrentIndex(currentIndex + 1)
	}
	// Обчислення оцінки в 5 бальній системі
	// перепиши під декілька правильних відповідей добавляти бал лише при всіх правильних відповідях
	const score = Math.round(
		(answers.filter((ans, i) =>
			test.questions[i].correctAnswerIndex.includes(ans)
		).length /
			totalQuestions) *
			5
	)
	const progress = (currentIndex / totalQuestions) * 100

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (config?.results_path) {
			saveTestResult(config?.results_path, test.title.trim(), {
				student_id: `${studentName.trim()}_${studentGroup.trim()}`,
				student_name: studentName.trim(),
				score,
				answers: answers,
				timestamp: new Date(),
			})
			alert(`Тест завершено! Ваша оцінка: ${score}/5`)
		}
	}

	return (
		<div className='flex h-full bg-gray-900 text-white'>
			{/* Left Score Panel */}
			<div className='w-1/5 bg-gray-800 p-4 flex flex-col items-center justify-center'>
				<Link
					to={RoutesConfig.HOME}
					className='absolute top-3 w-1/6 text-center text-white px-4 py-2 border border-white rounded bg-red-700 transition'
				>
					Відмінити
				</Link>
				<h3 className='text-lg font-bold mb-2'>Оцінка</h3>
				<div className='text-4xl font-bold'>{score}/5</div>
			</div>

			{/* Main Test Area */}
			<div className='flex-1 p-6 flex flex-col'>
				{/* Header */}
				<div className='mb-6'>
					<h2 className='text-xl font-semibold mb-2'>{test.title}</h2>
					<div className='h-3 w-full bg-gray-700 rounded'>
						<div
							className='h-3 bg-green-500 rounded'
							style={{ width: `${progress}%` }}
						/>
					</div>
					<p className='text-sm mt-1'>
						{currentIndex < totalQuestions
							? `Питання ${currentIndex + 1} з ${totalQuestions}`
							: '(Завершено)'}
					</p>
				</div>

				{/* Questions or Form */}
				{currentIndex < totalQuestions ? (
					<div className='space-y-4'>
						<h3 className='text-lg font-medium'>
							{test.questions[currentIndex].questionText}
						</h3>
						<div className='grid grid-cols-1  gap-2'>
							{test.questions[currentIndex].options.map((opt, idx) => (
								<button
									key={idx}
									className={`py-2 px-4 rounded-lg border border-gray-500 hover:bg-gray-700 transition ${
										answers[currentIndex] === idx ? 'bg-green-600' : ''
									}`}
									onClick={() => handleAnswer(idx)}
								>
									{opt}
								</button>
							))}
						</div>
					</div>
				) : (
					<form onSubmit={handleSubmit} className='space-y-4 max-w-md'>
						<h3 className='text-lg font-medium'>Завершення тесту</h3>
						<div>
							<label className='block mb-1'>Ім'я студента</label>
							<input
								type='text'
								value={studentName}
								onChange={e => setStudentName(e.target.value)}
								className='w-full p-2 rounded-lg bg-gray-800 border border-gray-600'
								required
							/>
						</div>
						<div>
							<label className='block mb-1'>Група</label>
							<input
								type='text'
								value={studentGroup}
								onChange={e => setStudentGroup(e.target.value)}
								className='w-full p-2 rounded-lg bg-gray-800 border border-gray-600'
								required
							/>
						</div>
						<button
							type='submit'
							className='w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-medium'
						>
							Завершити тест
						</button>
					</form>
				)}
			</div>
		</div>
	)
}
