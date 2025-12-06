// generate 10 test data entries
export const tests = Array.from({ length: 20 }, (_, i) => ({
	id: `test-${i + 1}`,
	title: `Тест №${i + 1}`,

	questions: Array.from({ length: 10 }, (_, j) => ({
		questionText: `Питання ${j + 1} для тесту №${i + 1}`,
		options: ['Варіант 1', 'Варіант 2', 'Варіант 3', 'Варіант 4'],
		correctAnswerIndex: j % 4,
	})),
}))
