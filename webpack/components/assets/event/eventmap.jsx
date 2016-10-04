import React from 'react';
import ReactDOM from 'react-dom';

var map = '';
var bounds = '';
var markerCluster = '';
var infoWindowBig = new google.maps.InfoWindow();

class EventMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            markers: [],
        };

        this.zoomInMap = this.zoomInMap.bind(this);
        this.zoomOutMap = this.zoomOutMap.bind(this);
        this.addMarkers = this.addMarkers.bind(this);
        this.updateMarkers = this.updateMarkers.bind(this);
        this.createContentString = this.createContentString.bind(this);
        this.handleMousePinMouseout = this.handleMousePinMouseout.bind(this);
        this.handleMousePinMouseover = this.handleMousePinMouseover.bind(this);
    }

    componentWillMount() {
        const mapRef = this.refs.map;
        const node = document.getElementById('map');
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
        markerCluster = new MarkerClusterer(map, this.state.markers, {imagePath: '/assets/images/cluster/m', ignoreHidden: true, zoomOnClick: false});
        google.maps.event.addListener(markerCluster, 'click', function(cluster) {
            var markers = cluster.getMarkers();
            var array = [];
            var num = 0;
            var string = '';
            console.log(markers);
            for (let i = 0; i < markers.length; i++) {
                string += markers[i].title+'<br>';
            }

            infoWindowBig.setContent('<h1>Events</h1><br>'+string);
            infoWindowBig.setPosition(cluster.getCenter());
            infoWindowBig.open(map);
        });
        google.maps.event.addListener(map, "click", function(event) { infoWindowBig.close(); });
    }

    addMarkers(data) {
        let markingRuff = [];

        for (let i=0; i < data.length; i++) {
            markingRuff.push({ 
                location: {lat: data[i].lat, lng: data[i].lng}, 
                title: data[i].Title,
                content: this.createContentString(data[i]),
                id: data[i].id,
            });
        }

        var markers = markingRuff.map((mark, i) => {
            let marker = new google.maps.Marker({
                position: mark.location,
                zoom: 3,
                clusterSize: 70,
                title: mark.title,
                id: mark.id
            });
            
            let infowindow = new google.maps.InfoWindow({
                content: mark.content,
            });

            //marker.addListener('mouseover', () => this.handleMousePinMouseover(marker, infowindow));
            //marker.addListener('mouseout', () => this.handleMousePinMouseout(marker, infowindow));
            marker.addListener('mousedown', function() { infowindow.open(map, marker); });
            marker.addListener(map, 'mousedown', function() { infowindow.close(); });
            marker.addListener('dblclick', function() { infowindow.close(); });
            google.maps.event.addListener(map, 'click', function() {
                if (infowindow) {
                    infowindow.close();
                }
            });
            
            return marker;
        });

        this.setState({ markers: markers });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.hoveringid !== nextProps.hoveringid
            || this.props.visible !== nextProps.visible
            || this.props.data !== nextProps.data) {
            return true;
        } else {
            return false;
        }
    }



    componentWillReceiveProps(nextProps) {
        let currentMarkId = this.props.hoveringid;
        let newMarkId = nextProps.hoveringid;

        if (newMarkId === '') {
            let mark = this.state.markers.filter(function(mark) { return mark.id == currentMarkId });
            console.log('Dbclick');
            google.maps.event.trigger(mark[0], 'dblclick');
        }
        if (newMarkId !== currentMarkId && newMarkId !== '') {
            let mark = this.state.markers.filter(function(mark) { return mark.id == newMarkId });
            console.log('Mousedown');
            google.maps.event.trigger(mark[0], 'mousedown');
        }


        var clusters = markerCluster.getClusters();
        for (let i = 0; i < clusters.length; i++) {
            //console.log('Checking cluster: ', clusters[i]);
            for( var j=0; j < clusters[i].markers_.length; j++){
                let marker = clusters[i].markers_[j]; // <-- Here's your clustered marker
                //console.log(marker);
            }
        }


        
        this.updateMarkers(nextProps.visible);
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
        let markers = [];
        for (let i=0; i < this.state.markers.length; i++) {
            let curMarker = this.state.markers[i];
            let foundMarker = false;
            for (let k=0; k < data.length; k++) {
                if (data[k].id === curMarker.id && curMarker.getVisible !== true) {
                    curMarker.setVisible(true);
                    foundMarker = true;
                    //bounds.extend(curMarker.getPosition());
                    //map.panTo(curMarker.getPosition());
                    break;
                }
            }

            if (!foundMarker && curMarker.getVisible() !== false) {
                curMarker.setVisible(false);
            }
            markers.push(curMarker);
        }

        if (markers !== this.state.markers) {
            //console.log('Redoiing');
            this.setState({ markers: markers });
            map.fitBounds(bounds);
            markerCluster.repaint();
        }
    }

    zoomInMap () { map.setZoom(map.getZoom() + 1); }
    zoomOutMap () { map.setZoom(map.getZoom() - 1); }

    render () {
        return (
            <div>
                <div id="zoomcontrol">
                    <span id="plus" onClick={this.zoomInMap}>+</span>
                    <span id="minus" onClick={this.zoomOutMap}>-</span>
                </div>
            </div>
        )
    }

    createContentString(data) {
        let content = '';
        content += "<h2>"+data.Title+"</h2>";
        content += data.Date;
        content += "<a href="+data.Site+">Homepage</a>";
        return content;
    }
}


export default EventMap;