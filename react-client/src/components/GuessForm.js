import React, { useState, useEffect, useRef } from 'react';
import { Form } from "react-bootstrap";
import  "../pinCodeForm.css"

const GuessForm = ({ onGuess }) => {
    const [guess, setGuess] = useState([null, null, null, null]);
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState(false);
    const inputsRef = useRef([]);
    const buttonRef = useRef(null);

    useEffect(() => {
        // Check if any of the numbers are the same
        const filteredGuess = guess.filter((digit) => digit !== null);
        const uniqueGuess = [...new Set(filteredGuess)];
        if (uniqueGuess.length < filteredGuess.length) {
            setErrorMessage('Cannot select the same number twice');
            setError(true);
        }else
             setError(false);

        buttonRef.current.disabled = !!(filteredGuess.length !== 4 || errorMessage);

    }, [guess]);

    const handleSubmit = (event) => {
        event.preventDefault();
        onGuess(guess.join(''));
        setGuess([null, null, null, null]);
    };

    const handleFocus = (e) => {
        e.target.select();
    }

    const handleBackspace = (e, index) => {
        if (e.keyCode === 8) {
            e.preventDefault();

            // Update the current input value with an empty string
            setGuess((prev) => {
                const newPin = [...prev];
                newPin[index] = null;
                return newPin;
            });

            // Move the cursor back to the previous input field
            const prevIndex = index - 1;
            if (prevIndex >= 0) {
                //const prevInput = document.getElementById(`pin-input-${prevIndex}`);
                const prevInput = inputsRef.current[prevIndex];
                prevInput.focus();
                prevInput.select();
            }
        }
    }

    const handleChange = (e, index) => {
        const value = e.target.value.toString()[e.target.value.length - 1];

        if (!isNaN(parseInt(value)) || value === "0") {
            const newGuess = [...guess];
            newGuess.splice(index, 1, value);

            setGuess(newGuess);

            const nextIndex = index + 1;
            if (nextIndex < guess.length) {
                inputsRef.current[nextIndex].focus();
            }
            e.target.style.opacity =1;
        } else if (e.keyCode === 8) {
            e.preventDefault();

            const newGuess = [...guess];
            newGuess.splice(index, 1, null);

            setGuess(newGuess);

            const prevIndex = index - 1;
            if (prevIndex >= 0) {
                inputsRef.current[prevIndex].focus();
            }
            e.target.style.opacity = 0;
        } else {
            setError(true);
            setErrorMessage("Only numbers are allowed");
        }
    };

    return (
        <div className="pin-container">
            <Form onSubmit={handleSubmit}>

                    <div className={"alert alert-danger " + (error ? "show" : "hide" )} role="alert">
                        {errorMessage}
                    </div>

                <Form.Group>
                    <div className="d-flex justify-content-between align-items-center">
                        {guess.map((value, index) => (
                            <Form.Control
                                type="number"
                                maxLength="1"
                                ref={(el) => (inputsRef.current[index] = el)}
                                value={guess[index] || ""}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleBackspace(e, index)}
                                onFocus={handleFocus}
                                className="pin-input-field"

                            />

                        ))}
                    </div>
                </Form.Group>
                <div>
                    <button type="submit"
                            className="btn btn-primary mt-2"
                            ref={buttonRef}>
                                Guess
                    </button>
                </div>
            </Form>

        </div>

    );
};

export default GuessForm;
