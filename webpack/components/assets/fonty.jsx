import React from 'react';

class Fonty extends React.Component {
    render () {
        return (
            <div className={this.props.class}>
                <div className="filter-text-before">{this.props.textbefore}</div>
                <i className={"fa "+this.props.icon} aria-hidden="true"></i>
                <div className="filter-text-after">{this.props.textafter}</div>
            </div>
        )
    }
}

export default Fonty;