import { clsx as cn } from 'clsx'
import { FC } from 'react'
import { TestFile } from '../../api/tests'
import { usePendingActionStore } from '../../store/usePendingActionStore'
import { useTestFormStore } from '../../store/useTestFormStore'
import Button from '../ui/Button'
import { GoBack } from '../ui/GoBack'
interface TestEditorLayoutProps {
	setCurrentTest: (test: any) => void
	tests: TestFile[] | null
	currentTest?: TestFile | null
	createTest: () => void
	setIsOpenModal: (isOpen: boolean) => void
}
export const TestEditorLayout: FC<TestEditorLayoutProps> = ({
	currentTest,
	setCurrentTest,
	tests,
	createTest,
	setIsOpenModal,
}) => {
	const { isSaved } = useTestFormStore()
	const { setPendingAction } = usePendingActionStore()
	return (
		<div>
			<aside className='flex flex-col h-full col-span-1 justify-between bg-gray-800 text-white p-4'>
				<div>
					<GoBack color='white' />

					<h2 className='text-lg font-semibold'>Тести</h2>
					{tests ? (
						tests?.map(test => (
							<div
								onClick={() => {
									if (!isSaved) {
										setPendingAction(() => {
											setCurrentTest(test)
										})
										setIsOpenModal(true)

										return
									}
									setCurrentTest(test)
								}}
								key={test.content.id}
								className='py-2 border-b cursor-pointer'
							>
								<h3
									className={cn(
										'font-bold',
										currentTest?.content.id === test.content.id &&
											'text-blue-500'
									)}
								>
									{test.content.title}
								</h3>
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
		</div>
	)
}
