import React from 'react';

/**
 * This component is used to display a random number to guess
 * @param number
 * @returns {JSX.Element}
 * @constructor
 */
const RandomNumber = ({ number }) => {
    return (
        <div className="text-center my-4">
            <h2>Guess the number:</h2>
            <p className="display-4">{number}</p>
        </div>
    );
}

export default RandomNumber;
