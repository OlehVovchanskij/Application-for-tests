import { invoke } from '@tauri-apps/api/core'

export interface TestFile {
	name: string
	content: TestType // JSON об’єкт тесту
}
export interface TestType {
	id: string
	title: string

	questions: QuestionType[]
}
export interface QuestionType {
	questionText: string
	options: string[]
	correctAnswerIndex: number[]
}

/**
 * Читає всі тести з папки
 * @param folder шлях до папки з тестами
 */
export async function readTestsFromFolder(folder: string): Promise<TestFile[]> {
	// викликаємо Rust команду load_tests

	const raw = await invoke<[string, any][]>('load_tests', { folder })

	// конвертуємо в масив TestFile
	return raw.map(([name, content]) => ({ name, content }))
}
export async function saveTest(
	folder: string,
	filename: string,
	testData: TestType
): Promise<void> {
	await invoke('save_test', {
		folder,
		filename,
		testData,
	})
}

export async function updateTest(
	folder: string,
	oldFilename: string,
	newFilename: string,
	testData: TestType
): Promise<void> {
	await invoke('update_test', {
		folder,
		oldFilename,
		newFilename,
		testData,
	})
}
export async function deleteTestAndResults(
	testsFolder: string,
	resultsFolder: string,
	testFilename: string
): Promise<void> {
	await invoke('delete_test', {
		testsFolder,
		resultsFolder,
		testFilename,
	})
}
