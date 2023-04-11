import React, { useState, useEffect } from 'react';
import BullsAndCows from './BullsAndCows';
import Header from './Header';
import RandomNumber from './RandomNumber';
import GuessForm from './GuessForm';
import GuessHistory from './GuessHistory';
import ScoreForm from './ScoreForm';
import HighScores from './HighScores';

function Game() {
    const [secretNumber, setSecretNumber] = useState(null);
    const [guesses, setGuesses] = useState([]);
    const [showScoreForm, setShowScoreForm] = useState(false);
    const [highScores, setHighScores] = useState([]);
    const [gameStarted, setGameStarted] = useState(false); // add new state variable

    useEffect(() => {
        if (gameStarted) { // only generate secret number when the game has started
            // generate a random 4-digit number as the secret number
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
        console.log('guess', guess);
        // check how many bulls and cows the guess has
        for (let i = 0; i < guess.length; i++) {
            console.log('guess[i]', guess[i] + ' secretNumber[i]', secretNumber[i]);
            if (guess[i] === secretNumber[i]) {
                bulls++;
            } else {
                cows++;
                console.log('cows', cows);
            }
        }
        console.log(`Bulls: ${bulls}, Cows: ${cows}`);
        // add the guess to the list of guesses
        let newGuesses = [...guesses, { guess, bulls, cows }];
        setGuesses(newGuesses);
    };
    const calculateScore = () => {
        const maxScore = 1000;
        const constantFactor = 10;

        let score = (maxScore - guesses.length) * constantFactor;
        score = Math.max(score, 0); // Ensure that the score is non-negative

        return score;
    }



    const handleScoreSubmit = (name) => {
        // save the score to the server and fetch the updated high scores
        fetch('/api/highscores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, score: calculateScore(guesses) })
        })
            .then(() => fetchHighScores())
            .catch(err => console.error(err));
    };

    const toggleScoreForm = () => {
        setShowScoreForm(!showScoreForm);
    };

    const fetchHighScores = () => {
        // fetch the top 5 high scores from the server
        fetch('/api/highscores')
            .then(res => res.json())
            .then(data => setHighScores(data))
            .catch(err => console.error(err));
    };

return (
    <div>
        <Header />
        {gameStarted ? ( // only show game elements when the game has started
            <>
                <BullsAndCows>
                    <RandomNumber number={secretNumber} />
                    <GuessForm onGuess={handleGuess} />
                    <GuessHistory history={guesses} />
                </BullsAndCows>
                {showScoreForm ?
                    <ScoreForm onSubmit={handleScoreSubmit} onCancel={toggleScoreForm} /> :
                    <button
                        className="btn btn-primary mb-4"
                        onClick={toggleScoreForm}
                        disabled={guesses.filter(guess => guess.bulls >= 4).length < 1}
                    >
                        {guesses.filter(guess => guess.bulls >= 4).length < 1 ? 'Enter at least 4 bulls to save score' : 'Save score'}
                    </button>
                }
                <HighScores scores={highScores} onRefresh={fetchHighScores} />
            </>
        ) : (
            <button className="btn btn-primary mb-4" onClick={handleStartGame}>Start game</button>
        )}
    </div>
);
}
export default Game;
