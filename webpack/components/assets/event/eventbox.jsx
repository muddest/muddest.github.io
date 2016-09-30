import React from 'react';
import EventMap from './eventmap.jsx';
import EventList from './eventassets/eventlist.jsx';
import EventSearch from './eventassets/eventsearch.jsx';

class EventBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            filteredData: [],
            searchWord: '',
            length: {
                min: 0,
                max: 20,
            },
            hoveringId: '',
            country: [],
            hooveredPinId: '',
            fromDate: '',
            toDate: '',
        };

        this.setHoverId = this.setHoverId.bind(this);
        this.filterData = this.filterData.bind(this);
        this.setToDate = this.setToDate.bind(this);
        this.setFromDate = this.setFromDate.bind(this);
        this.setHooveringPinId = this.setHooveringPinId.bind(this);
        this.changeSearchState = this.changeSearchState.bind(this);
    }

    componentWillMount() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1;
        let yyyy = today.getFullYear();
        let nyear = today.getFullYear()+1;
        if( dd < 10 ){
            dd = '0'+dd;
        } 
        if(mm < 10){
            mm = '0' + mm
        }
        today = yyyy+'-'+mm+'-'+dd;
        let toDate = nyear+'-'+mm+'-'+dd;

        this.setState({ fromDate: new Date(today), toDate: new Date(toDate) });
    }


    changeSearchState(whichState, value) {
        switch (whichState) {
            case 'word':
                this.setState({ searchWord: value });
                break;
            case 'country':
                this.setState({ country: value });
                break;
            case 'length':
                this.setState({ length: value });
                break;
        }
    }

    sortByDate (a, b) {
        return new Date(a.Date).getTime() - new Date(b.Date).getTime();
    }

    filterData (data) {
        this.setState({ filteredData: data })
    }

    setHoverId (id) {
        this.setState({ hoveringId: id });
    }


    setHooveringPinId (id) {
        this.setState({ hooveredPinId: id });
    }

    setFromDate(value) {
        this.setState({ fromDate: new Date(value) });
    }

    setToDate(value) {
        this.setState({ toDate: new Date(value) });
    }

    render() {
        var data = this.props.data;
        data.sort(this.sortByDate);

        var lookup = {};
        var items = data;
        var countries = [];
        var countriesToCompare = [];

        // Check available countries. Information from events
        for (var item, i = 0; item = items[i++];) {
            let country = item.Country;

            if (!(country in lookup)) {
                lookup[country] = 1;
                countriesToCompare.push(country.toLowerCase());
                countries.push({value: country, label: country});
            }
        }

        // Set ID for every event
        for (var i=0; i < data.length; i++) {
            data[i].id = i;
        }

        // Split searchwords into array.
        let searchWord = this.state.searchWord.toLowerCase();
        let wordArray = searchWord.split(' ');
        let filteredData = [];
        var matchedCountries = [];

        // Remove countries from searchwordarray and put in own array. This to filter countries
        for(let i=0; i < wordArray.length; i++) {
            let word = wordArray[i];
            if (word !== '' && word !== ' ') {
                countriesToCompare.filter(function(item){
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
        var eventnodes = data.filter((event) => {
            let eventDate = new Date(event.Date);
            
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
                    if (lookingFor.test(event.Title.toLowerCase())) {
                        isInSearch = true;
                        break;
                    } else {
                        isInSearch = false;
                    }
                }

                if (this.state.length.min > parseInt(event.Length) || this.state.length.max < parseInt(event.Length)) {
                    isWithinLength = false;
                }

                if (isInCountry && isInSearch && isWithinLength) {
                    filteredData.push(event);
                }
                return false;
            }

            // If no country given go for searchword
            if (event.Title.toLowerCase().indexOf(searchWord) === -1 && 1 < this.state.searchWord.length) {
                return false;
            }

            // If no country given. Go for length
            if (this.state.length.min > parseInt(event.Length) || this.state.length.max < parseInt(event.Length)) {
                return false;
            }

            filteredData.push(event);
            return true;
        });

        return (
            <div id="eventbox">
                <div id="eventcontainer">
                    <div id="leftbar">
                        <EventSearch 
                            changesearchstate={this.changeSearchState}
                            countries={countries}
                            setfromdate={this.setFromDate}
                            settodate={this.setToDate} />
                        <EventList
                            hooveredpinid={this.state.hooveredPinId}
                            sethoverid={this.setHoverId}
                            data={filteredData} />
                    </div>
                    <EventMap
                        data={filteredData}
                        sethooveredpinid={this.setHooveringPinId}
                        hoveringid={this.state.hoveringId} />
                </div>
                
            </div>
        )
    }
}



export default EventBox;