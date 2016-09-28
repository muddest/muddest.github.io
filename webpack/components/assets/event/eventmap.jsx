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
        this.updateMarkers = this.updateMarkers.bind(this);
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
        this.updateMarkers(nextProps.data);
    }

    addMarkers(data) {
        let markers = [];
        for (let i=0; i < data.length; i++) {            
            let infowindow = new google.maps.InfoWindow({
                content: data[i].Title,
            });
            let marker = new google.maps.Marker({
                position: {lat: data[i].lat, lng: data[i].lng},
                map: map,
                title: data[i].Title
            });
            marker.addListener('mouseover', function() {
                infowindow.open(map, marker);
            });
                marker.addListener('mouseout', function() {
                infowindow.close();
            });

            marker.id = data[i].id;
            markers.push(marker);
        }

        this.setState({ markers: markers });
    }

    updateMarkers(data) {
        for (let i=0; i < this.state.markers.length; i++) {
            let curMarker = this.state.markers[i];
            let foundMarker = false;
            for (let k=0; k < data.length; k++) {
                if (data[k].id === curMarker.id) {
                    curMarker.setVisible(true);
                    foundMarker = true;
                    break;
                }
            }

            if (!foundMarker) {
                curMarker.setVisible(false);
            }
        }
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