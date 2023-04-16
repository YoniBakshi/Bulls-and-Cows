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





/*import React, { useState } from 'react';

const ScoreForm = (props) => {
    const [name, setName] = useState('');

    const handleInputChange = (event) => {
        setName(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        props.onSubmit(name);
    }

    return (
        <div className="my-4">
            <h2>Enter your name to save your score:</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default ScoreForm;*/
