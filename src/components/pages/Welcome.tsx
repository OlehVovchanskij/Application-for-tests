import { Settings } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RoutesConfig } from '../../config/PagesConfig'
import Button from '../ui/Button'
import ChooseTestModal from './ChooseTestModal'

function Welcome() {
	const navigate = useNavigate()
	const [isOpenModal, setIsOpenModal] = useState(false)

	const handleSetting = () => {
		navigate(RoutesConfig.SETTINGS)
	}
	const handlerOpenModal = () => {
		setIsOpenModal(true)
	}
	return (
		<div className='flex flex-col items-center justify-center h-full bg-gradient-to-b from-blue-900 to-black gap-8'>
			<Settings
				className='absolute top-4 right-4'
				size={46}
				color='white'
				onClick={handleSetting}
			/>
			<h1 className='text-3xl font-bold text-white text-center'>
				Ласкаво просимо до додатку для тестування!
			</h1>
			<Button
				text='Обрати тест'
				onClick={handlerOpenModal}
				className='px-10 py-3 text-2xl'
			/>
			<Link
				to={RoutesConfig.EDITOR()}
				className='text-white text-lg  border-2 p-2 rounded  transition-colors hover:border-blue-600 hover:text-blue-400'
			>
				Редактор тестів
			</Link>
			{isOpenModal && <ChooseTestModal closeModal={setIsOpenModal} />}
		</div>
	)
}

export default Welcome
