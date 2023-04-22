import React from 'react';

/**
 * This component is used to display a button to start a new game
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function NewGame(props) {
    return (
        <button className="btn btn-primary mb-4" onClick={props.onClick}>
            {props.text}
        </button>
    );
}

export default NewGame;
