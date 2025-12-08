import { FC } from 'react'
import { QuestionType } from '../../../api/tests'
import Button from '../Button'

interface QuestionNavigatorProps {
	questions: QuestionType[]
	activeIndex: number | null
	onSelectIndex: (index: number) => void
	onAddQuestion: () => void
}

export const QuestionNavigator: FC<QuestionNavigatorProps> = ({
	questions,
	activeIndex,
	onSelectIndex,
	onAddQuestion,
}) => {
	if (questions.length === 0) {
		return (
			<Button
				onClick={onAddQuestion}
				className='py-2 px-4 mr-2'
				text='Додати перше питання'
			/>
		)
	}

	return (
		<div className='flex gap-3 flex-wrap'>
			{questions.map((_, index) => (
				<div
					onClick={() => onSelectIndex(index)}
					key={index}
					className={`flex items-center justify-center p-2 rounded-lg w-10 h-10 cursor-pointer transition ${
						activeIndex === index
							? 'bg-blue-800'
							: 'bg-indigo-600 hover:bg-blue-600'
					}`}
				>
					<p className='text-lg font-bold text-white'>{index + 1}</p>
				</div>
			))}
			<Button
				onClick={onAddQuestion}
				className='py-2 px-4'
				text='Додати питання'
			/>
		</div>
	)
}
