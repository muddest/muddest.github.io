import React from 'react';
import Select from 'react-select';
import InputRange from 'react-input-range';

var timer = '';

class EventSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            values: {
                min: 0,
                max: 30,
            },
            searchVal: '',
            fromDate: '',
            toDate: '',
            searching: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleToDate = this.handleToDate.bind(this);
        this.handleFromDate = this.handleFromDate.bind(this);
        this.updateSearchVal = this.updateSearchVal.bind(this);
        this.handleValuesChange = this.handleValuesChange.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.values.min !== nextState.values.min
            || this.state.values.max !== nextState.values.max
            || this.state.searchVal !== nextState.searchVal
            || this.state.fromDate !== nextState.fromDate
            || this.state.toDate !== nextState.toDate) {
            return true;
        } else {
            return false;
        }
    }

    componentDidMount() {
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

        this.setState({ fromDate: today, toDate: toDate });
    }

    handleValuesChange(component, values) {
        this.setState({ values: values, });
        this.handleSearch('length', values);
    }

    handleSearch(which, value) {
        this.props.changesearchstate(which, value);
    }

    updateSearchVal(e) {
        var that = this;
        var value = e.target.value;
        timer = setTimeout(function() {
            that.handleSearch('word', value);
        }, 700);
        
        this.setState({ searchVal: value });
    }

    handleSubmit (e) {
        e.preventDefault();
    }

    handleFromDate(e) {
        this.props.setfromdate(e.target.value);
        this.setState({ fromDate: e.target.value });
    }

    handleToDate(e) {
        this.props.settodate(e.target.value);
        this.setState({ toDate: e.target.value });
    }

    resetSearchTimer() {
        clearTimeout(timer);
    }

    render () {
        return (
            <form id="filter" autoComplete="off" onSubmit={this.handleSubmit}>
                <input
                    autoComplete="off"
                    type="search"
                    placeholder="Search for events"
                    onKeyUp={this.updateSearchVal}
                    onKeyDown={this.resetSearchTimer}
                    tabIndex="1" />

                <input type="date" name="from" value={this.state.fromDate} onChange={this.handleFromDate} tabIndex="2" /> to <input type="date" name="to" value={this.state.toDate} onChange={this.handleToDate} tabIndex="3" />
                
                <InputRange
                        maxValue={30}
                        minValue={0}
                        value={this.state.values}
                        onChange={this.handleValuesChange.bind(this)} />
            </form>
        )
    }
}

export default EventSearch;