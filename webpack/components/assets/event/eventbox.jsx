import React from 'react';
import EventMap from './eventmap.jsx';
import InfoBox from './eventassets/infobox.jsx';
import EventList from './eventassets/eventlist.jsx';
import EventSearch from './eventassets/eventsearch.jsx';

class EventBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            fromDate: '',
            toDate: '',
            searchWord: '',
            hoveringId: '',
            hooveredPinId: '',
            countries: [],
            filteredData: [],
            initMap: false,
            clickedPin: null,
            windowWidth: 0,
            showInfoBox: false,
            infoBoxId: '',
            zooming: false,
            emptysearch: false,
            cities: [],
        };

        this.checkToDate = this.checkToDate.bind(this);
        this.handlePinClick = this.handlePinClick.bind(this);
        this.handleResize = this.handleResize.bind(this);


        
        this.closeInfoBox = this.closeInfoBox.bind(this);
        this.openInfoBox = this.openInfoBox.bind(this);


        this.setHoverId = this.setHoverId.bind(this);
        this.filterData = this.filterData.bind(this);
        this.setToDate = this.setToDate.bind(this);
        this.setFromDate = this.setFromDate.bind(this);
        this.setDataBySearch = this.setDataBySearch.bind(this);
        this.setHooveringPinId = this.setHooveringPinId.bind(this);
        this.changeSearchState = this.changeSearchState.bind(this);
        this.changeVisibleEventsByMapZoom = this.changeVisibleEventsByMapZoom.bind(this);
        this.setAvailableCountriesAndCitiesFromEvents = this.setAvailableCountriesAndCitiesFromEvents.bind(this);
    }

    changeVisibleEventsByMapZoom(visibleEvents) {
        if (visibleEvents.length > 0) {
            let filteredData = [];
            for (let i = 0; i < this.props.data.length; i++) {
                let curEvent = this.props.data[i];
                let curEventDate = new Date(curEvent.Date);

                for (let k = 0; k < visibleEvents.length; k++) {
                    if (curEvent.id === visibleEvents[k]
                        && curEventDate >= this.state.fromDate
                        && curEventDate <= this.state.toDate ) {

                        filteredData.push(curEvent);
                    }
                }
            }
            //console.log(filteredData);
            this.setState({ filteredData: filteredData, zooming: true });
        }
    }

    componentWillMount() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1;
        let yyyy = today.getFullYear();
        let nyyear = yyyy + 1;

        if( dd < 10 ){
            dd = '0'+dd;
        } 
        if(mm < 10){
            mm = '0' + mm
        }
        today = yyyy+'-'+mm+'-'+dd;
        let toDate = nyyear+'-'+mm+'-'+dd;

        this.setState({ fromDate: new Date(today), toDate: new Date(toDate) });
        this.setAvailableCountriesAndCitiesFromEvents(this.props.data);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        let curWidth = window.innerWidth;
        this.setDataBySearch();
        this.setState({ initMap: true, windowWidth: curWidth });
    }

    handleResize() {
        this.setState({windowWidth: window.innerWidth});
    }

    setAvailableCountriesAndCitiesFromEvents(data) {
        var lookup = {};
        var lookupCity = {};
        var cities = [];
        var items = data;
        var countries = [];

        for (var item, i = 0; item = items[i++];) {
            let country = item.Country;
            let city = item.City;

            if (!(country in lookup)) {
                lookup[country] = 1;
                countries.push(country.toLowerCase());
            }

            if (!(city in lookupCity)) {
                lookupCity[city] = 1;
                cities.push(city.toLowerCase());
            }
        }

        this.setState({ countries: countries, cities: cities });
    }


    changeSearchState(whichState, value) {
        this.setState({ zooming: false });
        switch (whichState) {
            case 'word':
                this.setState({ searchWord: value });
                break;
            case 'length':
                this.setState({ length: value });
                break;
        }
    }

    setHoverId (id) { this.setState({ hoveringId: id }); }
    filterData (data) { this.setState({ filteredData: data }); }
    setToDate(value) { this.setState({ toDate: new Date(value) }); }
    setHooveringPinId (id) { this.setState({ hooveredPinId: id }); }
    setFromDate(value) { this.setState({ fromDate: new Date(value) }); }


    componentDidUpdate(prevProps, prevState) {
        if (this.state.searchWord !== prevState.searchWord
            || this.state.fromDate !== prevState.fromDate
            || this.state.toDate !== prevState.toDate) {
            // Do this then
            this.setDataBySearch();
        }
    }

    checkToDate(toDateString) {
        let toDate = new Date(toDateString.Date);
        return toDate > this.state.toDate;
    }


    setDataBySearch() {
        // Split searchwords into array.
        let searchWord = this.state.searchWord.toLowerCase();
        // searchWord = searchWord.replace(/[^a-zA-Z ]/g, "");
        let wordArray = searchWord.split(' ');
        let filteredData = [];
        var matchedCountries = [];

        // Remove countries from searchwordarray and put in own array. This to filter countries
        for(let i=0; i < wordArray.length; i++) {
            let word = wordArray[i];
            if (word !== '' && word !== ' ') {
                this.state.countries.filter(function(item){
                    if (true === item.indexOf(word) > -1) {
                        if (false === matchedCountries.indexOf(item) > -1) {
                            matchedCountries.push(item);
                        }
                        wordArray[i] = '';
                    }
                });
            }
        }
  
        // Filter every event. Remove those who doesnt fulfill criteria
        var eventnodes = this.props.data.filter((event) => {
            let eventDate = new Date(event.Date);
            let eventTitle = event.Title.toLowerCase().replace(/[^a-zA-Z ]/g, "");
            
            if (eventDate < this.state.fromDate || eventDate > this.state.toDate) {
                return false;
            }

            // If search for country/countries do this, else skip.
            if (matchedCountries.length > 0) {
                var isInCountry = false;
                var isInSearch = true;
                var isWithinLength = true;

                // Check if event got country
                for (let i=0; i < matchedCountries.length; i++) {
                    if (matchedCountries[i] === event.Country.toLowerCase() && false === isInCountry) {
                        isInCountry = true;
                    }
                }

                // If searchword other than countries. Check if event fulfill both country and searchword.
                for (let i=0; i < wordArray.length; i++) {
                    let word = wordArray[i];
                    if (word === '') {
                        continue;
                    }

                    let lookingFor = new RegExp(".*"+word+".*", "i");
                    if (lookingFor.test(eventTitle)) {
                        isInSearch = true;
                        break;
                    } else {
                        isInSearch = false;
                    }
                }

                if (isInCountry && isInSearch) {
                    filteredData.push(event);
                }
                return false;
            }

            let lookingFor = new RegExp(".*"+searchWord+".*", "i");
            // console.log(this.state.cities.indexOf(lookingFor));
            // If no country given go for searchword
            
            if ((eventTitle.indexOf(searchWord) === -1 && 1 < this.state.searchWord.length)) {
                return false;
            }

            filteredData.push(event);
            return true;
        });

        let wasItEmpty = (0 < filteredData.length) ? false : true;
        this.setState({ filteredData: filteredData, searchedCountries: matchedCountries, emptysearch: wasItEmpty });
    }

    handlePinClick(eventId) {
        this.setState({ clickedPin: eventId });
        this.openInfoBox(eventId);
    }

    closeInfoBox(event) {
        let clicked = event.target.getAttribute('data-name');
        if ('closebox' === clicked) {
            $('body').removeClass('hideoverflow');
            $('body,#eventlist').removeClass('hideoverflow');
            this.setState({ showInfoBox: false, infoBoxId: null });
        }
    }

    openInfoBox(infoId) {
        $('body').addClass('hideoverflow');
        $('body,#eventlist').addClass('hideoverflow');
        this.setState({ showInfoBox: true, infoBoxId: infoId });
    }
    render() {
        let map = '';
        let infobox = '';

        if (this.state.initMap && this.state.windowWidth > 800) {
            map = (
                <EventMap
                    data={this.props.data}
                    handlepinclick={this.handlePinClick}
                    visible={this.state.filteredData}
                    sethooveredpinid={this.setHooveringPinId}
                    hoveringid={this.state.hoveringId}
                    visiblebyzoom={this.changeVisibleEventsByMapZoom}
                    zooming={this.state.zooming}
                    emptysearch={this.state.emptysearch} />
            );
        }

        if (true === this.state.showInfoBox && '' !== this.state.infoBoxId) {
            var filteredArray = this.props.data.filter((element) => { 
                return element.id === this.state.infoBoxId;
            });

            if (filteredArray.length > 0) {
                infobox = (
                    <InfoBox
                        title={filteredArray[0].Title}
                        youtube={filteredArray[0].Youtube}
                        closebox={this.closeInfoBox}
                        length={filteredArray[0].Length}
                        price={filteredArray[0].Price}
                        currency={filteredArray[0].Currency}
                        info={filteredArray[0].content}
                        date={filteredArray[0].Date}
                        outputdate={filteredArray[0].outPutDate}
                        address={filteredArray[0].address}
                        city={filteredArray[0].City}
                        country={filteredArray[0].Country}
                        homepage={filteredArray[0].Site}
                        obstacles={filteredArray[0].Obstacles} />
                );
            } else {
                this.setState({ showInfoBox: false });
            }
        }
        return (
            <div id="eventbox">
                <div id="eventcontainer">
                    <div id="leftbar">
                        <EventSearch 
                            changesearchstate={this.changeSearchState}
                            setfromdate={this.setFromDate}
                            settodate={this.setToDate}
                            emptysearch={this.state.emptysearch} />
                        <EventList
                            showinginfobox={this.state.showInfoBox}
                            hooveredpinid={this.state.hooveredPinId}
                            toggleinfobox={this.openInfoBox}
                            sethoverid={this.setHoverId}
                            clickedpin={this.state.clickedPin}
                            data={this.state.filteredData}
                            handlepinclick={this.handlePinClick} />
                    </div>
                    {map}
                    {infobox}
                </div>
                
            </div>
        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.hoveringId !== nextState.hoveringId
            || this.state.searchWord !== nextState.searchWord
            || this.state.hooveredPinId !== nextState.hooveredPinId
            || this.state.filteredData !== nextState.filteredData
            || this.state.clickedPin !== nextState.clickedPin
            || this.state.searchedCountries !== nextState.searchedCountries
            || this.state.windowWidth !== nextState.windowWidth
            || this.state.showInfoBox !== nextState.showInfoBox
            || this.state.emptysearch !== nextState.emptysearch) {
            return true;
        } else {
            return false;
        }
    }
}
// REMOVED FILTER SEARCH
//|| this.state.length.min !== nextState.length.min
//|| this.state.length.max !== nextState.length.max
//|| this.state.fromDate !== nextState.fromDate
//|| this.state.toDate !== nextState.toDate

// REMOVED FROM STATE
//length: {
//    min: 0,
//    max: 30,
//},

export default EventBox;