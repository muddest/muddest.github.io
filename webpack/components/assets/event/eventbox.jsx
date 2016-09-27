import React from 'react';
import EventMap from './eventmap.jsx';
import EventList from './eventassets/eventlist.jsx';
import EventSearch from './eventassets/eventsearch.jsx';

class EventBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            searchWord: '',
            length: {
                min: 0,
                max: 20,
            },
            country: [],
        };

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
            <div id="eventbox">
                <EventSearch 
                    changesearchstate={this.changeSearchState}
                    countries={countries} />
                <EventList
                    data={data}
                    searchword={this.state.searchWord}
                    country={this.state.country}
                    possiblecountries={countries}
                    length={this.state.length} />
                <EventMap />
            </div>
        )
    }
}


export default EventBox;