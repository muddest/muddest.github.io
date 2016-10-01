import React from 'react';
import Fonty from '../../fonty.jsx';
import MapBox from './mapbox.jsx';
import InfoBox from './infobox.jsx';

class Event extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hidden: true,
        };

      this.toggleInfoBox = this.toggleInfoBox.bind(this);
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

        let daysColor = 'regular';
        if (this.props.daysleft <= 20) {
            daysColor = 'red';
        } else if (this.props.daysleft > 20 && this.props.daysleft <= 60) {
            daysColor = 'yellow';
        }

        let obstacles = (this.props.obstacles === '' || this.props.obstacles === null) ? '...' : this.props.obstacles;

        let daysleft = '';
        switch (this.props.daysleft) {
            case 0:
                daysleft = 'Today';
                break;
            case -1:
                daysleft = 'Yesterday';
                break;
            case 1:
                daysleft = 'Tomorrow';
                break;
            default:
                daysleft = this.props.daysleft+' days left';
                break;
        }

        return (
            <div 
                id={this.props.id}
                key={this.props.id}
                onMouseEnter={() => this.props.sethoverid(this.props.id)}
                onMouseLeave={() => this.props.sethoverid('')}
                className={"event "+this.props.classname}>

                <h2>{this.props.title}</h2>

                    <span className={'daysleft '+daysColor}><div>{daysleft}</div></span>
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
}

export default Event;