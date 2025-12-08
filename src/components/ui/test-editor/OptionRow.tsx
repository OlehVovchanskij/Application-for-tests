import { FC } from 'react'
import Button from '../Button'
import { Checkbox } from '../Checkbox'
import { Field } from '../Field'

interface OptionRowProps {
	optionText: string
	isCorrect: boolean
	onToggleCorrect: () => void
	onChangeText: (text: string) => void
	onDelete: () => void
}

export const OptionRow: FC<OptionRowProps> = ({
	optionText,
	isCorrect,
	onToggleCorrect,
	onChangeText,
	onDelete,
}) => {
	return (
		<div className='flex items-center mb-2'>
			<li className='list-none flex gap-2 items-center w-full'>
				<Checkbox checked={isCorrect} onChange={onToggleCorrect} />
				<Field
					className='border-white/40 rounded-xl border p-2 w-full'
					type='text'
					value={optionText}
					onChange={(e: any) => onChangeText(e.target.value)}
				/>
			</li>
			<Button
				onClick={onDelete}
				className='ml-2 p-1'
				text='Видалити'
				colorType='delete'
			/>
		</div>
	)
}
