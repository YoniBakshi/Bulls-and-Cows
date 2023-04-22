import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function ScoreForm({ onScoreSubmit }) {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onScoreSubmit(name);
        setName('');
        setShowForm(false);
    };

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
