import React, { Component } from 'react';
import {render} from 'react-dom';
import EventBox from './components/eventbox.jsx';

{% include base.html %}

class App extends Component {
    render() {
        return (
            <EventBox eventurl="{{base}}/data/events.json" />
        )
    }
}

render(<App />, document.getElementById('app'));