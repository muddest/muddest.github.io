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

    componentDidMount() {
        
    }

    render() {
        return (
            <div>
                <EventSearch changesearchstate={this.changeSearchState} />
                <EventList
                    data={this.props.data}
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

    sortByDate (a, b) {
        console.log('Should sort');
        return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
    }

    render() {
        var data = this.props.data;
        data.sort(this.sortByDate);
        var eventnodes = data.filter((event) => {
            if ( parseInt(event.Length) < parseInt(this.props.minlength)) {
                return false;
            }

            if ( parseInt(event.Length) > parseInt(this.props.maxlength)) {
                return false;
            }
            
            if (event.Title.toLowerCase().indexOf(this.props.searchword) === -1 && 1 < this.props.searchword.length) {
                return false;
            }

            var countryCheck = (this.props.country.indexOf(event.Country.toLowerCase()) > -1);
            if (false === countryCheck && 0 < this.props.country.length) {
                return false;
            }


            
            return true;
        }).map((event) => {
            let days = this._getDifferenceInDays(event.Date);
            return (
                <Event
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
                    currency={event.Currency} />
                    

            );
        });

        return (
                <div key="eventkey" id="eventlist" className="row show-grid">
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
        let daysColor = 'green';
        if (this.props.daysleft < 10) {
            daysColor = 'red';
        } else if (this.props.daysleft > 10 && this.props.daysleft < 30) {
            daysColor = 'orange';
        }
        return (
            <div key={this.props.id} className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-centered">
                <div className="eventcontainer">
                    <div className="eventhead col-md-12">
                        <div className="row">
                            <h2 className="col-xs-8">{this.props.title}</h2>
                            <div className="col-xs-4 text-right">
                                <span className={'daysleft '+daysColor}>{this.props.daysleft} days left</span>
                            </div>
                            
                        </div>
                        <span>{this.props.date}</span>
                    </div>

                    <div className="col-md-12">
                        <div className="col-md-6">
                            <span>{this.props.length} km</span>
                            <span>{this.props.obstacles} obstacles</span>
                            <span>Challenge 4.5</span>
                        </div>

                        <address className="col-md-6">
                            <span>{this.props.address}</span>
                            <span>{this.props.city}</span>
                            <span>{this.props.country}</span>
                        </address>
                    </div>

                    <div className="readmore">
                        <span className="eventmap">
                            <span className="button darkgreen" data-name="openbox" onClick={this.toggleMapBox}>View map</span>
                        </span>
                        <span className="eventreadmore">
                            <span className="button darkgreen" data-name="openbox" onClick={this.toggleInfoBox}>Read more...</span>
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
                        <h3>{this.props.Title}</h3>
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
                        <h3>{this.props.Title}</h3>
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
        };

        this.handleSearch = this.handleSearch.bind(this);
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
                

                <div id="filter">
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
                </div>
            </form>
        )
    }
}

export default EventBox;
