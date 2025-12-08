import { create } from 'zustand'
import { QuestionType } from '../api/tests'

interface Student {
	name: string
	group: string
}

interface TestSessionState {
	status: 'idle' | 'running' | 'finished'
	student: Student
	questions: QuestionType[]
	currentQuestionIndex: number
	answers: number[][] // Масив масивів (мульти-вибір)
	score: number
	correctAnswersCount: number

	initSession: (questions: QuestionType[]) => void
	startTest: (student: Student) => void
	toggleAnswer: (optionIndex: number) => void
	nextQuestion: () => void
	finishTest: () => void
	resetSession: () => void
}

const shuffle = <T>(array: T[]): T[] => {
	const result = [...array]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

const isAnswerCorrect = (correct: number[], user: number[]): boolean => {
	if (correct.length !== user.length) return false
	const correctSorted = [...correct].sort((a, b) => a - b)
	const userSorted = [...user].sort((a, b) => a - b)
	return correctSorted.every((val, idx) => val === userSorted[idx])
}

export const useTestSession = create<TestSessionState>((set, get) => ({
	status: 'idle',
	student: { name: '', group: '' },
	questions: [],
	currentQuestionIndex: 0,
	answers: [],
	score: 0,
	correctAnswersCount: 0,

	initSession: questions => {
		set({
			status: 'idle',
			questions: shuffle(questions),
			currentQuestionIndex: 0,
			answers: [],
			score: 0,
			correctAnswersCount: 0,
			student: { name: '', group: '' },
		})
	},

	startTest: student => {
		const total = get().questions.length
		set({
			status: 'running',
			student,
			answers: Array.from({ length: total }, () => []),
		})
	},

	toggleAnswer: optionIndex => {
		const { answers, currentQuestionIndex } = get()
		const currentAnswers = answers[currentQuestionIndex] || []

		let newStepAnswers: number[]
		if (currentAnswers.includes(optionIndex)) {
			newStepAnswers = currentAnswers.filter(idx => idx !== optionIndex)
		} else {
			newStepAnswers = [...currentAnswers, optionIndex]
		}

		const newAnswers = [...answers]
		newAnswers[currentQuestionIndex] = newStepAnswers
		set({ answers: newAnswers })
	},

	nextQuestion: () => {
		const { questions, currentQuestionIndex, answers, correctAnswersCount } =
			get()

		const currentQuestion = questions[currentQuestionIndex]
		const userAnswers = answers[currentQuestionIndex] || []
		const isCorrect = isAnswerCorrect(
			currentQuestion.correctAnswerIndex,
			userAnswers
		)

		const newCorrectCount = isCorrect
			? correctAnswersCount + 1
			: correctAnswersCount
		const totalQuestions = questions.length

		// Перерахунок оцінки
		const newScore =
			totalQuestions > 0
				? Math.round((newCorrectCount / totalQuestions) * 5)
				: 0

		if (currentQuestionIndex < totalQuestions - 1) {
			set({
				correctAnswersCount: newCorrectCount,
				score: newScore,
				currentQuestionIndex: currentQuestionIndex + 1,
			})
		} else {
			set({
				correctAnswersCount: newCorrectCount,
				score: newScore,
				status: 'finished',
			})
		}
	},

	finishTest: () => set({ status: 'finished' }),

	resetSession: () => set({ status: 'idle', questions: [], answers: [] }),
}))
