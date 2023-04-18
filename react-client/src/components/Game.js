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

function Game() {
    const [secretNumber, setSecretNumber] = useState(null);
    const [gameStarted, setGameStarted] = useState(true);
    const [guess, setGuess] = useState([0, 0, 0, 0]);
    const [guessHistory, setGuessHistory] = useState([]);
    const [showScoreForm, setShowScoreForm] = useState(false);
    const [showHighScores, setShowHighScores] = useState(false);
    const [name, setName] = useState('');
    const [score, setScore] = useState(0);
    const [highScores, setHighScores] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

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


    const getHighScores = async () => {
        const response = await fetch('/api/highscores');

        if(!response.ok)
            throw new Error("Error: " + response.status + ": " + response.statusText );
        const data = await response.json();
        setHighScores(data);
    };

    const handleSaveScore = async (name) => {
        try {
            await postScore(name, guessHistory.length);
            await getHighScores();
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

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

            setShowHighScores(true);
            setName(name);
            setScore(score);
            setGuessHistory([]);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };


    const handleCloseException = () => {
        setErrorMessage(null);
    };


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


    const handleGuessSubmit = (guess) => {
        const bulls = guess.split('').filter((digit, index) => digit === secretNumber[index]).length;
        const cows = guess.split('').filter((digit) => secretNumber.includes(digit)).length - bulls;

        setGuess(guess);
        setGuessHistory((prevGuesses) => [...prevGuesses, { guess, bulls, cows }]);
        if (bulls === 4) {
            setShowScoreForm(true);
        }
    };



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











/*

new game button -all the time will be showen, if you press on it it will get a new random number, delete the guess history, do not show the high score table.
Random Number,
Guess Form,
-guess history,
button that will be: 'Enter at least 4 bulls to save score' or 'Save score' with the same conditions,
score form,
high score - will appear if the score is on of the 5 top if it is not: there will be a nice fame over message
 */