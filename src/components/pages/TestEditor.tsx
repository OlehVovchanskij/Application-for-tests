import { useState } from 'react'
import { TestFile } from '../../api/tests'
import { useTest } from '../../store/useTest'
import { TestEditorForm } from '../TestEditorForm'
import Button from '../ui/Button'
import { GoBack } from '../ui/GoBack'

export const TestEditor = () => {
	const { tests } = useTest()
	const [currentTest, setCurrentTest] = useState<TestFile | null>(null)
	const createTest = () => {
		setCurrentTest(null)
	}
	return (
		<div className='grid grid-cols-4 bg-gray-900 h-full'>
			<aside className='flex flex-col col-span-1 justify-between bg-gray-800 text-white p-4'>
				<div>
					<GoBack color='white' />

					<h2 className='text-lg font-semibold'>Тести</h2>
					{tests ? (
						tests?.map(test => (
							<div
								onClick={() => {
									setCurrentTest(test)
								}}
								key={test.content.id}
								className='py-2 border-b cursor-pointer'
							>
								<h3 className='font-bold'>{test.content.title}</h3>
							</div>
						))
					) : (
						<p>Тестів поки немає</p>
					)}
				</div>
				<Button
					onClick={createTest}
					text='Додати тест'
					className='py-2 w-full'
				/>
			</aside>
			<TestEditorForm
				className='col-span-3'
				testFile={currentTest}
				key={currentTest?.content.id}
			/>
		</div>
	)
}
