import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Event from './event.jsx';


class EventList extends React.Component {
    _getDifferenceInDays(date) {
        var oneDay = 24*60*60*1000;
        var eventDate = new Date(date);
        var now = new Date();

        var diffDays = Math.round(Math.abs((eventDate.getTime() - now.getTime())/(oneDay)));
        
        if (eventDate >= now) {
            return diffDays;
        } else {
            return '-'+diffDays;
        }
    }

    componentWillReceiveProps(nextProps) {
        let curHooveredPinId = this.props.hooveredpinid;
        let newHooveredPinId = nextProps.hooveredpinid;
        if (curHooveredPinId !== '') {

        }
        var topPos = document.getElementById(8).offsetTop;
        console.log(topPos);
        document.getElementById('eventlist').scrollTop = topPos-10;
        console.log(document.getElementById(8));
    }



    render() {
        var eventnodes = this.props.data.map((event) => {
            let days = this._getDifferenceInDays(event.Date);
            return (
                <Event
                    hooveredpinid={this.props.hooveredpinid}
                    sethoverid={this.props.sethoverid}
                    key={event.id}
                    title={event.Title}
                    info={event.content} 
                    id={event.id}
                    date={event.Date}
                    daysleft={days}
                    country={event.Country}
                    city={event.City}
                    address={event.Address}
                    site={event.Site}
                    obstacles={event.Obstacles}
                    youtube={event.Youtube}
                    length={event.Length}
                    price={event.Price}
                    currency={event.Currency}
                    slug={event.slug} />
            );
        });

        return (
                <div id="eventlist" key="eventkey">
                    <ReactCSSTransitionGroup 
                        transitionName="eventtransition" 
                        transitionEnterTimeout={500} 
                        transitionLeaveTimeout={300}>
                        {eventnodes}
                    </ReactCSSTransitionGroup>
                </div>
        )
    }
}



export default EventList;