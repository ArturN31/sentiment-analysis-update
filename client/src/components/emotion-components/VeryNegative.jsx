import { Row, Col } from 'react-bootstrap';
//import image from './images/sad-face.png';

const VeryNegative = () => {
	return (
		<div className='emotion-div sadness'>
			<Row>
				{/* <Col className='col-6 col-md-4 col-lg-4 order-12 d-flex align-items-center mx-auto mb-4 emotion-div-image-container'>
					<Image
						src={image}
						className='img-fluid'></Image>
				</Col> */}
				<Col className='col-12 col-md-8 col-lg-8 order-1 d-flex align-items-center'>
					<h1>Very Negative</h1>
				</Col>
			</Row>
		</div>
	);
};

export default VeryNegative;
