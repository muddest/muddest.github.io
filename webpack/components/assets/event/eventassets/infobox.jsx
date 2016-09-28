import React from 'react';
import Remarkable from 'remarkable';


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
        return (
            <div className="box">
                <div className="box_background" data-name="closebox" onClick={this.props.closebox}>
                    <div className="eventinfo">
                        <span className="close pointer" data-name="closebox" onClick={this.props.closebox}>Close</span>
                        <h3>{this.props.title}</h3>
                        <div className="video-container">
                            <iframe width="560" height="315" src={this.props.youtube} frameBorder="0" allowFullScreen></iframe>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default InfoBox;