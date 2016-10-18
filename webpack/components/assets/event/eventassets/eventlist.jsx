import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Event from './event.jsx';


class EventList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentDidMount() {
        var _that = this;
        this.refs.eventlist.addEventListener('mouseenter', function() {
            $('body').addClass('hideoverflow');
        });
        this.refs.eventlist.addEventListener('mouseleave', function() {
            if (!_that.props.showinginfobox) {
                $('body').removeClass('hideoverflow');
            }
        });
    }

    render() {
        var curDate = '';
        var eventYear = '';
        var eventMonth = '';
        var monthInInt = '';

        var eventnodes = this.props.data.map((event) => {
            let classname = (this.props.hooveredpinid === event.id) ? 'highlight' : '';
            let curYear = new Date(event.Date);
            let addHead = '';
            let monthString = '';

            

            if (eventYear !== curYear.getFullYear()) {
                addHead = <h4 className="year">{curYear.getFullYear()}</h4>
                eventYear = curYear.getFullYear();
            }
            if (monthInInt !== curYear.getMonth()) {
                switch (curYear.getMonth()) {
                    case 0:
                        monthString = 'January';
                        break;
                    case 1:
                        monthString = 'February';
                        break;
                    case 2:
                        monthString = 'March';
                        break;
                    case 3:
                        monthString = 'April';
                        break;
                    case 4:
                        monthString = 'May';
                        break;
                    case 5:
                        monthString = 'June';
                        break;
                    case 6:
                        monthString = 'July';
                        break;
                    case 7:
                        monthString = 'August';
                        break;
                    case 8:
                        monthString = 'September';
                        break;
                    case 9:
                        monthString = 'October';
                        break;
                    case 10:
                        monthString = 'November';
                        break;
                    case 11:
                        monthString = 'December';
                        break;
                }
                monthString = <h5>{monthString}</h5>
                monthInInt = curYear.getMonth();
            }
            return (
                <div>
                {addHead}
                {monthString}
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
                    slug={event.slug}
                    outputdate={event.outPutDate}
                    toggleinfobox={this.props.toggleinfobox} />
                    </div>
            

            );
        });

        return (
                <div id="eventlist" key="eventkey" ref="eventlist">
                    {eventnodes}
                </div>
        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.sethoverid !== nextProps.sethoverid
            || this.props.data !== nextProps.data
            || this.props.hooveredpinid !== nextProps.hooveredpinid
            || this.props.clickedpin !== nextProps.clickedpin
            || this.state.showinginfobox !== nextState.showinginfobox) {
            return true;
        } else {
            return false;
        }
    }
}



export default EventList;