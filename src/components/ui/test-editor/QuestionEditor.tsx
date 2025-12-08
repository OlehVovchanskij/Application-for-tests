import { FC } from 'react'

import { QuestionType } from '../../../api/tests'

import { useTestFormStore } from '../../../store/useTestFormStore'
import Button from '../Button'
import { Field } from '../Field'
import { OptionRow } from './OptionRow'

interface QuestionEditorProps {
	question: QuestionType
	index: number
	onUpdate: (updated: QuestionType) => void
}

export const QuestionEditor: FC<QuestionEditorProps> = ({
	question,
	index,
	onUpdate,
}) => {
	const { setIsSaved, isSaved } = useTestFormStore()
	const toggleCorrectAnswer = (optIndex: number) => {
		const exists = question.correctAnswerIndex.includes(optIndex)
		const updatedIndexes = exists
			? question.correctAnswerIndex.filter(i => i !== optIndex)
			: [...question.correctAnswerIndex, optIndex]
		onUpdate({ ...question, correctAnswerIndex: updatedIndexes })
		setIsSaved(false)
	}

	const updateOptionText = (optIndex: number, text: string) => {
		const newOptions = question.options.map((opt, i) =>
			i === optIndex ? text : opt
		)
		onUpdate({ ...question, options: newOptions })
		setIsSaved(false)
	}

	const removeOption = (optIndex: number) => {
		const newOptions = question.options.filter((_, i) => {
			return i !== optIndex
		})
		const newCorrectIndexes = question.correctAnswerIndex
			.filter(i => i !== optIndex)
			.map(i => (i > optIndex ? i - 1 : i))
		onUpdate({
			...question,
			options: newOptions,
			correctAnswerIndex: newCorrectIndexes,
		})
		setIsSaved(false)
	}
	const addOption = () => {
		const newOptions = [
			...question.options,
			`Варіант ${question.options.length + 1}`,
		]
		onUpdate({ ...question, options: newOptions })
		setIsSaved(false)
	}
	return (
		<div className='mt-6'>
			<h3 className='text-xl font-semibold mb-2'>
				Питання {question.questionText}:
			</h3>
			<Field
				className='border-white/40 rounded-xl border p-2 mb-4 w-full'
				value={question.questionText}
				onChange={e =>
					onUpdate({
						...question,
						questionText: e.target.value,
					})
				}
			/>
			<ul className='list-disc list-inside'>
				{question.options.map((option, idx) => (
					<OptionRow
						key={idx}
						optionText={option}
						isCorrect={question.correctAnswerIndex.includes(idx)}
						onToggleCorrect={() => toggleCorrectAnswer(idx)}
						onChangeText={text => updateOptionText(idx, text)}
						onDelete={() => removeOption(idx)}
					/>
				))}
				{/* add new option */}
				<Button
					onClick={addOption}
					className=' mt-3 p-2'
					text='Додати варіант'
				/>
			</ul>
		</div>
	)
}
