import React from 'react';

class InfoWindow extends React.Component {

    handleClick() {
        console.log('CLicked');
    }

    render() {
        let style = {position: 'absolute', height: 100, width: 100, zIndex: 100, background: 'grey', top: this.props.y, left: this.props.x};
        return (
            <div>
                <span style={style} id="yayaaa" onClick={this.props.hey}>Klicka på mig</span>
            </div>
        )
    }
}

export default InfoWindow;