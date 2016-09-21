import React, { Component } from 'react';
import {render} from 'react-dom';
import EventBox from './components/eventbox.jsx';

class App extends Component {
    render() {
        return (
            <EventBox eventurl="/data/events.json" />
        )
    }
}

render(<App />, document.getElementById('app'));