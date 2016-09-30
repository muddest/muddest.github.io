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
        this.zoomInMap = this.zoomInMap.bind(this);
        this.zoomOutMap = this.zoomOutMap.bind(this);
        this.addMarkers = this.addMarkers.bind(this);
        this.updateMarkers = this.updateMarkers.bind(this);
    }

    initMap () {
        const mapRef = this.refs.map;
        const node = ReactDOM.findDOMNode(mapRef);
        var mapOptions = {

            center: new google.maps.LatLng(64.262903, -10.809107),
            zoom: 3,
            disableDefaultUI: true,
            scrollwheel: false,
        };

        map = new google.maps.Map(node, mapOptions);

        this.addMarkers(this.props.data);
    }

    componentDidMount() {
        this.initMap();
    }

    componentWillReceiveProps(nextProps) {
        let currentMarkId = this.props.hoveringid;
        let newMarkId = nextProps.hoveringid;

        if (currentMarkId !== '' || newMarkId === '') {
            let prevMark = this.state.markers.filter(function(prevMark) { return prevMark.id == currentMarkId });
            google.maps.event.trigger(prevMark[0], 'mouseout');
        }
        if (newMarkId !== currentMarkId && newMarkId !== '') {
            let mark = this.state.markers.filter(function(mark) { return mark.id == newMarkId });
            google.maps.event.trigger(mark[0], 'mouseover');
        }
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
                this.props.sethooveredpinid(marker.id);
            });
                marker.addListener('mouseout', function() {
                infowindow.close();
                this.props.sethooveredpinid('');
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

    zoomInMap () {
        map.setZoom(map.getZoom() + 1);
    }

    zoomOutMap () {
        map.setZoom(map.getZoom() - 1);
    }

    render () {
        
        return (
            <div id="eventmap">
                <div id="zoomcontrol">
                    <span id="plus" onClick={this.zoomInMap}>+</span>
                    <span id="minus" onClick={this.zoomOutMap}>-</span>
                </div>
                <div id="map" ref="map"></div>
            </div>
        )
    }
}


export default EventMap;