function GuessHistory({ guessHistory }) {
    return (
        <table className="table">
            <thead>
            <tr>
                <th>No.</th>
                <th>Guess</th>
                <th>Bulls</th>
                <th>Cows</th>
            </tr>
            </thead>
            <tbody>
            {guessHistory?.map((guess, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{guess.guess}</td>
                    <td>{guess.bulls}</td>
                    <td>{guess.cows}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default GuessHistory;




/*
import React from 'react';

const GuessHistory = (props) => {
    return (
        <div className="my-4">
            <h2>Guess history:</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Guess</th>
                    <th>Bulls</th>
                    <th>Cows</th>
                </tr>
                </thead>
                <tbody>
                {props.history.map((guess, index) => (
                    <tr key={index}>
                        <td>{guess.guess}</td>
                        <td>{guess.bulls}</td>
                        <td>{guess.cows}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default GuessHistory;
*/
