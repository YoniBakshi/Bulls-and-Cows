import React, { useState } from 'react';
import Header from './Header';
import ScoreForm from './ScoreForm';
import HighScores from './HighScores';


function BullsAndCows({ children }) {
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [scoreSubmitted, setScoreSubmitted] = useState(false);
    const [highScores, setHighScores] = useState([]);
    const [playerScore, setPlayerScore] = useState(null);

    function handleGameStart() {
        console.log('Game started!');
        setGameStarted(true);
        console.log(gameStarted);

    }

    function handleGameOver(score) {
        setGameOver(true);
        setPlayerScore(score);
    }

    function handleScoreSubmit() {
        setScoreSubmitted(true);
    }

    function handleHighScoresUpdate(highScores) {
        setHighScores(highScores);
    }

    return (
        <div>

            {!gameStarted && !gameOver && !scoreSubmitted && (
                <div className="container my-5">
                    <button className="btn btn-primary" onClick={handleGameStart}>
                        New Game
                    </button>
                </div>
            )}
            {gameStarted && !gameOver && !scoreSubmitted && (
                <div>
                    {children}
                </div>
            )}
            {gameStarted && gameOver && !scoreSubmitted && (
                <ScoreForm
                    score={playerScore}
                    onScoreSubmit={handleScoreSubmit}
                    onHighScoresUpdate={handleHighScoresUpdate}
                />
            )}
            {scoreSubmitted && <HighScores highScores={highScores} />}
        </div>
    );
}

export default BullsAndCows;
