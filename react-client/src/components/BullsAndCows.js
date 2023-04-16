import React, { useState } from 'react';
import Header from './Header';
import ScoreForm from './ScoreForm';
import HighScores from './HighScores';


function BullsAndCows({ children }) {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [scoreSubmitted, setScoreSubmitted] = useState(false);//use it
    const [highScores, setHighScores] = useState([]);
    const [playerScore, setPlayerScore] = useState(null);

    function handleGameStart() {
        setGameStarted(true);
    }

    function handleGameOver(score) {
        setGameOver(true);
        setPlayerScore(score);
    }

    function handleScoreSubmit() {
        setScoreSubmitted(true);
        handleGameStart();

        alert('Score submitted!')
    }

    function handleHighScoresUpdate(highScores) {
        setHighScores(highScores);
        alert('High scores updated!' + highScores)
    }

    return (
        <div>
            {!gameStarted && (//show header if game is not started
                <div className="container my-5">
                    <button className="btn btn-primary" onClick={handleGameStart}>
                        New Game
                    </button>
                </div>
            )}
            {gameStarted && !gameOver && !scoreSubmitted && (//show game if game is started
                <div>
                    {children}
                </div>
            )}
        </div>//show high scores if score is submitted
    );
}

export default BullsAndCows;


/*
import React, { useState, useEffect } from 'react';
import BullsAndCows from './BullsAndCows';
import Header from './Header';
import RandomNumber from './RandomNumber';
import GuessForm from './GuessForm';
import GuessHistory from './GuessHistory';
import ScoreForm from './ScoreForm';
import HighScores from './HighScores';
import NewGame from './NewGame';


function Game() {
    const [secretNumber, setSecretNumber] = useState(null);
    const [guesses, setGuesses] = useState([]);
    const [showScoreForm, setShowScoreForm] = useState(false);
    const [highScores, setHighScores] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [scoreSubmitted, setScoreSubmitted] = useState(false); // add new state variable

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
        }
    }, [gameStarted]);

    const handleStartGame = () => {
        setGameStarted(true);
    };

    const handleGuess = (guess) => {
        let bulls = 0;
        let cows = 0;
        for (let i = 0; i < guess.length; i++) {
            if (guess[i] === secretNumber[i]) {
                bulls++;
            } else {
                cows++;
            }
        }

        let newGuesses = [...guesses, { guess, bulls, cows }];
        setGuesses(newGuesses);
    };

    const calculateScore = () => {
        const maxScore = 1000;
        const constantFactor = 10;

        let score = (maxScore - guesses.length) * constantFactor;
        score = Math.max(score, 0);

        return score;
    };

    const handleScoreSubmit = (name) => {
        fetch('/api/highscores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, score: calculateScore(guesses) })
        })
            .then(() => {
                fetchHighScores();
                setScoreSubmitted(true); // set scoreSubmitted to true after the score has been submitted
            })
            .catch(err => console.error(err));
    };

    const toggleScoreForm = () => {
        setShowScoreForm(!showScoreForm);
    };

    const fetchHighScores = () => {
        fetch('/api/highscores')
            .then(res => res.json())
            .then(data => setHighScores(data))
            .catch(err => console.error(err));

    };

    return (
        <div>
            <Header />
            {gameStarted ? (
                <>
                    <RandomNumber number={secretNumber} />
                    <GuessForm onGuess={handleGuess} />
                    <GuessHistory history={guesses} />
                    {scoreSubmitted ? (
                        <NewGame onClick={handleStartGame} text="Start new game" />
                    ) : (
                        <div>
                            <button
                                className="btn btn-primary mb-4"
                                onClick={toggleScoreForm}
                                disabled={guesses.filter((guess) => guess.bulls >= 4).length < 1}
                            >
                                {guesses.filter((guess) => guess.bulls >= 4).length < 1
                                    ? 'Enter at least 4 bulls to save score'
                                    : 'Save score'}
                            </button>
                            {showScoreForm && <ScoreForm onSubmit={handleScoreSubmit} onCancel={toggleScoreForm} />}
                            <NewGame onClick={handleStartGame} text="Start new game" />
                        </div>
                    )}


                    <HighScores scores={highScores} onRefresh={fetchHighScores} />
                </>
            ) : (
                <button className="btn btn-primary mb-4" onClick={handleStartGame}>Start game</button>
            )}
        </div>
    );
}

export default Game;

 */
