import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RoutesConfig } from '../../../config/PagesConfig'
import { useTestSession } from '../../../store/useTestSession'
import Button from '../Button'

export const TestSidebar: FC = () => {
	const score = useTestSession(state => state.score)
	const navigate = useNavigate()
	const [showConfirm, setShowConfirm] = useState(false)

	const handleConfirmExit = () => {
		navigate(RoutesConfig.HOME)
	}

	return (
		<>
			<div className='w-1/5 bg-gray-800 p-4 flex flex-col items-center justify-center relative'>
				<Button
					text='Відмінити'
					className='absolute right-3 top-3 px-4 py-2'
					colorType='delete'
					onClick={() => setShowConfirm(true)}
				/>
				<h3 className='text-lg font-bold mb-2 mt-12'>Оцінка</h3>
				<div className='text-4xl font-bold'>{score}/5</div>
			</div>

			{showConfirm && (
				<div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center'>
					<div className='bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl max-w-sm w-full mx-4'>
						<h3 className='text-xl font-bold text-white mb-4 text-center'>
							Завершити тест?
						</h3>
						<p className='text-gray-300 text-center mb-6'>
							Прогрес буде втрачено. Ви впевнені, що хочете вийти?
						</p>
						<div className='flex gap-3 justify-center'>
							<Button
								text='Ні, продовжити'
								className='px-4 py-2 bg-gray-600 hover:bg-gray-500'
								onClick={() => setShowConfirm(false)}
							/>
							<Button
								text='Так, вийти'
								className='px-4 py-2'
								colorType='delete'
								onClick={handleConfirmExit}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
