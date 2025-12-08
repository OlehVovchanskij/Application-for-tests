import { FC, useState } from 'react'
import { useTestSession } from '../../../store/useTestSession'
import Button from '../Button'

export const StudentForm: FC = () => {
	const startTest = useTestSession(state => state.startTest)
	const [formData, setFormData] = useState({ name: '', group: '' })

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (formData.name && formData.group) {
			startTest(formData)
		}
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-4 max-w-md'>
			<h3 className='text-lg font-medium'>Введіть свої дані</h3>
			<div>
				<label className='block mb-1'>Ім'я студента</label>
				<input
					type='text'
					value={formData.name}
					onChange={e => setFormData({ ...formData, name: e.target.value })}
					className='w-full p-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:border-green-500'
					required
				/>
			</div>
			<div>
				<label className='block mb-1'>Група</label>
				<input
					type='text'
					value={formData.group}
					onChange={e => setFormData({ ...formData, group: e.target.value })}
					className='w-full p-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:border-green-500'
					required
				/>
			</div>
			<Button type='submit' text='Розпочати тест' className='py-2 px-4' />
		</form>
	)
}
