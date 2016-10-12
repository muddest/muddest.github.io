import React from 'react';
import Fonty from '../../fonty.jsx';
import MapBox from './mapbox.jsx';
import InfoBox from './infobox.jsx';

class Event extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            daysleft: '',
            daysColor: 'regular',
        };

      this.getDifferenceInDays = this.getDifferenceInDays.bind(this);
    }

    componentWillMount() {
        let daysLeft = this.getDifferenceInDays(this.props.date);

        if (daysLeft <= 20) {
            this.setState({ daysColor: 'red' });
        } else if (daysLeft > 20 && daysLeft <= 60) {
            this.setState({ daysColor: 'yellow' });
        }

        let daysleft = '';
        let days = daysLeft.toString();

        switch (days) {
            case '0':
                daysleft = 'Today';
                break;
            case '-0':
                daysleft = 'Today';
                break;
            case '-1':
                daysleft = 'Yesterday';
                break;
            case '1':
                daysleft = 'Tomorrow';
                break;
            default:
                daysleft = days+' days left';
                break;
        }

        this.setState({ daysleft: daysleft });
    }

    componentDidMount() {
        $(document).keyup(function(e) {
            if (e.keyCode == 27) { // escape key maps to keycode `27`
                // <DO YOUR WORK HERE>
            }
        });
    }

    getDifferenceInDays(date) {
        var oneDay = 24*60*60*1000;
        var eventDate = new Date(date);
        
        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1; //months from 1-12
        month = month.toString();
        let day = dateObj.getUTCDate().toString();
        let year = dateObj.getUTCFullYear().toString();
        let nowString = year+'-'+month+'-'+day; 
        let now = new Date(nowString);

        var diffDays = Math.round(Math.abs((eventDate.getTime() - now.getTime())/(oneDay)));
        
        if (eventDate > now) {
            return diffDays;
        } else {
            return '-'+diffDays;
        }
    }

    render() {
        let classname = (this.props.hooveredpinid === this.props.id) ? 'event highlight' : 'event';

        return (
            <div 
                id={this.props.id}
                key={this.props.id}
                onMouseEnter={() => this.props.sethoverid(this.props.id)}
                onMouseLeave={() => this.props.sethoverid('')}
                className={classname}
                onClick={() => this.props.toggleinfobox(this.props.id)}>

                <h2>{this.props.title}</h2>
                <span className={'daysleft '+this.state.daysColor}><div>{this.state.daysleft}</div></span>
                <span className="date"><Fonty text={this.props.date} icon="fa-calendar" /></span>
                <span className="country"><Fonty text={this.props.country} icon="fa-globe" /></span>
                <span className="length"><Fonty text={this.props.length} icon="fa-map-marker" /></span>

                <span className="socialmedia">
                    <Fonty text="Like" icon="fa-facebook-official" />
                    <Fonty text="Tweet" icon="fa-twitter" />
                </span>
            </div>
        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ((nextProps.hooveredpinid === this.props.id && this.props.hooveredpinid !== this.props.id)
            || (this.props.hooveredpinid === this.props.id && nextProps.hooveredpinid !== this.props.id)
            || this.state.hidden !== nextState.hidden) {
            return true;
        } else {
            return false;
        }
    }
}

export default Event;