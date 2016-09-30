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


    getMonthFromDate(date) {
        let d = new Date(date);
        let m = d.getMonth();

        switch(m) {
            case 1:
                return 'january';
            case 2:
                return 'february';
            case 3:
                return 'mars';
            case 4:
                return 'april';
            case 5:
                return 'may';
            case 6:
                return 'june';
            case 7:
                return 'july';
            case 8:
                return 'august';
            case 9:
                return 'september';
            case 10:
                return 'october';
            case 11:
                return 'november';
            case 12:
                return 'december';
        }
    }




    render() {
        var curDate = '';
        var eventnodes = this.props.data.map((event) => {
            let days = this._getDifferenceInDays(event.Date);
            let newDate = this.getMonthFromDate(event.Date);
            let classname = (this.props.hooveredpinid === event.id) ? 'highlight' : '';
            let header = '';

            
            if (newDate !== curDate) {
                header += <h2>+newDate+</h2>;
                curDate = newDate;
            }

            return (
                
                <Event
                    classname={classname}
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