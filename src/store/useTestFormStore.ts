import { toast } from 'react-toastify'
import { create } from 'zustand'
import { QuestionType, TestFile } from '../api/tests'
import { useConfig } from './useConfig'
import { useTest } from './useTest'
const isQuestionComplete = (
	questions: QuestionType[],
	index: number | null
): boolean => {
	if (index === null) return true

	const q = questions[index]
	if (!q) return false

	return (
		q.correctAnswerIndex.length > 0 &&
		q.questionText.trim() !== '' &&
		q.options.every(opt => opt.trim() !== '')
	)
}

type TestFormState = {
	isSaved: boolean
	testTitle: string
	testFile: TestFile | null
	testQuestions: QuestionType[]
	activeQuestionIndex: number | null

	// computed (через геттер)
	getActiveQuestion: () => QuestionType | null

	// actions
	setTestFile: (testFile: TestFile | null) => void
	initFromTest: (testFile?: TestFile | null) => void
	setIsSaved: (v: boolean) => void
	setTestTitle: (title: string) => void
	setActiveQuestionIndex: (idx: number | null) => void

	addQuestion: () => void
	updateActiveQuestion: (q: QuestionType) => void
	handleSave: (testFile?: TestFile | null) => Promise<void>
}

export const useTestFormStore = create<TestFormState>((set, get) => ({
	// ---------- state ----------
	isSaved: true,
	testTitle: 'Новий тест',
	testQuestions: [],
	activeQuestionIndex: null,
	testFile: null,
	// ---------- computed ----------
	getActiveQuestion: () => {
		const { activeQuestionIndex, testQuestions } = get()
		return activeQuestionIndex !== null
			? testQuestions[activeQuestionIndex]
			: null
	},
	setTestFile: testFile => {
		set({ testFile })
	},
	// ---------- actions ----------
	initFromTest: testFile => {
		set({
			testTitle: testFile?.content?.title ?? 'Новий тест',
			testQuestions: testFile?.content?.questions ?? [],
			activeQuestionIndex:
				(testFile?.content?.questions?.length ?? 0) > 0 ? 0 : null,
			isSaved: true,
		})
	},

	setIsSaved: v => set({ isSaved: v }),

	setTestTitle: title =>
		set({
			testTitle: title,
			isSaved: false,
		}),

	setActiveQuestionIndex: idx => {
		const { activeQuestionIndex, testQuestions } = get()
		if (isQuestionComplete(testQuestions, activeQuestionIndex)) {
			set({ activeQuestionIndex: idx })
		} else {
			toast(`Будь ласка, завершіть редагування поточного питання. `, {
				type: 'error',
			})
		}
	},

	addQuestion: () => {
		const { testQuestions, activeQuestionIndex } = get()

		const newQuestion: QuestionType = {
			questionText: `Нове питання ${testQuestions.length + 1}`,
			options: ['Варіант 1', 'Варіант 2', 'Варіант 3', 'Варіант 4'],
			correctAnswerIndex: [0],
		}
		if (isQuestionComplete(testQuestions, activeQuestionIndex)) {
			set({
				testQuestions: [...testQuestions, newQuestion],
				activeQuestionIndex: testQuestions.length,
				isSaved: false,
			})
		} else {
			toast(`Будь ласка, завершіть редагування поточного питання. `, {
				type: 'error',
			})
		}
	},

	updateActiveQuestion: updatedQuestion => {
		const { activeQuestionIndex, testQuestions } = get()
		if (activeQuestionIndex === null) return

		set({
			testQuestions: testQuestions.map((q, i) =>
				i === activeQuestionIndex ? updatedQuestion : q
			),
			isSaved: false,
		})
	},

	handleSave: async testFile => {
		const { config } = useConfig.getState()
		const { saveNewTest, updateTest, loadTests } = useTest.getState()

		const { testTitle, testQuestions, activeQuestionIndex } = get()

		if (
			!config?.tests_path ||
			testTitle.trim() === '' ||
			testQuestions.length === 0
		) {
			return
		}
		if (!isQuestionComplete(testQuestions, activeQuestionIndex)) {
			toast(`Будь ласка, завершіть редагування поточного питання. `, {
				type: 'error',
			})
			return
		}
		const sanitizedTitle = testTitle.replace(/\s+/g, '_').toLowerCase()

		if (testFile && testFile.name) {
			updateTest(config.tests_path, testFile.name, testFile.name, {
				id: testFile.content.id,
				title: testTitle,
				questions: testQuestions,
			})
		} else {
			const now = Date.now()
			const newTest = {
				id: `${testTitle.trim().replace(/\s+/g, '_').toLowerCase()}_${now}`,
				title: testTitle,
				questions: testQuestions,
			}
			saveNewTest(config.tests_path, `${sanitizedTitle}_${now}.json`, newTest)
			set({
				testFile: { name: `${sanitizedTitle}_${now}.json`, content: newTest },
			})
		}

		set({ isSaved: true })
		toast('Тест успішно збережено!', { type: 'success' })
		await loadTests(config.tests_path)
	},
}))
