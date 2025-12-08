import { useState } from 'react'

import { usePendingActionStore } from '../../store/usePendingActionStore'
import { useTest } from '../../store/useTest'
import { useTestFormStore } from '../../store/useTestFormStore'
import { IsNotSavedModal } from '../IsNotSavedModal'
import { TestEditorLayout } from '../Layout/TestEditorLayout'
import { TestEditorForm } from '../TestEditorForm'

export const TestEditor = () => {
	const { tests } = useTest()
	const { testFile, setTestFile, isSaved } = useTestFormStore()
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

	const { setPendingAction } = usePendingActionStore()
	const createTest = () => {
		if (!isSaved) {
			setPendingAction(() => {
				setTestFile(null)
			})
			setIsOpenModal(true)
			return
		}

		setTestFile(null)
	}

	return (
		<>
			<div className='grid grid-cols-4 bg-gray-900 h-full'>
				<TestEditorLayout
					setCurrentTest={setTestFile}
					setIsOpenModal={setIsOpenModal}
					currentTest={testFile}
					tests={tests}
					createTest={createTest}
				/>
				<TestEditorForm
					className='col-span-3'
					testFile={testFile}
					key={testFile?.content.id}
				/>
			</div>
			{isOpenModal && (
				<IsNotSavedModal setIsOpenModal={setIsOpenModal} testFile={testFile} />
			)}
		</>
	)
}
