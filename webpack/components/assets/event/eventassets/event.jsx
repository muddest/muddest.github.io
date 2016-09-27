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
                    info={this.props.info}
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
            <div key={this.props.id} className="event">
                <div className="eventhead">
                    <h2>{this.props.title}</h2>
                    
                    <div className="daysleftcontainer">
                        <span className={'daysleft '+daysColor}>{this.props.daysleft} days left</span>
                    </div>

                    <span className="date"><Fonty text={this.props.date} icon="fa-calendar" /></span>

                    <div className="countrycontainer">
                        <span><Fonty text={this.props.country} icon="fa-globe" /></span>
                    </div>
                </div>

                <div className="eventstats">
                    <span><Fonty text={this.props.length+" km"} icon="fa-map-marker" /></span>
                    <span><Fonty text={this.props.obstacles+" obstacles"} icon="fa-fire" /></span>
                    <span><Fonty text="Challenge 4.5" icon="fa-heartbeat" /></span>
                    <span><a href={this.props.site} target="_blank">{this.props.title}</a></span>
                </div>

                <div className="eventfooter">
                    <span className="eventmap">
                        <span data-name="openbox" onClick={this.toggleMapBox}>View map</span>
                    </span>
                    <span className="eventreadmore">
                        <span data-name="openbox" onClick={this.toggleInfoBox}>Read more...</span>
                    </span>
                </div>
                {map}
                {readMore}
            </div>
        )
    }
}

export default Event;