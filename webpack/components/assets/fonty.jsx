import React from 'react';

class Fonty extends React.Component {
    render () {
        return (
            <div>
                <div className="filter-text-before"><i className={"fa "+this.props.icon} aria-hidden="true"></i>{this.props.text}</div>
            </div>
        )
    }
}

export default Fonty;