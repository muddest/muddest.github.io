import React from 'react';
import Fonty from '../../fonty.jsx';
import MapBox from './mapbox.jsx';
import InfoBox from './infobox.jsx';

class Event extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hidden: true,
            showMap: false,
        };

      this.toggleInfoBox = this.toggleInfoBox.bind(this);
      this.toggleMapBox = this.toggleMapBox.bind(this);
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

        let map = '';
        if (this.state.showMap) {
            map = (
                <MapBox
                    title={this.props.title}
                    closebox={this.toggleMapBox}
                    content={<iframe width={560} height={315} frameBorder={0} src={"https://www.google.com/maps/embed/v1/search?q=Stockholm stadion,"+this.props.city+"&key=AIzaSyDCO6ot8LXweTO6G_LLOlvWyv8kwF-_Jd8"} allowFullScreen></iframe>}/>
            )
        }
        let daysColor = 'regular';
        if (this.props.daysleft <= 20) {
            daysColor = 'red';
        } else if (this.props.daysleft > 20 && this.props.daysleft <= 60) {
            daysColor = 'yellow';
        }
        return (
            <div 
                key={this.props.id}
                onMouseEnter={() => this.props.sethoverid(this.props.id)}
                onMouseLeave={() => this.props.sethoverid('')}
                className="event">

                <h2>{this.props.title}</h2>

                    <span className={'daysleft '+daysColor}>{this.props.daysleft} days left</span>
                    <span className="date"><Fonty text={this.props.date} icon="fa-calendar" /></span>
                    <span className="country"><Fonty text={this.props.country} icon="fa-globe" /></span>

                <div className="eventstats">
                    <span><Fonty text={this.props.length+" km"} icon="fa-map-marker" /></span>
                    <span><Fonty text={this.props.obstacles+" obstacles"} icon="fa-fire" /></span>
                    <span><Fonty text="Challenge 4.5" icon="fa-heartbeat" /></span>
                    <span><a href={this.props.site} target="_blank">{this.props.title}</a></span>
                </div>

                <span class="readmore" data-name="openbox" onClick={this.toggleInfoBox}>Watch trailer...</span>
                {readMore}
            </div>
        )
    }
}

export default Event;