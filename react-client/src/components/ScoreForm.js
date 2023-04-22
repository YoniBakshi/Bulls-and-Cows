import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

/**
 * ScoreForm component is used to display a form to submit the score
 * @param onScoreSubmit
 * @returns {JSX.Element}
 * @constructor
 */
function ScoreForm({ onScoreSubmit }) {
    const [showForm, setShowForm] = useState(false);//this is the state of the form
    const [name, setName] = useState('');//this is the name

    /**
     * This function is used to handle the submit
     * @param e
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        onScoreSubmit(name);
        setName('');
        setShowForm(false);
    };

    /**
     * This function is used to handle the button click
     */
    const handleButtonClick = () => {
        setShowForm(true);
    };

    if (!showForm) {
        return (
            <Button variant="primary" onClick={handleButtonClick}>
                Save Score
            </Button>
        );
    }

    /**
     * This function is used to return the form
     * @returns {JSX.Element}
     */
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Please enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}

export default ScoreForm;
