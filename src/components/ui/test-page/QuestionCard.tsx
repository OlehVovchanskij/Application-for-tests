import { FC } from 'react'
import { useTestSession } from '../../../store/useTestSession'
import Button from '../Button'

export const QuestionCard: FC = () => {
	const {
		questions,
		currentQuestionIndex,
		answers,
		toggleAnswer,
		nextQuestion,
	} = useTestSession()

	const question = questions[currentQuestionIndex]
	const currentAnswers = answers[currentQuestionIndex] || []
	const isLastQuestion = currentQuestionIndex === questions.length - 1

	if (!question) return null

	return (
		<div className='space-y-6'>
			<h3 className='text-lg font-medium text-gray-100'>
				{question.questionText}
			</h3>
			<div className='grid grid-cols-1 gap-3'>
				{question.options.map((opt, idx) => {
					const isSelected = currentAnswers.includes(idx)
					return (
						<button
							key={idx}
							className={`py-3 px-4 rounded-lg border text-left transition-all ${
								isSelected
									? 'bg-green-600 border-green-500 hover:bg-green-700'
									: 'border-gray-500 hover:bg-gray-700'
							}`}
							onClick={() => toggleAnswer(idx)}
						>
							{opt}
						</button>
					)
				})}
			</div>
			<div className='pt-6'>
				<Button
					text={isLastQuestion ? 'Завершити тест' : 'Наступне питання'}
					className='py-2 px-6'
					onClick={nextQuestion}
				/>
			</div>
		</div>
	)
}
