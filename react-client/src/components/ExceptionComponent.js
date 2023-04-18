import React from 'react';

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
