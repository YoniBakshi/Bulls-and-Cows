import React, { useState, useEffect, useRef } from 'react';
import { Form } from "react-bootstrap";
import  "../pinCodeForm.css"

/**
 * GuessForm component
 * @param onGuess
 * @returns {JSX.Element}
 * @constructor
 */
const GuessForm = ({ onGuess }) => {
    const [guess, setGuess] = useState([null, null, null, null]); // this is the guess
    const [errorMessage, setErrorMessage] = useState("");//this is the error message
    const [error, setError] = useState(false);//this is the error state
    const inputsRef = useRef([]);//this is the reference to the input
    const buttonRef = useRef(null);//this is the reference to the button

    /**
     * This function is used to handle the guess
     * @param e
     */
    useEffect(() => {
        // Check if any of the numbers are the same
        const filteredGuess = guess.filter((digit) => digit !== null);
        const uniqueGuess = [...new Set(filteredGuess)];
        if (uniqueGuess.length < filteredGuess.length) {
            setErrorMessage('Cannot select the same number twice');
            setError(true);
        }else
             setError(false);

        buttonRef.current.disabled = (filteredGuess.length !== 4 || error);

    }, [guess]);

    /**
     * This function is used to handle the submit
     * @param event
     */
    const handleSubmit = (event) => {
        event.preventDefault();
        onGuess(guess.join(''));
        setGuess([null, null, null, null]);
    };

    /**
     * This function is used to handle the focus
     * @param e
     */
    const handleFocus = (e) => {
        e.target.select();
    }

    /**
     * This function is used to handle the key down
     * @param e
     * @param index
     */
    const handleKeyDown = (e, index) => {
   if (e.keyCode === 8) {
            e.preventDefault();

            const newGuess = [...guess];
            newGuess.splice(index, 1, null);

            setGuess(newGuess);

            const prevIndex = index - 1;
            if (prevIndex >= 0) {
                inputsRef.current[prevIndex].focus();
            }
        }
    }

    /**
     * This function is used to handle the change
     * @param e
     * @param index
     */
    const handleChange = (e, index) => {
        const value = e.target.value.toString()[e.target.value.length - 1];

        if (!isNaN(parseInt(value)) || value === "0") {
            const newGuess = [...guess];
            newGuess.splice(index, 1, value);

            setGuess(newGuess);
            setError(false)
            const nextIndex = index + 1;
            if (nextIndex < guess.length) {
                inputsRef.current[nextIndex].focus();
            }
            e.target.style.opacity =1;
        } else {
            setError(true);
            setErrorMessage("Only numbers are allowed");
        }
    };
    /**
     * This function is used to render the component
     * @returns {JSX.Element}
     */
    return (
        <div className="pin-container">
            <Form onSubmit={handleSubmit}>

                    <div className={"alert alert2 alert-danger " + (error ? "show" : "hide" )} role="alert">
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
                                onFocus={handleFocus}
                                onKeyDown={(e) => handleKeyDown(e, index)}
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
