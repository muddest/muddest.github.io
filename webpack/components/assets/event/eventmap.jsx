import React from 'react';
import ReactDOM from 'react-dom';

var map = '';
var bounds = '';

class EventMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            markers: [],
        };

        this.initMap = this.initMap.bind(this);
        this.zoomInMap = this.zoomInMap.bind(this);
        this.createContentString = this.createContentString.bind(this);
        this.handleMousePinMouseout = this.handleMousePinMouseout.bind(this);
        this.handleMousePinMouseover = this.handleMousePinMouseover.bind(this);
        this.zoomOutMap = this.zoomOutMap.bind(this);
        this.addMarkers = this.addMarkers.bind(this);
        this.updateMarkers = this.updateMarkers.bind(this);
    }

    createContentString(data) {
        console.log(data.Title);
        let content = '';
        content += "<h2>"+data.Title+"</h2>";
        content += data.Date;
        content += "<a href="+data.Site+">Homepage</a>";
        return content;
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
        bounds = new google.maps.LatLngBounds();
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
            google.maps.event.trigger(prevMark[0], 'mouseup');
        }
        if (newMarkId !== currentMarkId && newMarkId !== '') {
            let mark = this.state.markers.filter(function(mark) { return mark.id == newMarkId });
            google.maps.event.trigger(mark[0], 'mousedown');
        }
        this.updateMarkers(nextProps.data);
    }

    addMarkers(data) {
        let markers = [];
        for (let i=0; i < data.length; i++) {            
            
            let marker = new google.maps.Marker({
                position: {lat: data[i].lat, lng: data[i].lng},
                map: map,
                title: data[i].Title
            });
            let contentString = this.createContentString(data[i]);
            let infowindow = new google.maps.InfoWindow({
                content: contentString,
            });

            marker.id = data[i].id;

            marker.addListener('mouseover', () => this.handleMousePinMouseover(marker, infowindow));
            marker.addListener('mouseout', () => this.handleMousePinMouseout(marker, infowindow));
            marker.addListener('mousedown', function() { infowindow.open(map, marker); });
            marker.addListener('mouseup', function() { infowindow.close(); });

            markers.push(marker);
        }

        this.setState({ markers: markers });
    }

    handleMousePinMouseover(marker, infowindow) {
        infowindow.open(map, marker);
        this.props.sethooveredpinid(marker.id);
    }

    handleMousePinMouseout(marker, infowindow) {
        infowindow.close();
        this.props.sethooveredpinid('');
    }

    updateMarkers(data) {
        for (let i=0; i < this.state.markers.length; i++) {
            let curMarker = this.state.markers[i];
            let foundMarker = false;
            for (let k=0; k < data.length; k++) {
                if (data[k].id === curMarker.id) {
                    curMarker.setVisible(true);
                    foundMarker = true;
                    bounds.extend(curMarker.getPosition());
                    break;
                }
            }

            if (!foundMarker) {
                curMarker.setVisible(false);
            }
        }

        map.fitBounds(bounds);
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