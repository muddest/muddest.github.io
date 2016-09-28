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
            this.setState({ hidden: !this.state.hidden });
        }
    }

    toggleMapBox(e) {
        let clicked = e.target.getAttribute('data-name');
        if ('closebox' === clicked || 'openbox' === clicked) {
            this.setState({ showMap: !this.state.showMap});
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

        let obstacles = (this.props.obstacles === '' || this.props.obstacles === null) ? 'Unknown' : this.props.obstacles;
        return (
            <div 
                key={this.props.id}
                onMouseEnter={() => this.props.sethoverid(this.props.id)}
                onMouseLeave={() => this.props.sethoverid('')}
                className="event">

                <h2>{this.props.title}</h2>

                    <span className={'daysleft '+daysColor}><div>{this.props.daysleft} days left</div></span>
                    <span className="date"><Fonty text={this.props.date} icon="fa-calendar" /></span>
                    <span className="country"><Fonty text={this.props.country} icon="fa-globe" /></span>

                <div className="eventstats">
                    <span><Fonty text={this.props.length} icon="fa-map-marker" /></span>
                    <span><Fonty text={obstacles+" obstacles"} icon="fa-fire" /></span>
                    <span><Fonty text="Challenge 4.5" icon="fa-heartbeat" /></span>
                    <span><a href={this.props.site} target="_blank">{this.props.title}</a></span>
                </div>

                <span className="readmore" data-name="openbox" onClick={this.toggleInfoBox}>Watch trailer...</span>
                {readMore}
            </div>
        )
    }
}

export default Event;