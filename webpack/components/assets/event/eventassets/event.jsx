import React from 'react';
import Fonty from '../../fonty.jsx';
import MapBox from './mapbox.jsx';
import InfoBox from './infobox.jsx';

class Event extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hidden: true,
            daysleft: '',
            daysColor: 'regular',
        };

      this.toggleInfoBox = this.toggleInfoBox.bind(this);
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

    toggleInfoBox(e) {
        let clicked = e.target.getAttribute('data-name');
        if ('closebox' === clicked || 'openbox' === clicked) {
            this.state.hidden ?  window.history.pushState("", "", this.props.slug) : window.history.pushState("", "", '/');
            this.setState({ hidden: !this.state.hidden });
        }
    }

    render() {
        let readMore = '';
        if (!this.state.hidden) {
            readMore = (
                <InfoBox
                    title={this.props.title}
                    youtube={this.props.youtube}
                    closebox={this.toggleInfoBox} />
            )
        }

        let obstacles = (this.props.obstacles === '' || this.props.obstacles === null) ? '...' : this.props.obstacles;
        let classname = (this.props.hooveredpinid === this.props.id) ? 'event highlight' : 'event';

        return (
            <div 
                id={this.props.id}
                key={this.props.id}
                onMouseEnter={() => this.props.sethoverid(this.props.id)}
                onMouseLeave={() => this.props.sethoverid('')}
                className={classname}>

                <h2>{this.props.title}</h2>
                    <span className={'daysleft '+this.state.daysColor}><div>{this.state.daysleft}</div></span>
                    <span className="date"><Fonty text={this.props.date} icon="fa-calendar" /></span>
                    <span className="country"><Fonty text={this.props.country} icon="fa-globe" /></span>

                <div className="eventstats">
                    <span><Fonty text={obstacles+" obstacles"} icon="fa-heartbeat" /></span>
                    <span><Fonty text={this.props.length} icon="fa-map-marker" /></span>
                    <span className="readmore" data-name="openbox" onClick={this.toggleInfoBox}>Watch trailer...</span>
                </div>
                <span><a href={this.props.site} target="_blank">Homepage</a></span>
                {readMore}
            </div>
        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        if ((nextProps.hooveredpinid === this.props.id && this.props.hooveredpinid !== this.props.id)
            || (this.props.hooveredpinid === this.props.id && nextProps.hooveredpinid !== this.props.id)) {
            return true;
        } else {
            return false;
        }
    }
}

export default Event;