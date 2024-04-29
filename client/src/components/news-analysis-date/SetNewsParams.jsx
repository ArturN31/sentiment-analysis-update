import { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

import NewsFetch from "./NewsFetch";
import DatePicker from "react-date-picker";

function SetNewsParams() {
    const [params, setParams] = useState({
        year: 2023,
        month: 1,
        count: 1,
        maxCount: 1,
    });

    const [date, setDate] = useState(new Date());

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleDateChange = (date) => {
        setParams({ ...params, year: date.getFullYear(), month: date.getMonth() + 1 });
        setIsSubmitted(false);
    };

    const handleCountChange = (e) => {
        setParams({ ...params, count: e.target.value });
        setIsSubmitted(false);
    };

    // sets params for count
    const handleMaxCountChange = (passedMaxCount) => {
        setParams({ ...params, maxCount: passedMaxCount });
    };

    const handleDatePicker = (date) => {
        setDate(date);
        handleDateChange(date);
    }

    const handleSubmit = () => {
        setIsSubmitted(true)
    };

    return (
        <Row>
            <Col>
                <Form className="col-6 mx-auto user-input-div text-center">
                    <Row className="text-center">
                        <Col>
                            <p>First choose the date on the calendar presented bellow, then press submit and enter the article count to be displayed.</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="f_date">
                                <DatePicker
                                    onChange={handleDatePicker}
                                    value={date}
                                    maxDetail='year'
                                    minDate={new Date("01-01-1852")}
                                    maxDate={new Date()}
                                    className='mx-auto' />
                                <p className="mt-3">Chosen date: {date.toDateString().split(' ')[1]} {date.toDateString().split(' ')[3]}</p>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="f_count">
                                <Form.Label>Article Count:</Form.Label>
                                <Form.Control
                                    type="number"
                                    onChange={handleCountChange}
                                    value={params.count}
                                    min='0'
                                    max={params.maxCount >= 1 && params.maxCount <= 20 ? params.maxCount : 20}
                                    className="w-50 mx-auto"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='d-flex justify-content-center'>
                            <Button
                                onClick={() => {
                                    handleSubmit();
                                }}>
                                Sumbit
                            </Button>
                        </Col>
                    </Row>
                </Form>
                {isSubmitted ? <NewsFetch params={params} handleMaxCountChange={handleMaxCountChange} /> : ''}
            </Col>
        </Row>


    );
}

export default SetNewsParams;