import { FC, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { TestFile } from '../api/tests'
import { useTestFormStore } from '../store/useTestFormStore'
import Button from './ui/Button'
import { Field } from './ui/Field'
import { QuestionEditor } from './ui/test-editor/QuestionEditor'
import { QuestionNavigator } from './ui/test-editor/QuestionNavigator'

interface TestEditorFormProps extends React.HTMLAttributes<HTMLDivElement> {
	testFile?: TestFile | null
}

export const TestEditorForm: FC<TestEditorFormProps> = ({
	testFile,
	className,
}) => {
	const {
		testTitle,
		testQuestions,
		activeQuestionIndex,
		getActiveQuestion,

		setActiveQuestionIndex,
		addQuestion,
		updateActiveQuestion,
		handleSave,
		setTestTitle,
		initFromTest,
	} = useTestFormStore()

	const activeQuestion = getActiveQuestion()

	useEffect(() => {
		initFromTest(testFile)
	}, [testFile, initFromTest])

	return (
		<div className={`p-2 ${className} text-white`}>
			<div className='flex items-center mb-4'>
				<h2 className='text-2xl font-bold'>Назва тесту:</h2>
				<Field
					className='ml-4 p-2 text-2xl font-bold flex-1'
					type='text'
					value={testTitle}
					onChange={e => setTestTitle(e.target.value)}
				/>
			</div>

			<QuestionNavigator
				questions={testQuestions}
				activeIndex={activeQuestionIndex}
				onSelectIndex={setActiveQuestionIndex}
				onAddQuestion={addQuestion}
			/>

			<Button
				onClick={() => {
					handleSave(testFile)
				}} // ✅ передаємо testFile
				className='mt-4 py-2 px-4'
				text='Зберегти тест'
			/>

			{activeQuestion && activeQuestionIndex !== null && (
				<QuestionEditor
					key={activeQuestionIndex}
					index={activeQuestionIndex}
					question={activeQuestion}
					onUpdate={updateActiveQuestion}
				/>
			)}
			<ToastContainer
				toastClassName={() =>
					'relative flex p-4 rounded-xl border-2 border-white/30 bg-slate-900 text-white shadow-lg cursor-pointer'
				}
				className='text-md font-medium'
				progressClassName='bg-green-500'
			/>
		</div>
	)
}
