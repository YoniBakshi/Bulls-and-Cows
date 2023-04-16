import React, { useState,  } from 'react';

import Header from './Header';
import NewGame from './NewGame';
import RandomNumber from './RandomNumber';
import GuessForm from './GuessForm';
import GuessHistory from './GuessHistory';
import ScoreForm from './ScoreForm';
import HighScores from './HighScores';
import GameInfo from "./GameInfo";

function Game() {
    const [secretNumber, setSecretNumber] = useState(Math.floor(Math.random() * 9000 + 1000).toString());
    const [guess, setGuess] = useState([0, 0, 0, 0]);
    const [guessHistory, setGuessHistory] = useState([]);
    const [showScoreForm, setShowScoreForm] = useState(false);
    const [showHighScores, setShowHighScores] = useState(false);
    const [name, setName] = useState('');
    const [score, setScore] = useState(0);
    const [highScores, setHighScores] = useState([]);

    const getHighScores = async () => {
        const response = await fetch('/api/highscores');
        const data = await response.json();
        setHighScores(data);
    };

    const handleSaveScore = async (name) => {
        await postScore(name, guessHistory.length);
        await getHighScores();
    };

    const postScore = async (name, score) => {
        const response = await fetch('/api/highscores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                score,
            }),
        });
        const data = await response.json();
        setShowHighScores(true);
        setName(name);
        setScore(score);
        setGuessHistory([]);
    };


    const handleNewGameClick = () => {
        setShowScoreForm(false);
        setName('');
        setScore(0);
        setShowHighScores(false);
        setSecretNumber(Math.floor(Math.random() * 9000 + 1000).toString());
        setGuess([0, 0, 0, 0]);
        setGuessHistory([]);
    };


    const handleGuessSubmit = (guess) => {
        let bulls = 0;
        let cows = 0;
        for (let i = 0; i < guess.length; i++)
            if (guess[i] === secretNumber.toString()[i])
                bulls++;
            else
                cows++;

        setGuess(guess);
        setGuessHistory((prevGuesses) => [...prevGuesses, { guess, bulls, cows }]);

        if (bulls === 4)
            setShowScoreForm(true);
    };



    return (
        <div>
            <Header />
            <div className="container">
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