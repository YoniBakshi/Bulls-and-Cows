import React, { useState } from 'react';

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

export default ScoreForm;
