import { NavLink, Outlet } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import NYTimesAPILogo from '../../assets/poweredby_nytimes_200c.png'

const Navigation = () => {
	const navigationLinks = [
		{ link: '/', text: 'Home' },
		{ link: '/TextAnalysis', text: 'Text Analysis' },
		{ link: '/NewsAnalysisTheme', text: 'News Analysis by Theme' },
		{ link: '/NewsAnalysisDate', text: 'News Analysis by Date' },
		{ link: '/InteractiveMap', text: 'Interactive Map' },
	];

	return (
		<>
			<Navbar expand='lg'>
				<Navbar.Brand>
					<a href='https://developer.nytimes.com/' target='_blank'>
						<img src={NYTimesAPILogo} />
					</a>
				</Navbar.Brand>
				<Navbar.Toggle
					aria-controls='navbarScroll'
					className='mx-2'
				/>
				<Navbar.Collapse
					id='navbarScroll'
					className='justify-content-end'>
					<Nav navbarScroll className='d-flex gap-1 gap-lg-2 gap-lg-4 align-items-end mx-3'>
						{navigationLinks.map((page, index) => (
							<Nav.Item key={index}>
								<NavLink to={page.link} className={(navData) => (navData.isActive ? 'text-decoration-none text-black fw-semibold ' : 'text-decoration-none text-white')}>
									{page.text}
								</NavLink>
							</Nav.Item>
						))}
					</Nav>
				</Navbar.Collapse>
			</Navbar>

			<Outlet />
		</>
	);
};

export default Navigation;
