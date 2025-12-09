import { create } from 'zustand'
import {
	deleteTestAndResults,
	readTestsFromFolder,
	saveTest,
	TestFile,
	TestType,
	updateTest,
} from '../api/tests'

interface TestState {
	tests: TestFile[] | null
	loading: boolean
	loadTests: (path: string) => Promise<void>
	updateTestList: (tests: TestFile[]) => void
	saveNewTest: (
		folder: string,
		filename: string,
		testData: TestType
	) => Promise<void>
	updateTest: (
		folder: string,
		oldFilename: string,
		newFilename: string,
		testData: TestType
	) => Promise<void>
	deleteTest: (
		testsFolder: string,
		resultsFolder: string,
		testFilename: string
	) => Promise<void>
}

export const useTest = create<TestState>((set, get) => ({
	tests: null,
	loading: false,
	loadTests: async path => {
		set({ loading: true })
		try {
			const tests = await readTestsFromFolder(path)

			set({ tests, loading: false })
		} catch {
			set({ tests: null, loading: false })
		}
	},
	saveNewTest: async (folder: string, filename: string, testData: TestType) => {
		await saveTest(folder, filename, testData)
	},
	updateTest: async (
		folder: string,
		oldFilename: string,
		newFilename: string,
		testData: TestType
	) => {
		await updateTest(folder, oldFilename, newFilename, testData)
	},
	updateTestList: tests => set({ tests }),
	deleteTest: async (
		testsFolder: string,
		resultsFolder: string,
		testFilename: string
	) => {
		await deleteTestAndResults(testsFolder, resultsFolder, testFilename)
		get().loadTests(testsFolder)
	},
}))
