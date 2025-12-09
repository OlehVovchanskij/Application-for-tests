import { X } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { TestType } from '../../api/tests'
import { RoutesConfig } from '../../config/PagesConfig'
import { useConfig } from '../../store/useConfig'
import { useTest } from '../../store/useTest'
import Button from '../ui/Button'

function ChooseTestModal({
	closeModal,
}: {
	closeModal: Dispatch<SetStateAction<boolean>>
}) {
	const navigate = useNavigate()

	const { tests, deleteTest } = useTest()
	const { config } = useConfig()
	const onSelectTest = (test: TestType) => {
		navigate(RoutesConfig.TEST(test.id))
	}
	const handleDeleteTest = (test: TestType) => {
		if (!config) return
		deleteTest(config?.tests_path, config?.results_path, test.id)
	}
	return (
		<div className='fixed inset-0 flex items-center  justify-center bg-black/60 backdrop-blur-sm animate-fade-in'>
			<div className='bg-zinc-900 max-h-[80%] p-6 w-11/12 max-w-2xl rounded-2xl relative shadow-xl animate-scale-in'>
				<button
					onClick={() => closeModal(false)}
					className='absolute top-4 right-4 text-white hover:text-red-400 transition'
				>
					<X size={24} />
				</button>

				<h2 className='text-white text-center font-bold text-3xl mb-4'>
					Виберіть тест
				</h2>

				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 overflow-y-auto max-h-[60vh]'>
					{tests &&
						tests.map(test => (
							<div
								key={test.content.id}
								className='border border-white/10 p-4 space-y-3 rounded-xl bg-white/5 hover:bg-white/10 transition shadow-md hover:shadow-lg'
							>
								<h3 className='text-white font-semibold text-lg'>
									{test.content.title}
								</h3>

								<Button
									onClick={() => onSelectTest(test.content)}
									text='Вибрати'
									className='w-full py-2 '
								/>
								<Button
									onClick={() => {
										navigate(RoutesConfig.TEST_RESULTS(test.content.id))
									}}
									text='Переглянути результати'
									className='w-full py-2 '
								/>
								<Button
									onClick={() => handleDeleteTest(test.content)}
									colorType='delete'
									text='Видалити'
									className='w-full py-2 '
								/>
							</div>
						))}
				</div>
			</div>

			{/* animations */}
			<style>{`
				@keyframes fade-in {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				@keyframes scale-in {
					from { opacity: 0; transform: scale(.95); }
					to { opacity: 1; transform: scale(1); }
				}
				.animate-fade-in { animation: fade-in .2s ease-out; }
				.animate-scale-in { animation: scale-in .2s ease-out; }
			`}</style>
		</div>
	)
}

export default ChooseTestModal
