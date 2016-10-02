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