import { useState } from 'react';
import "../pinCodeForm.css"

/**
 * This component is used to display the game info popup
 * @returns {JSX.Element}
 * @constructor
 */
function GameInfo() {
    const [showPopup, setShowPopup] = useState(false);//this is the state variable

    /**
     * This function is used to toggle the popup
     * @returns {void}
     */
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    /**
     * This function is used to display the game info popup
     * @returns {JSX.Element}
     */
    return (
        <>
            <button className='btn btn-primary mb-4' onClick={togglePopup}>How to Play</button>

                <div className={"gameInfo " + (showPopup ? "show" : "hide")} >
                    <h2>How to Play Bulls and Cows</h2>
                    <p>Bulls and Cows is a number guessing game played between two players. One player thinks of a secret four-digit number, while the other player tries to guess the number.</p>
                    <p>After each guess, the player who thought of the secret number provides feedback by giving the number of bulls and cows in the guess. A bull is a digit in the guess that is in the correct position, while a cow is a digit in the guess that is present in the secret number but in the wrong position.</p>
                    <p>The game continues until the guesser correctly guesses the secret number.</p>
                    <button onClick={togglePopup}>Close</button>
                </div>

        </>
    );
}

export default GameInfo;
