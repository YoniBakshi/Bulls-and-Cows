import React from 'react';

function HighScores({ name, score, highScores }) {
    if (!Array.isArray(highScores)) {
        return (
            <div className="message-container error">
                <h2>High Scores</h2>
                <p>Sorry, there was an error retrieving the high scores.</p>
            </div>
        );
    }

    const hasScore = highScores.some((item) => item.score === score);
    const hasName = highScores.some((item) => item.name === name);

    if (hasScore && hasName) {
        return (
            <div className="message-container success">
                <h2>Congratulations {name}!</h2>
                <p>Your score of {score} made it to the top 5!</p>
                <h3>Top 5 High Scores:</h3>
                <table className="score-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {highScores.map((score, index) => (
                        <tr key={index}>
                            <td>{score.name}</td>
                            <td>{score.score}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    } else {
        return (
            <div className="message-container error">
                <h2>Game Over!</h2>
                <p>Sorry {name}, your score of {score} did not make it to the top 5. Better luck next time!</p>
            </div>
        );
    }
}

export default HighScores;


