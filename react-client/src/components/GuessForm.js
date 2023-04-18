import React, { useState, useEffect } from 'react';
import { Form } from "react-bootstrap";
import  "../pinCodeForm.css"

const GuessForm = ({ onGuess }) => {
    const [guess, setGuess] = useState([null, null, null, null]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Check if any of the numbers are the same
        const filteredGuess = guess.filter((digit) => digit !== null);
        const uniqueGuess = [...new Set(filteredGuess)];
        if (uniqueGuess.length < filteredGuess.length)
            setErrorMessage('Cannot select the same number twice');
         else
             setErrorMessage('');

        document.getElementById('submitGuess').disabled = !!(filteredGuess.length !== 4 || errorMessage);

    }, [guess]);

    const handleSubmit = (event) => {
        event.preventDefault();
        onGuess(guess.join(''));
        setGuess([null, null, null, null]);
    };

    const handleFocus = (e) => {
        e.target.select();
    }

    const handleChange = (e, index) => {
        const value = parseInt(e.target.value);

        // Only allow input if it's a number
        if (!isNaN(value)) {
            // If current input is the last digit and it already contains a number,
            // append the new number to the end of the string
            if (index === guess.length - 1) {
                setGuess((prev) => {
                    const newPin = [...prev];
                    newPin[index] = value.toString().charAt(value.toString().length - 1);
                    return newPin;
                });
            } else {
                // Update the current input box
                setGuess((prev) => {
                    const newPin = [...prev];
                    newPin[index] = value.toString().charAt(value.toString().length - 1);
                    return newPin;
                });
            }

            // Move the cursor to the next input box
            const nextIndex = index + 1;
            if (nextIndex < guess.length) {
                const nextInput = document.getElementById(`pin-input-${nextIndex}`);
                nextInput.focus();
                nextInput.select();
            }
        }
    };

    return (
        <div className="pin-container">
            <Form onSubmit={handleSubmit}>

                    <div className={"alert alert-danger fade " + (errorMessage ? "show" : "fade-out" )} role="alert">
                        {errorMessage}
                    </div>

                <Form.Group>
                    <div className="d-flex justify-content-between align-items-center">
                        {guess.map((value, index) => (
                            <Form.Control
                                type="number"
                                maxLength="1"
                                value={guess[index] ? guess[index] : ""}
                                onChange={(e) => handleChange(e, index)}
                                onFocus={handleFocus}
                                className="pin-input-field"
                                key={index}
                                id={"pin-input-" + index} />

                        ))}
                    </div>
                </Form.Group>
                <div>
                    <button type="submit"
                            className="btn btn-primary mt-2"
                            id="submitGuess">
                                Guess
                    </button>
                </div>
            </Form>

        </div>

    );


    // return (
    //     <form onSubmit={handleSubmit}>
    //         <div className="form-group">
    //             <label htmlFor="guessInput">Guess:</label>
    //             <div className="d-flex">
    //                 {guess.map((digit, index) => (
    //                     <select
    //                         key={index}
    //                         className="form-control mx-2"
    //                         value={digit}
    //                         onChange={(event) => handleSelectChange(event, index)}
    //                         style={{ backgroundColor: '#F7DAD9', color: '#2C2A4A' }}
    //                     >
    //                         {[...Array(10).keys()].map((num) => (
    //                             <option key={num} value={num}>
    //                                 {num}
    //                             </option>
    //                         ))}
    //                     </select>
    //                 ))}
    //             </div>
    //         </div>
    //         <button
    //             type="submit"
    //             className="btn btn-primary mt-2"
    //             style={{ backgroundColor: '#2C2A4A', borderColor: '#2C2A4A', marginLeft: '2rem', marginBottom: '1rem' }}
    //         >
    //             Guess
    //         </button>
    //
    //     </form>
    // );
};

export default GuessForm;






/*
import React, { useState } from 'react';

const GuessForm = ({onGuess}) => {
    const [guess, setGuess] = useState([0, 0, 0, 0]);

    const handleSelectChange = (event, index) => {
        const newGuess = [...guess];
        newGuess[index] = parseInt(event.target.value);
        setGuess(newGuess);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onGuess(guess.join(''));
        setGuess([0, 0, 0, 0]);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="guessInput">Guess:</label>
                <div className="d-flex">
                    {guess.map((digit, index) => (
                        <select
                            key={index}
                            className="form-control mx-2"
                            value={digit}
                            onChange={(event) => handleSelectChange(event, index)}
                        >
                            {[...Array(10).keys()].map((num) => (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            ))}
                        </select>
                    ))}
                </div>
            </div>
            <button type="submit" className="btn btn-primary">
                Guess
            </button>
        </form>
    );
};

export default GuessForm;
*/
