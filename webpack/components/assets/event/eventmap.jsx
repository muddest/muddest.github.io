import React from 'react';
import ReactDOM from 'react-dom';

var map = '';

class EventMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            markers: [],
        };

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
        let markers = [];
        for (let i=0; i < data.length; i++) {            
            let infowindow = new google.maps.InfoWindow({
                content: data[i].Title,
            });
            console.log(data[i].Title+data[i].lat);
            let marker = new google.maps.Marker({
                position: {lat: data[i].lat, lng: data[i].lng},
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
            console.log(marker);
        }

        this.setState({ markers: markers });
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