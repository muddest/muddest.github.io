import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import React from 'react';
import Remarkable from 'remarkable';
import Fonty from './assets/fonty.jsx';

class EventBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            searchWord: '',
            minLength: 0,
            maxLength: 30,
            country: [],
        };

        this.loadEvent = this.loadEvent.bind(this);
        this.changeSearchState = this.changeSearchState.bind(this);
    }

    changeSearchState(whichState, value) {
        switch (whichState) {
            case 'word':
                this.setState({ searchWord: value });
                break;
            case 'minlength':
                this.setState({ minLength: value });
                break;
            case 'country':
                this.setState({ country: value });
                break;
            case 'maxlength':
                this.setState({ maxLength: value });
                break;
        }
    }

    loadEvent() {
        $.ajax({
            url: this.props.eventurl,
            dataType: 'json',
            cache: false,
            success: (data) => {
                this.setState({ data: data });
            },
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }
        });
    }

    componentDidMount() {
        this.loadEvent();
    }

    render() {
        return (
            <div>
                <EventSearch changesearchstate={this.changeSearchState} />
                <EventList
                    data={this.state.data}
                    searchword={this.state.searchWord}
                    minlength={this.state.minLength}
                    maxlength={this.state.maxLength}
                    country={this.state.country} />
            </div>
        )
    }
}







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

    render() {
        var eventnodes = this.props.data.filter((event) => {
            if ( parseInt(event.length) < parseInt(this.props.minlength)) {
                return false;
            }

            if ( parseInt(event.length) > parseInt(this.props.maxlength)) {
                return false;
            }
            
            if (event.title.toLowerCase().indexOf(this.props.searchword) === -1 && 1 < this.props.searchword.length) {
                return false;
            }

            var countryCheck = (this.props.country.indexOf(event.country.toLowerCase()) > -1);
            if (false === countryCheck && 0 < this.props.country.length) {
                return false;
            }


            
            return true;
        }).map((event) => {
            let days = this._getDifferenceInDays(event.date);
            return (
                <Event
                    key={event.id}
                    title={event.title}
                    info={event.info} 
                    id={event.id}
                    date={event.date}
                    daysleft={days}
                    country={event.country}
                    city={event.city}
                    address={event.address}
                    site={event.site}
                    obstacles={event.obstacles}
                    youtube={event.youtube}
                    length={event.length}
                    price={event.price}
                    currency={event.currency} />
                    

            );
        });

        return (
            <div className="eventlist" key="eventkey">
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









class Event extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hidden: true,
            showMap: false,
        };

      // Bind "this" for functions within component
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
        return (
            <div key={this.props.id} className="col-md-3">
                <div className="eventcontainer">
                    <div className="eventhead">
                        <h2>{this.props.title}</h2>
                        <span className="date">{this.props.date}</span>
                        <span className="eventdetail daysleft">{this.props.daysleft} days left</span>
                    </div>

                    <div className="infocontainer">
                        <div className="infogrp">
                            <span>{this.props.length} km</span>
                            <span>{this.props.obstacles} obstacles</span>
                            <span>Challenge 4.5</span>
                        </div>

                        <address className="infogrp">
                            <span>{this.props.address}</span>
                            <span>{this.props.city}</span>
                            <span>{this.props.country}</span>
                        </address>
                    </div>

                    <div className="readmore">
                        <span className="maplink">
                            <span className="showmap pointer" data-name="openbox" onClick={this.toggleMapBox}>View map</span>
                        </span>
                        <span className="readmorelink">
                            <span className="pointer" data-name="openbox" onClick={this.toggleInfoBox}>Read more...</span>
                        </span>
                    </div>
                    {map}
                    {readMore}
                </div>
            </div>
        )
    }
}


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
                        <h3>{this.props.title}</h3>
                        <span dangerouslySetInnerHTML={this.rawMarkup()} />
                        <iframe width="560" height="315" src={this.props.youtube} frameBorder="0" allowFullScreen></iframe>
                        <span className="close pointer" data-name="closebox" onClick={this.props.closebox}>Close</span>
                    </div>
                </div>
            </div>
        )
    }
}


class MapBox extends React.Component {
    render () {
        return (
            <div className="box">
                <div className="box_background" data-name="closebox" onClick={this.props.closebox}>
                    <div className="eventinfo">
                        <h3>{this.props.title}</h3>
                        {this.props.content}
                        <span className="close pointer" data-name="closebox" onClick={this.props.closebox}>Close</span>
                    </div>
                </div>
            </div>
        )
    }
}







class EventSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchVal: '',
            minLengthVal: 0,
            maxLengthVal: 30,
            showfilters: false,
        };

        this.handleSearch = this.handleSearch.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.updateSearchVal = this.updateSearchVal.bind(this);
        this.updateCountryVal = this.updateCountryVal.bind(this);
        this.handleMinLengthchange = this.handleMinLengthchange.bind(this);
        this.handleMaxLengthchange = this.handleMaxLengthchange.bind(this);
    }

    handleSearch(which, value) {
        this.props.changesearchstate(which, value);
    }

    updateSearchVal(e) {
        this.handleSearch('word', e.target.value);
        this.setState({ searchVal: e.target.value });
    }

    handleMinLengthchange(e) {
        this.handleSearch('minlength', e.target.value);
        this.setState({ minLengthVal: e.target.value });
    }

    handleMaxLengthchange(e) {
        this.handleSearch('maxlength', e.target.value);
        this.setState({ maxLengthVal: e.target.value });
    }

    toggleFilter(e) {
        e.preventDefault();
        this.setState({showfilters: !this.state.showfilters});
    }

    updateCountryVal(e) {
        let options = e.target.options;
        let opt = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                opt.push(options[i].value.toLowerCase());
            }
        }

        this.handleSearch('country', opt);
    }


    render () {
        return (
            <form className="searchevents" autoComplete="off">
                <input
                    autoComplete="off"
                    type="search"
                    placeholder="Find events"
                    value={this.state.searchVal}
                    onChange={this.updateSearchVal}
                    onKeyUp={this.handleSearch} />
                

                <div id="filter" className="col-md-4 col-md-offset-3">
                    <span id="showfilters" onClick={this.toggleFilter}>{this.state.showfilters ? <Fonty class="filterbtn" textbefore="Stäng filter" icon="fa-chevron-up" /> : <Fonty class="filterbtn" textbefore="Visa filter" icon="fa-chevron-down" />}</span>
                    <span id="filters" className={this.state.showfilters ? '' : 'hidden'}>

                    <div className="filtergroup">
                        <span className="label before">Minimum length</span>
                        <input
                            id="minlength"
                            type="range"
                            min="0"
                            max="30"
                            step="1"
                            data-name="minlength"
                            value={this.state.minLengthVal}
                            onChange={this.handleMinLengthchange} />
                        <span className="label after">{this.state.minLengthVal} km</span>
                    </div>

                    <div className="filtergroup">
                        <span className="label before">Maximum length</span>
                        <input
                            id="maxlength"
                            type="range"
                            min="0"
                            max="30"
                            step="1"
                            data-name="maxlength"
                            value={this.state.maxLengthVal}
                            onChange={this.handleMaxLengthchange} />
                        <span className="label after">{this.state.maxLengthVal} km</span>
                    </div>

                    <div className="filtergroup">
                        <select multiple onChange={this.updateCountryVal}>
                            <option value="sweden">Sweden</option>
                            <option value="uk">United Kingdom</option>
                            <option value="spain">Spain</option>
                        </select>
                    </div>
                    </span>
                </div>
            </form>
        )
    }
}

export default EventBox;