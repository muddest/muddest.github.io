import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {render} from 'react-dom';
import EventContainer from './components/eventcontainer.jsx';


class App extends Component {
    render() {
        return (
            <EventContainer data={events} />
        )
    }
}

render(<App />, document.getElementById('app'));