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

    return (
        <>
        {hasScore  ? (
            <div className="message-container success">
                <h2>Congratulations {name}!</h2>
                {hasName ? (
                <p>Your score of <span className="fw-bold">{score}</span> made it to the top 5!</p> ) :
                (<p>Your score of <span className="fw-bold">{score}</span> made it to the top 5! but there more then 5 players with that score</p>)}
            </div>
        ) : (
            <div className="message-container error">
                <h2>Game Over!</h2>
                <p>Sorry {name}, your score of {score} did not make it to the top 5. Better luck next time!</p>
            </div>
        )}
            <div className="message-container alert alert-info">
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
        </>
    );
}

export default HighScores;


