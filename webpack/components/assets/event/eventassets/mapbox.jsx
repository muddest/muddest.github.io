import React from 'react';

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

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.title !== nextProps.title
            || this.props.content !== nextProps.content) {
            return true;
        } else {
            return false;
        }
    }
}


export default MapBox;