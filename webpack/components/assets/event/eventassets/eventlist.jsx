import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Event from './event.jsx';


class EventList extends React.Component {

    render() {
        var curDate = '';
        var eventnodes = this.props.data.map((event) => {
            let classname = (this.props.hooveredpinid === event.id) ? 'highlight' : '';

            return (
                <Event
                    hooveredpinid={this.props.hooveredpinid}
                    classname={classname}
                    sethoverid={this.props.sethoverid}
                    key={event.id}
                    title={event.Title}
                    info={event.content} 
                    id={event.id}
                    date={event.Date}
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
                    {eventnodes}
                </div>
        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.sethoverid !== nextProps.sethoverid
            || this.props.data !== nextProps.data
            || this.props.hooveredpinid !== nextProps.hooveredpinid) {
            return true;
        } else {
            return false;
        }
    }
}



export default EventList;