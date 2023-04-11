import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import React from 'react';
import Game from './components/Game';

class App extends React.Component {
    render() {
        return (
            <div className="container">
                <Game />
            </div>
        );
    }
}

export default App;