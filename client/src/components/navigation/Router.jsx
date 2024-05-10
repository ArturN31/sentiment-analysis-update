import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Homepage from '../../pages/Homepage';
import TextAnalysis from '../../pages/TextAnalysis';
import NewsAnalysisByTheme from '../../pages/NewsAnalysisByTheme';
import NewsAnalysisByDate from '../../pages/NewsAnalysisByDate';
import InteractiveMap from '../../pages/InteractiveMap';
import NoMatch from '../../pages/NoMatch';
import Navigation from './Navigation';

const Router = () => {
	const routing = [
		{ path: '/', element: <Homepage /> },
		{ path: '/TextAnalysis', element: <TextAnalysis /> },
		{ path: '/NewsAnalysisTheme', element: <NewsAnalysisByTheme /> },
		{ path: '/NewsAnalysisDate', element: <NewsAnalysisByDate /> },
		{ path: '/InteractiveMap', element: <InteractiveMap /> },
		{ path: '*', element: <NoMatch /> }, //catch-all for non-existent routes
	];

	return (
		<BrowserRouter>
			<Navigation />
			<Routes>
				{routing.map((route) => (
					<Route key={route.path} {...route} />
				))}
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
