import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Homepage from '../../pages/Homepage';
import TextAnalysis from '../../pages/TextAnalysis';
import NewsAnalysisByTheme from '../../pages/NewsAnalysisByTheme';
import NewsAnalysisByDate from '../../pages/NewsAnalysisByDate';
// import Map from '../../pages/map';
// import NoMatch from '../../pages/no-match';
import Navigation from './Navigation';

//Simple header of the page
const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/'
					element={<Navigation />}>
					<Route
						path='/'
						element={<Homepage />}
					/>{' '}
					<Route
						path='/TextAnalysis'
						element={<TextAnalysis />}
					/>{' '}
					<Route
						path='/NewsAnalysisTheme'
						element={<NewsAnalysisByTheme />}
					/>{' '}
					<Route
						path='/NewsAnalysisDate'
						element={<NewsAnalysisByDate />}
					/>{' '}
					{/* <Route
						path='/Map'
						element={<Map />}
					/>{' '}
					<Route
						path='*'
						element={<NoMatch />}
					/>{' '} */}
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
