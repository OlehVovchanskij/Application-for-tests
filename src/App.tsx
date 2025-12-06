import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'

import { useEffect } from 'react'
import { TestEditor } from './components/pages/TestEditor'
import { TestPage } from './components/pages/TestPage'
import { TestResults } from './components/pages/TestResults'
import Welcome from './components/pages/Welcome'
import Settings from './components/Settings'
import { RoutesConfig } from './config/PagesConfig'
import { useConfig } from './store/useConfig'
import { useTest } from './store/useTest'

function App() {
	const { load, config, loading } = useConfig()
	const { loadTests } = useTest()
	useEffect(() => {
		const loadConf = async () => {
			await load()
		}
		loadConf()
	}, [])
	useEffect(() => {
		const fetchTests = async () => {
			if (config) {
				try {
					await loadTests(config.tests_path)
				} catch (e) {}
			}
		}
		fetchTests()
	}, [config, loading])
	return (
		<MainLayout>
			<Routes>
				<Route path={RoutesConfig.HOME} element={<Welcome />} />
				<Route path={RoutesConfig.TEST(':testId')} element={<TestPage />} />
				<Route path={RoutesConfig.SETTINGS} element={<Settings />} />
				<Route path={RoutesConfig.EDITOR(':testID')} element={<TestEditor />} />
				<Route
					path={RoutesConfig.TEST_RESULTS(':testId')}
					element={<TestResults />}
				/>
			</Routes>
		</MainLayout>
	)
}

export default App
