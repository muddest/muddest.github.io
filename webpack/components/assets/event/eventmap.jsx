import React from 'react';
import ReactDOM from 'react-dom';

var map = '';
var markers = [];

class EventMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.initMap = this.initMap.bind(this);
        this.addMarkers = this.addMarkers.bind(this);
        this.removeMarkers = this.removeMarkers.bind(this);
    }

    initMap () {
        const mapRef = this.refs.map;
        const node = ReactDOM.findDOMNode(mapRef);
        var mapOptions = {
            center: new google.maps.LatLng(59.334823, 18.069937),
            zoom: 5,
            disableDefaultUI: true,
            zoomControl: true,
        };

        map = new google.maps.Map(node, mapOptions);

        map.addListener('click', (e) => this.scream(e.latLng, map));
        this.addMarkers(this.props.data);
    }

    componentDidMount() {
        this.initMap();
    }

    componentWillReceiveProps(nextProps) {
        this.removeMarkers();
        //console.log(nextProps);
        this.addMarkers(nextProps.data);
    }

    addMarkers(data) {
        for (let i=0; i < data.length; i++) {
            let infowindow = new google.maps.InfoWindow({
                content: 'Tough vikiing är riktigt häftigt!!'
            });

            let marker = new google.maps.Marker({
                position: {lat: data[i].lng, lng: data[i].lat},
                map: map,
                title: data[i].Title
            });
            marker.addListener('mouseover', function() {
                infowindow.open(map, marker);
                //map.setCenter(marker.getPosition()); Used to position to that place
            });
                marker.addListener('mouseout', function() {
                infowindow.close();
            });

            markers.push(marker);
        }
    }

    removeMarkers() {
        for (var i = 0; i < markers.length; i++) {
            console.log('djskldjs', markers[i]);
          markers[i].setMap(null);
        }
        markers = [];
    }


    render () {
        
        return (
            <div id="eventmap">
                <div id="map" ref="map"></div>
            </div>
        )
    }
}


export default EventMap;