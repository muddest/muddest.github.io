import React from 'react';

class Fonty extends React.Component {
    render () {
        return (
            <div>
                <div className="filter-text-before"><i className={"fa "+this.props.icon} aria-hidden="true"></i>{this.props.text}</div>
            </div>
        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.icon !== nextProps.icon
            || this.props.text !== nextProps.text) {
            return true;
        } else {
            return false;
        }
    }
}

export default Fonty;