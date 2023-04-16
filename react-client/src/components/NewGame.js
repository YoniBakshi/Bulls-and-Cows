import React from 'react';

function NewGame(props) {
    return (
        <button className="btn btn-primary mb-4" onClick={props.onClick}>
            {props.text}
        </button>
    );
}

export default NewGame;
