import React from 'react';
import EventBox from './assets/event/eventbox.jsx';
import EventMap from './assets/event/eventmap.jsx';


class EventContainer extends React.Component {
    render () {
        return (
            <div>
                <EventBox data={this.props.data} />
            </div>
        )
    }
}

export default EventContainer;