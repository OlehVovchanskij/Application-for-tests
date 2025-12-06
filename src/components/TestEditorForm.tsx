import { FC, useState } from 'react'
import { QuestionType, TestFile } from '../api/tests'
import { useConfig } from '../store/useConfig'
import { useTest } from '../store/useTest'
import Button from './ui/Button'
import { Checkbox } from './ui/Checkbox'
import { Field } from './ui/Field'

interface TestEditorFormProps extends React.HTMLAttributes<HTMLDivElement> {
	testFile?: TestFile | null
}

export const TestEditorForm: FC<TestEditorFormProps> = ({
	testFile,
	className,
}) => {
	const { saveNewTest, updateTest, loadTests } = useTest()
	const { config } = useConfig()
	const [testTitle, setTestTitle] = useState<string>(
		testFile?.content ? testFile?.content.title : 'Новий тест'
	)

	const [testQuestions, setTestQuestions] = useState<QuestionType[]>(
		testFile?.content ? testFile?.content.questions : []
	)

	const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(
		(testFile?.content?.questions?.length ?? 0) > 0 ? 0 : null
	)
	const toggleCorrectAnswer = (index: number) => {
		if (!activeQuestion) return

		const exists = activeQuestion.correctAnswerIndex.includes(index)

		const updatedIndexes = exists
			? activeQuestion.correctAnswerIndex.filter(i => i !== index)
			: [...activeQuestion.correctAnswerIndex, index]
		updateActiveQuestion({
			...activeQuestion,
			correctAnswerIndex: updatedIndexes,
		})
	}

	const activeQuestion =
		activeQuestionIndex !== null ? testQuestions[activeQuestionIndex] : null

	const addQuestion = () => {
		const newQuestion: QuestionType = {
			questionText: `Нове питання ${testQuestions.length + 1}`,
			options: ['Варіант 1', 'Варіант 2', 'Варіант 3', 'Варіант 4'],
			correctAnswerIndex: [0],
		}
		setTestQuestions(prev => [...prev, newQuestion])
		setActiveQuestionIndex(testQuestions.length)
	}

	const updateActiveQuestion = (updatedQuestion: QuestionType) => {
		if (activeQuestionIndex === null) return
		setTestQuestions(prev =>
			prev.map((q, idx) => (idx === activeQuestionIndex ? updatedQuestion : q))
		)
	}

	const removeOption = (optionIndex: number) => {
		if (!activeQuestion) return
		const newOptions = activeQuestion.options.filter(
			(_, i) => i !== optionIndex
		)
		updateActiveQuestion({ ...activeQuestion, options: newOptions })
	}

	const updateOptionText = (optionIndex: number, text: string) => {
		if (!activeQuestion) return
		const newOptions = activeQuestion.options.map((opt, i) =>
			i === optionIndex ? text : opt
		)
		updateActiveQuestion({ ...activeQuestion, options: newOptions })
	}

	const saveTest = async () => {
		if (
			config?.tests_path &&
			testQuestions.length > 0 &&
			testTitle.trim() !== ''
		) {
			if (testFile && testFile.name) {
				// Оновлення існуючого тесту

				updateTest(
					config.tests_path, // папка для збереження тестів
					testFile.name,
					`${testTitle.replace(/\s+/g, '_').toLowerCase()}.json`,
					{
						id: testFile.content.id,
						title: testTitle,
						questions: testQuestions,
					}
				)
			} else {
				// Збереження нового тесту
				const filename = `${testTitle.replace(/\s+/g, '_').toLowerCase()}.json`
				saveNewTest(config.tests_path, filename, {
					id: `test_${Date.now()}`,
					title: testTitle,
					questions: testQuestions,
				})
			}
			await loadTests(config.tests_path)
		}
	}

	return (
		<div className={`p-2 ${className} text-white`}>
			<div className='flex items-center mb-4 '>
				<h2 className='text-2xl font-bold focus:outline-none'>Назва тесту:</h2>
				<Field
					className='ml-4 p-2 text-2xl font-bold  flex-1'
					type='text'
					value={testTitle}
					onChange={e => setTestTitle(e.target.value)}
				/>
			</div>
			<div className='flex gap-3 flex-wrap'>
				{testQuestions.length === 0 ? (
					<Button
						onClick={addQuestion}
						className='py-2 px-4'
						text='Додати перше питання'
					/>
				) : (
					<>
						{testQuestions.map((_, index) => (
							<div
								onClick={() => setActiveQuestionIndex(index)}
								key={index}
								className={`flex items-center justify-center p-2 rounded-lg w-10 h-10 cursor-pointer transition ${
									activeQuestionIndex === index
										? 'bg-blue-800'
										: 'bg-indigo-600 hover:bg-blue-600'
								}`}
							>
								<p className='text-lg font-bold text-white'>{index + 1}</p>
							</div>
						))}
						<Button
							onClick={addQuestion}
							className='py-2 px-4'
							text='Додати питання'
						/>
					</>
				)}
			</div>
			<Button
				onClick={saveTest}
				className='mt-4 py-2 px-4'
				text='Зберегти тест'
			/>
			<div>
				{activeQuestion && (
					<div className='mt-6' key={activeQuestionIndex}>
						<h3 className='text-xl font-semibold mb-2'>
							Питання {activeQuestion.questionText}:
						</h3>
						<Field
							className='border-white/40
							 rounded-xl border p-2 mb-4 w-full'
							value={activeQuestion.questionText}
							onChange={e =>
								updateActiveQuestion({
									...activeQuestion,
									questionText: e.target.value,
								})
							}
						/>
						<ul className='list-disc list-inside'>
							{activeQuestion.options.map((option, idx) => (
								<div className='flex items-center mb-2' key={idx}>
									<li className='list-none flex gap-2 items-center w-full'>
										<Checkbox
											checked={activeQuestion.correctAnswerIndex.includes(idx)}
											onChange={() => toggleCorrectAnswer(idx)}
										/>

										<Field
											className='border-white/40  rounded-xl border p-2 w-full'
											type='text'
											value={option}
											onChange={e => updateOptionText(idx, e.target.value)}
										/>
									</li>
									<Button
										onClick={() => removeOption(idx)}
										className='ml-2 p-1 '
										text='Видалити'
										colorType='delete'
									/>
								</div>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	)
}
