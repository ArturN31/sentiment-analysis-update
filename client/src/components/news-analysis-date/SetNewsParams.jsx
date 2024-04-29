import { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

//import NewsFetch from "./NewsFetch";
import DatePicker from "react-date-picker";

function SetNewsParams() {
    const [params, setParams] = useState({
        year: 2023,
        month: 1,
        count: 1,
    });

    const [date, setDate] = useState(new Date());

    const handleDateChange = (date) => {
        setParams({ ...params, year: date.getFullYear(), month: date.getMonth() + 1 });
    };

    const handleCountChange = (e) => {
        setParams({ ...params, count: e.target.value });
    };

    const onChange = (date) => {
        setDate(date);
        handleDateChange(date);
    }

    const handleSubmit = async () => {
        try {
            const apiURL = 'http://localhost:3001/api/getNewsByDate';
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ month: params.month, year: params.year })
            }
            const response = fetch(apiURL, options);
            //const data = await response.json()
        } catch (error) { console.error(error); }
    };

    return (
        <>
            <Row>
                <Col>
                    <Form className="col-6 mx-auto user-input-div text-center">
                        <Row className="text-center">
                            <Col>
                                <p>First choose the date on the calendar presented bellow, then press submit and enter the article count to be displayed.</p>
                            </Col>
                        </Row>
                        <Form.Group controlId="f_themes">
                            <DatePicker
                                onChange={onChange}
                                value={date}
                                maxDetail='year'
                                minDate={new Date("01-01-1852")}
                                maxDate={new Date()}
                                className='mx-auto' />
                            <p className="mt-3">Chosen date: {date.toDateString().split(' ')[1]} {date.toDateString().split(' ')[3]}</p>
                        </Form.Group>
                        <Button className="m-4 mt-2 btn-submit" onClick={() => { handleSubmit() }}>
                            Submit
                        </Button>
                        <Form.Group controlId="f_count">
                            <Form.Label>Article Count:</Form.Label>
                            <Form.Control
                                type="number"
                                onChange={handleCountChange}
                                min='0'
                                max='20'
                                className="w-50 mx-auto"
                            />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    {/* <NewsFetch count={params.count} /> */}
                </Col>
            </Row>
        </>
    );
}

export default SetNewsParams;