import React, { useState, useEffect } from 'react';

import Header from './Header';
import NewGame from './NewGame';
import RandomNumber from './RandomNumber';
import GuessForm from './GuessForm';
import GuessHistory from './GuessHistory';
import ScoreForm from './ScoreForm';
import HighScores from './HighScores';
import GameInfo from "./GameInfo";
import ExceptionComponent from "./ExceptionComponent";

/**
 * @description This component is the main game component
 * @returns {JSX.Element}
 * @constructor
 */
function Game() {
    const [secretNumber, setSecretNumber] = useState(null); //this is the secret number
    const [gameStarted, setGameStarted] = useState(true);//this is the state of the game
    const [guess, setGuess] = useState([0, 0, 0, 0]);//this is the guess
    const [guessHistory, setGuessHistory] = useState([]);//this is the guess history
    const [showScoreForm, setShowScoreForm] = useState(false);//this is the state of the score form
    const [showHighScores, setShowHighScores] = useState(false);//this is the state of the high scores
    const [name, setName] = useState('');//this is the name of the player
    const [score, setScore] = useState(0);//this is the score of the player
    const [highScores, setHighScores] = useState([]);//this is the high scores
    const [errorMessage, setErrorMessage] = useState(null);//this is the error message

    /** This function is used to start a new game */
    useEffect(() => {
        if (gameStarted) {
            let secretNumber = '';
            while (secretNumber.length < 4) {
                let newDigit = Math.floor(Math.random() * 10);
                if (!secretNumber.includes(newDigit.toString())) {
                    secretNumber += newDigit.toString();
                }
            }
            setSecretNumber(secretNumber);
            setGameStarted(false);
        }
    }, [gameStarted]);

    /** This function is used to handle the guess */
    const getHighScores = async () => {
        const response = await fetch('/api/highscores');

        if(!response.ok)
            throw new Error("Error: " + response.status + ": " + response.statusText );
        const data = await response.json();
        setHighScores(data);
    };
    /** This function is used to handle the guess and the guess history
     *
     * @param name
     * @returns {Promise<void>}
     */
    const handleSaveScore = async (name) => {
        try {
            await postScore(name, guessHistory.length);
            await getHighScores();
        } catch (error) {
            setErrorMessage(error.message);
        }
    };
    /** This function is used to post the score to the database
     *
     * @param name
     * @param score
     * @returns {Promise<void>}
     */
    const postScore = async (name, score) => {
        try {
            const response = await fetch("/api/highscores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    score,
                }),
            });
            if(!response.ok)
                throw new Error("Error: " + response.status + ": " + response.statusText );
            //set all the states to the default values
            setShowHighScores(true);
            setName(name);
            setScore(score);
            setGuessHistory([]);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    /** This function is used to close the exception message */
    const handleCloseException = () => {
        setErrorMessage(null);
    };

    /** This function is used to handle the new game click */
    const handleNewGameClick = () => {
        setShowScoreForm(false);
        setName('');
        setScore(0);
        setShowHighScores(false);
        //setSecretNumber();
        setGameStarted(true);
        setGuess([0, 0, 0, 0]);
        setGuessHistory([]);
    };

    /** This function is used to handle the guess submit
     *
     * @param guess
     */
    const handleGuessSubmit = (guess) => {
        const bulls = guess.split('').filter((digit, index) => digit === secretNumber[index]).length;
        const cows = guess.split('').filter((digit) => secretNumber.includes(digit)).length - bulls;

        setGuess(guess);
        setGuessHistory((prevGuesses) => [...prevGuesses, { guess, bulls, cows }]);
        if (bulls === 4) {
            setShowScoreForm(true);
        }
    };


    /** This function is used to render the game */
    return (
        <div>
            <Header />
            <div className="container">
                {errorMessage && (
                    <ExceptionComponent
                        message={errorMessage}
                        handleCloseException={handleCloseException}
                    />
                )}
                {showHighScores ? (
                    <>
                        <NewGame text="New Game" onClick={handleNewGameClick} />
                        <HighScores name={name} score={score} highScores={highScores} />
                    </>
                ) : (
                    <>
                        <div className="button-group">
                            <NewGame text="New Game" onClick={handleNewGameClick} />
                            <GameInfo />
                        </div>
                        <RandomNumber number={secretNumber} />
                        <GuessForm onGuess={handleGuessSubmit} />
                        <GuessHistory guessHistory={guessHistory} />
                        {showScoreForm && <ScoreForm onScoreSubmit={handleSaveScore} />}
                    </>
                )}
            </div>
        </div>
    );

}

export default Game;
