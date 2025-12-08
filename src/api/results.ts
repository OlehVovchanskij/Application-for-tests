import { invoke } from '@tauri-apps/api/core'

export interface TestResult {
	student_id: string
	student_name: string | null
	student_group: string | null
	score: number
	answers: number[][]
	timestamp: Date
}
export async function saveTestResult(
	folder: string,
	testName: string,
	result: TestResult
): Promise<void> {
	await invoke('save_result', {
		resultsDir: folder,
		testId: testName,
		result,
	})
}
export async function loadTestResults(
	testId: string,
	folder: string
): Promise<TestResult[]> {
	const response = await invoke<TestResult[]>('load_results', {
		testId,
		resultsDir: folder,
	})
	return response
}
