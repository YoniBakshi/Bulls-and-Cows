import React, { useEffect, useState } from 'react';

function HighScores() {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        fetch('/api/highscores')
            .then((response) => response.json())
            .then((data) => {
                setScores(data);
            })
            .catch((error) => console.error(error));
    }, []);

    // Sort the scores in descending order based on the score property and get the top 4
    const topScores = scores.sort((a, b) => b.score - a.score).slice(0, 4);

    return (
        <div className="my-4">
            <h2>High scores:</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Score</th>
                </tr>
                </thead>
                <tbody>
                {topScores.map((score, index) => (
                    <tr key={index}>
                        <td>{score.name}</td>
                        <td>{score.score}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default HighScores;
