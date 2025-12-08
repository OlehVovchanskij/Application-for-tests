import { TestFile } from '../api/tests'
import { usePendingActionStore } from '../store/usePendingActionStore'
import { useTestFormStore } from '../store/useTestFormStore'
import Button from './ui/Button'
interface IsNotSavedModalProps {
	setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>
	testFile: TestFile | null
}
export const IsNotSavedModal = ({
	setIsOpenModal,
	testFile,
}: IsNotSavedModalProps) => {
	const { handleSave } = useTestFormStore()
	const { executePendingAction, clearPendingAction } = usePendingActionStore()
	return (
		<div className='fixed inset-0 flex items-center  justify-center bg-black/60 backdrop-blur-sm animate-fade-in'>
			<div className='bg-zinc-900 max-h-[80%] p-6 text-white max-w-2xl rounded-2xl relative shadow-xl animate-scale-in'>
				<h2 className='text-2xl font-bold mb-4'>Зміни не збережено</h2>
				<p className='mb-6'>
					Ви маєте незбережені зміни. Бажаєте зберегти їх перед виходом?
				</p>
				<div className='flex justify-between space-x-4'>
					<Button
						text='Скасувати'
						className='px-4 py-2 '
						colorType='gray'
						onClick={() => {
							clearPendingAction()
							setIsOpenModal(false)
						}}
					/>

					<Button
						text='Зберегти'
						className='px-4 py-2'
						onClick={() => {
							handleSave(testFile)
							executePendingAction()
							setIsOpenModal(false)
						}}
					/>

					<Button
						text='Не зберігати'
						colorType='delete'
						className='px-4 py-2'
						onClick={() => {
							setIsOpenModal(false)
							executePendingAction()
						}}
					/>
				</div>
			</div>
		</div>
	)
}
