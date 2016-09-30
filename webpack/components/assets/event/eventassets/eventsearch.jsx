import React from 'react';
import Select from 'react-select';
import InputRange from 'react-input-range';



class EventSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            values: {
                min: 0,
                max: 30,
            },
            searchVal: '',
            selectedCountries: [],
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleValuesChange = this.handleValuesChange.bind(this);
        this.updateSearchVal = this.updateSearchVal.bind(this);
        this.handleSelectedCountries = this.handleSelectedCountries.bind(this);
    }

    handleValuesChange(component, values) {
        this.setState({ values: values, });
        this.handleSearch('length', values);
    }

    handleSearch(which, value) {
        this.props.changesearchstate(which, value);
    }

    updateSearchVal(e) {
        this.handleSearch('word', e.target.value);
        this.setState({ searchVal: e.target.value });
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
    }

    render () {
        return (
            <form id="filter" autoComplete="off" onSubmit={this.handleSubmit}>
                <input
                    autoComplete="off"
                    type="search"
                    placeholder="Search for events"
                    onChange={this.updateSearchVal} />
                
                <InputRange
                        maxValue={30}
                        minValue={0}
                        value={this.state.values}
                        onChange={this.handleValuesChange.bind(this)} />

                <Select
                    name="select-country"
                    multi={true}
                    clearable={true}
                    searchable={false}
                    value={this.state.selectedCountries}
                    placeholder="Select one or more countries"
                    options={this.props.countries}
                    onChange={this.handleSelectedCountries} />
            </form>
        )
    }
}

export default EventSearch;