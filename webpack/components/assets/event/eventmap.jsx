import React from 'react';
import ReactDOM from 'react-dom';

class EventMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.initMap = this.initMap.bind(this);
        this.scream = this.scream.bind(this);
    }

    initMap () {
        const mapRef = this.refs.map;
        const node = ReactDOM.findDOMNode(mapRef);
        var mapOptions = {
            center: new window.google.maps.LatLng(59.334823, 18.069937),
            zoom: 5,
            disableDefaultUI: true,
            zoomControl: true,
        };

        var map = new window.google.maps.Map(node, mapOptions);

        

        map.addListener('click', (e) => this.scream(e.latLng, map));
    }

    componentDidMount() {
          this.initMap();
    }

    scream (latLng, map) {
        console.log('ROAR');
        var marker = new google.maps.Marker({
            position: latLng,
            map: map
        });
        map.panTo(latLng);
    }

    render () {
        const style = {
            width: '100vw',
            height: '100vh'
        };

        return (
            <div id="eventmap">
                <h2 onClick={this.scream}>Mappern WOHO!!!</h2>
                <div id="map" ref="map"></div>
            </div>
        )
    }
}


export default EventMap;