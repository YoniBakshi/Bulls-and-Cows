import React from 'react';

/**
 *
 * @param {string} message
 * @param handleCloseException
 * @returns {JSX.Element}
 * @constructor
 * @description This component is used to display an exception message
 */
const ExceptionComponent = ({ message, handleCloseException }) => {
    return (
        <div className="popup">
            <div className="exception-message">
                <p>{message}</p>
            </div>
            <div className="exception-button">
                <button onClick={handleCloseException}>Close</button>
            </div>
        </div>
    );
};

export default ExceptionComponent;
