import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import React from 'react';
import Remarkable from 'remarkable';
import Fonty from './assets/fonty.jsx';
import Select from 'react-select';


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

    sortByDate (a, b) {
        return new Date(a.Date).getTime() - new Date(b.Date).getTime();
    }

    render() {
        var data = this.props.data;
        data.sort(this.sortByDate);

        var lookup = {};
        var items = data;
        var countries = [];

        for (var item, i = 0; item = items[i++];) {
            var country = item.Country;

            if (!(country in lookup)) {
                lookup[country] = 1;
                countries.push({value: country, label: country});
            }
        }

        return (
            <div>
                <EventSearch 
                    changesearchstate={this.changeSearchState}
                    countries={countries} />
                <EventList
                    data={data}
                    searchword={this.state.searchWord}
                    minlength={this.state.minLength}
                    maxlength={this.state.maxLength}
                    country={this.state.country}
                    possiblecountries={countries} />
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
        let searchWord = this.props.searchword.toLowerCase();

        var eventnodes = this.props.data.filter((event) => {
            if ( parseInt(event.Length) < parseInt(this.props.minlength)) {
                return false;
            }

            if ( parseInt(event.Length) > parseInt(this.props.maxlength)) {
                return false;
            }

            var countryCheck = (this.props.country.indexOf(event.Country.toLowerCase()) > -1);
            if (false === countryCheck && 0 < this.props.country.length) {
                return false;
            }

            if (event.Title.toLowerCase().indexOf(searchWord) === -1 && 1 < this.props.searchword.length) {
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
        let daysColor = 'regular';
        if (this.props.daysleft <= 20) {
            daysColor = 'red';
        } else if (this.props.daysleft > 20 && this.props.daysleft <= 60) {
            daysColor = 'green';
        }
        return (
            <div key={this.props.id} className="event">
                <div className="eventcontainer">
                    <div className="eventhead">
                        <h2>{this.props.title}</h2>
                        <div className="daysleftcontainer">
                            <span className={'daysleft '+daysColor}>{this.props.daysleft} days left</span>
                        </div>
                        <span className="date"><Fonty text={this.props.date} icon="fa-calendar" /></span>
                        <div className="countrycontainer">
                            <span><Fonty text={this.props.country} icon="fa-globe" /></span>
                        </div>
                    </div>

                    <div className="eventshortinfo">
                        <span><Fonty text={this.props.length+" km"} icon="fa-map-marker" /></span>
                        <span><Fonty text={this.props.obstacles+" obstacles"} icon="fa-fire" /></span>
                        <span><Fonty text="Challenge 4.5" icon="fa-heartbeat" /></span>
                        <span><a href={this.props.site} target="_blank">{this.props.title}</a></span>
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
                        <h3>{this.props.title}</h3>
                        <span dangerouslySetInnerHTML={this.rawMarkup()} />
                        <div className="video-container">
                            <iframe width="560" height="315" src={this.props.youtube} frameBorder="0" allowFullScreen></iframe>
                        </div>
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
            selectedCountries: [],
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.updateSearchVal = this.updateSearchVal.bind(this);
        this.handleSelectedCountries = this.handleSelectedCountries.bind(this);
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

    handleSelectedCountries(selectedCountries) {
        this.setState({selectedCountries});
        let countries = [];
        for (let i = 0; i < selectedCountries.length; i++) {
            countries.push(selectedCountries[i].label.toLowerCase());
        }
        this.handleSearch('country', countries);
    }

    handleSubmit (e) {
        e.preventDefault();
        console.log('Prevented');
    }

    updateCountryVal(e) {
        let options = e.target.options;
        let countryOptions = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                countryOptions.push(options[i].value.toLowerCase());
            }
        }
        this.handleSearch('country', countryOptions);
    }


    render () {
        return (
            <div id="leftbar">
                <form className="searchevents" autoComplete="off">
                    <input
                        autoComplete="off"
                        type="search"
                        placeholder="Find events"
                        onChange={this.updateSearchVal}
                        onSubmit={this.handleSubmit} />
                    

                    <div id="filter" className="container">
                        <div className="row lengthinput">
                            <span className="label before col-xs-6">Min. length</span>
                            <span className="label after col-xs-6 pull-right">{this.state.minLengthVal} km</span>
                            <input
                                id="minlength"
                                type="range"
                                min="0"
                                max="30"
                                step="1"
                                data-name="minlength"
                                value={this.state.minLengthVal}
                                onChange={this.handleMinLengthchange} />
                        </div>

                        <div className="row lengthinput">
                            <span className="label before col-xs-6">Max. length</span>
                            <span className="label after col-xs-6 pull-right">{this.state.maxLengthVal} km</span>
                            <input
                                id="maxlength"
                                type="range"
                                min="0"
                                max="30"
                                step="1"
                                data-name="maxlength"
                                value={this.state.maxLengthVal}
                                onChange={this.handleMaxLengthchange} />
                        </div>

                            <Select
                                name="select-country"
                                multi={true}
                                clearable={true}
                                searchable={false}
                                value={this.state.selectedCountries}
                                placeholder="Select one or more countries"
                                options={this.props.countries}
                                onChange={this.handleSelectedCountries} />
                    </div>
                </form>
            </div>
        )
    }
}

export default EventBox;
