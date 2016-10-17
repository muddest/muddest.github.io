import React from 'react';
import EventBox from './assets/event/eventbox.jsx';
import EventMap from './assets/event/eventmap.jsx';


class EventContainer extends React.Component {
    sortByDate (a, b) {
        return new Date(a.Date).getTime() - new Date(b.Date).getTime();
    }

    setCorrectDateFormat(date) {
        let today = new Date(date);
        let dd = today.getDate();
        let mm = today.getMonth()+1;
        let yyyy = today.getFullYear();

        let month = '';
        switch(mm) {
            case 1:
                month = 'jan';
                break;
            case 2:
                month = 'feb';
                break;
            case 3:
                month = 'mar';
                break;
            case 4:
                month = 'apr';
                break;
            case 5:
                month = 'may';
                break;
            case 6:
                month = 'jun';
                break;
            case 7:
                month = 'jul';
                break;
            case 8:
                month = 'aug';
                break;
            case 9:
                month = 'sep';
                break;
            case 10:
                month = 'oct';
                break;
            case 11:
                month = 'nov';
                break;
            case 12:
                month = 'dec';
                break;
        }

        return dd + ' ' + month + ' ' + yyyy;
    }
    
    render () {
        var data = this.props.data;
        data.sort(this.sortByDate);

        // Set ID for every event
        for (var i=0; i < data.length; i++) {
            data[i].id = i;
            data[i].outPutDate = this.setCorrectDateFormat(data[i].Date);
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