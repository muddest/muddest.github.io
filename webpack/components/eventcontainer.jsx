import React from 'react';
import EventBox from './assets/event/eventbox.jsx';
import EventMap from './assets/event/eventmap.jsx';


class EventContainer extends React.Component {
    sortByDate (a, b) {
        return new Date(a.Date).getTime() - new Date(b.Date).getTime();
    }
    
    render () {
        var data = this.props.data;
        data.sort(this.sortByDate);

        // Set ID for every event
        for (var i=0; i < data.length; i++) {
            data[i].id = i;
        }

        return (
            <div>
                <EventBox data={data} />
            </div>
        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.data !== nextProps.data) {
            return true;
        } else {
            return false;
        }
    }
}

export default EventContainer;