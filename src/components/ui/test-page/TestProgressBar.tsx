import { FC } from 'react'
import { useTestSession } from '../../../store/useTestSession'

interface TestProgressBarProps {
	testTitle: string
}

export const TestProgressBar: FC<TestProgressBarProps> = ({ testTitle }) => {
	const { currentQuestionIndex, questions, status } = useTestSession()

	const total = questions.length
	const isFinished = status === 'finished'
	const progress = total > 0 ? (currentQuestionIndex / total) * 100 : 0
	const finalProgress = isFinished ? 100 : progress

	return (
		<div className='mb-6'>
			<h2 className='text-xl font-semibold mb-2'>{testTitle}</h2>
			<div className='h-3 w-full bg-gray-700 rounded overflow-hidden'>
				<div
					className='h-3 bg-green-500 transition-all duration-300'
					style={{ width: `${finalProgress}%` }}
				/>
			</div>
			<p className='text-sm mt-1'>
				{isFinished
					? 'Тест завершено'
					: `Питання ${currentQuestionIndex + 1} з ${total}`}
			</p>
		</div>
	)
}
