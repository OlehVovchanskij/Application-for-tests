export const RoutesConfig = {
	HOME: '/',
	TEST: (testId: string) => `/test/${testId}`,
	SETTINGS: '/settings',
	EDITOR: (testID?: string) => `/editor/${testID}`,
	TEST_RESULTS: (testId: string) => `/results/${testId}`,
}
