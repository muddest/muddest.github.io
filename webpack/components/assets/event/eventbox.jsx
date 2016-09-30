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
        };

        this.setHoverId = this.setHoverId.bind(this);
        this.filterData = this.filterData.bind(this);
        this.setHooveringPinId = this.setHooveringPinId.bind(this);
        this.changeSearchState = this.changeSearchState.bind(this);
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

    hoovering (id) {
        
    }

    setHooveringPinId (id) {
        this.setState({ hooveredPinId: id });
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

        for (var i=0; i < data.length; i++) {
            data[i].id = i;
        }

        let searchWord = this.state.searchWord.toLowerCase();
        let filteredData = [];

        var eventnodes = data.filter((event) => {

            var countryCheck = (this.state.country.indexOf(event.Country.toLowerCase()) > -1);
            if (false === countryCheck && 0 < this.state.country.length) {
                return false;
            }

            if (event.Title.toLowerCase().indexOf(searchWord) === -1 && 1 < this.state.searchWord.length) {
                return false;
            }

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
                            countries={countries} />
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