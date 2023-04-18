import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import React, {StrictMode} from 'react';
import Game from './components/Game';

class App extends React.Component {
    render() {
        return (
            <StrictMode>
                <div className="container">
                    <Game />
                </div>
            </StrictMode>
        );
    }
}

export default App;