import React from 'react';
import Remarkable from 'remarkable';
import Fonty from '../../fonty.jsx';


class InfoBox extends React.Component {
    constructor(props) {
      super(props);
    
      this.state = {
        daysleft: null,
      };

      this.rawMarkup = this.rawMarkup.bind(this);
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

    componentDidMount() {
        FB.XFBML.parse(document);
    }

    componentDidUpdate(prevProps, prevState) {
        FB.XFBML.parse(document);
    }

    rawMarkup() {
        var content = '<p>'+this.props.info.toString()+'</p>';
        var text = $(content).text();
        var md = new Remarkable();
        var rawMarkup = md.render(text);
        return { __html: rawMarkup };
    }

    getYoutubeId(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return 'error';
        }
    }

    
    render() {
        var obstacles = (this.props.obstacles === '' || this.props.obstacles === null) ? '' : <Fonty text={this.props.obstacles+" obstacles"} icon="fa-heartbeat" />;
        var youTubeId = (this.props.youtube) ? this.getYoutubeId(this.props.youtube) : 'VO5I03AcrBU';
        return (
            <div className="box">
                <div className="box_background" data-name="closebox" onClick={this.props.closebox}>
                    <div className="eventinfo">
                        <div className="boxheader">
                            <div className="daysleftheader">
                                <span className="daysleftbox">{this.state.daysleft}</span>
                            </div>
                            <div className="closebtn">
                                <span className="pointer" data-name="closebox" onClick={this.props.closebox}>Close</span>
                            </div>
                        </div>
                        <article>
                            <h3>{this.props.title}</h3>
                            <div className="details">
                                <span className="date"><Fonty text={this.props.outputdate} icon="fa-calendar" /></span>
                                <span className="eventlength"><Fonty text={this.props.length} icon="fa-map-marker" /></span>
                                <span className="obstacles">{obstacles}</span>
                            </div>

                            <address>
                                <span className="homepage address"><a href={this.props.homepage} target="_blank">Official homepage</a></span>
                                <span className="address">{this.props.address}</span>
                                <span className="address">{this.props.city}</span>
                                <span className="address">{this.props.country}</span>
                                <div className="fb-like" data-href="http://www.muddest.com" data-layout="button" data-action="like" data-size="small" data-show-faces="false" data-share="true"></div>
                            </address>
                            <span className="infotextaboutevent" dangerouslySetInnerHTML={this.rawMarkup()} />
                        </article>
                        <div className="video-container">
                            <iframe src={"https://www.youtube.com/embed/"+youTubeId} frameBorder="0" allowFullScreen></iframe>
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