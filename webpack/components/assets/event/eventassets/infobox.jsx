import React from 'react';
import Remarkable from 'remarkable';
import Fonty from '../../fonty.jsx';


class InfoBox extends React.Component {
    constructor(props) {
      super(props);
    
      this.state = {};
      this.rawMarkup = this.rawMarkup.bind(this);
    }

    rawMarkup() {
        var md = new Remarkable();
        var rawMarkup = md.render(this.props.info.toString());
        return { __html: rawMarkup };
    }

    render() {
        var obstacles = (this.props.obstacles === '' || this.props.obstacles === null) ? '' : <Fonty text={this.props.obstacles+" obstacles"} icon="fa-heartbeat" />;
        return (
            <div className="box">
                <div className="box_background" data-name="closebox" onClick={this.props.closebox}>
                    <div className="eventinfo">
                        <div className="boxheader">
                            <div className="daysleftheader">
                                <span className="daysleftbox">{this.props.daysleft}</span>
                            </div>
                            <div className="closebtn">
                                <span className="pointer" data-name="closebox" onClick={this.props.closebox}>Close</span>
                            </div>
                        </div>
                        <article>
                            <h3>{this.props.title}</h3>
                            <div className="details">
                                <span className="date"><Fonty text={this.props.date} icon="fa-calendar" /></span>
                                <span className="eventlength"><Fonty text={this.props.length} icon="fa-map-marker" /></span>
                                <span className="obstacles">{obstacles}</span>
                                <span>{this.props.price+" "+this.props.currency}</span>
                            </div>

                            <address>
                                <span className="homepage address"><a href={this.props.homepage} target="_blank">Official homepage</a></span>
                                <span className="address">{this.props.address}</span>
                                <span className="address">{this.props.city}</span>
                                <span className="address">{this.props.country}</span>
                            </address>
                            <span className="infotextaboutevent" dangerouslySetInnerHTML={this.rawMarkup()} />
                        </article>
                        <div className="video-container">
                            <iframe src={this.props.youtube} frameBorder="0" allowFullScreen></iframe>
                        </div>
                    </div>
                </div>
            </div>
        )
    }    
    

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.title !== nextProps.title
            || this.props.youtube !== nextProps.youtube
            || this.props.info !== nextProps.info) {
            return true;
        } else {
            return false;
        }
    }
}


export default InfoBox;