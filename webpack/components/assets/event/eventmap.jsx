import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import InfoWindow from './eventassets/infowindow.jsx';

var map = '';
var bounds = '';
var markerCluster = '';
var infoWindowBig = new google.maps.InfoWindow({ pixelOffset: new google.maps.Size(0, -20) });

class EventMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            markers: [],
            mappedZoomed: false,
            fitToBounds: true,
        };

        this.updatePanning = this.updatePanning.bind(this);

        this.zoomInMap = this.zoomInMap.bind(this);
        this.zoomOutMap = this.zoomOutMap.bind(this);
        this.addMarkers = this.addMarkers.bind(this);
        this.eventHovered = this.eventHovered.bind(this);
        this.eventMouseout = this.eventMouseout.bind(this);
        this.updateMarkers = this.updateMarkers.bind(this);

        this.updateBoundsChange = this.updateBoundsChange.bind(this);

        this.createContentString = this.createContentString.bind(this);
        this.handleMousePinMouseout = this.handleMousePinMouseout.bind(this);
        this.handleMousePinMouseover = this.handleMousePinMouseover.bind(this);
    }

    componentWillMount() {
        const mapRef = this.refs.map;
        const node = document.getElementById('map');
        var mapOptions = {
            center: new google.maps.LatLng(48.413684, -52.064998),
            zoom: 3,
            maxZoom: 13,
            disableDefaultUI: true,
            scrollwheel: false,
        };
        map = new google.maps.Map(node, mapOptions);
        this.addMarkers(this.props.data);
    }




    componentDidMount() {
        $('#plus').click($.proxy(function() { this.zoomInMap(); }, this));
        $('#minus').click($.proxy(function() { this.zoomOutMap(); }, this));

        markerCluster = new MarkerClusterer(map, this.state.markers, {imagePath: '/assets/images/cluster/m', ignoreHidden: true, zoomOnClick: false});
        
        google.maps.event.addListener(map,'dblclick', this.updateBoundsChange);

        google.maps.event.addListener(map,'dragstart', this.updatePanning);
        google.maps.event.addListener(map,'dragend', this.updateBoundsChange);

        var _that = this;

        google.maps.event.addListener(markerCluster, 'click', function(cluster) {
            map.setCenter(cluster.getCenter());
            map.setZoom(map.getZoom()+2);
            infoWindowBig.close();
            _that.updateBoundsChange();
        });

        google.maps.event.addListener(markerCluster, 'mouseover', function(cluster) {
            var markers = cluster.getMarkers();
            var array = [];
            var num = 0;
            var string = '';
            for (let i = 0; i < markers.length; i++) {
                string += markers[i].title+' - '+markers[i].length+'<br>';
                if (i > 5) {
                    string += 'and more...';
                    break;
                }
            }

            infoWindowBig.setContent('<h2>Events</h2><br>'+string);
            infoWindowBig.setPosition(cluster.getCenter());
            infoWindowBig.open(map);
        });
        
        google.maps.event.addListener(map, "click", function(event) { infoWindowBig.close(); });
        this.updateMarkers(this.props.visible);
    }


    updatePanning() {
        this.setState({ fitToBounds: false });
    }





    updateBoundsChange() {
        let visibleIds = [];
        let markers = [];
        
        for (let i = 0; i < this.state.markers.length; i++) {
            let curMarker = this.state.markers[i];
            if (map.getBounds().contains(curMarker.getPosition())) {
                curMarker.setVisible(true);
                visibleIds.push(curMarker.id);
            } 
            else if (!map.getBounds().contains(curMarker.getPosition()) && curMarker.getVisible()) {
                curMarker.setVisible(false);
            }
            markers.push(curMarker);
        }
        
        this.props.visiblebyzoom(visibleIds);
        this.setState({ markers: markers });
    }





    addMarkers(data) {
        let markingRuff = [];

        for (let i=0; i < data.length; i++) {
            markingRuff.push({ 
                location: {lat: data[i].lat, lng: data[i].lng}, 
                title: data[i].Title,
                content: this.createContentString(data[i]),
                id: data[i].id,
                length: data[i].Length,
            });
        }

        var markers = markingRuff.map((mark, i) => {
            let marker = new google.maps.Marker({
                position: mark.location,
                zoom: 3,
                clusterSize: 30,
                gridSize: 20,
                title: mark.title,
                id: mark.id,
                length: mark.length,
            });
            
            let infowindow = new google.maps.InfoWindow({
                content: mark.content,
            });

            marker.addListener('mouseover', () => this.handleMousePinMouseover(marker, infowindow));
            marker.addListener('mouseout', () => this.handleMousePinMouseout(marker, infowindow));
            marker.addListener('mouseup', () => this.props.handlepinclick(mark.id));
            marker.addListener('dblclick', () => this.eventHovered(marker, infowindow));
            marker.addListener('tilt_changed', () => this.eventMouseout(infowindow));
            google.maps.event.addListener(map, 'click', function() { infowindow.close(); });            
            return marker;
        });

        this.setState({ markers: markers });
    }




    eventMouseout(infowindow) { infowindow.close(); }
    eventHovered(marker, infowindow) { infowindow.open(map, marker); }

    handleMousePinMouseover(marker, infowindow) {
        infowindow.open(map, marker);
        this.props.sethooveredpinid(marker.id);
    }

    handleMousePinMouseout(marker, infowindow) {
        infowindow.close();
        this.props.sethooveredpinid('');
    }





    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.hoveringid !== nextProps.hoveringid
            || this.props.visible !== nextProps.visible
            || this.props.data !== nextProps.data
            || this.state.fitToBounds || nextState.fitToBounds) {
            return true;
        } else {
            return false;
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.visible !== nextProps.visible) {
            this.updateMarkers(nextProps.visible);
        }
    }



    componentWillReceiveProps(nextProps) {
        let currentMarkId = this.props.hoveringid;
        let newMarkId = nextProps.hoveringid;

        let showCluster = false;

        if (newMarkId !== currentMarkId && '' !== newMarkId) {
            var clusters = markerCluster.getClusters();
            for (let i = 0; i < clusters.length; i++) {
                for( var j=0; j < clusters[i].markers_.length; j++){
                    if (clusters[i].markers_[j] !== '' && clusters[i].markers_[j].id === newMarkId && null === clusters[i].markers_[j].getMap()) {
                        google.maps.event.trigger(markerCluster, 'mouseover', clusters[i]);
                        showCluster = true;
                        break;
                    }
                }
            }
        }

        if ((newMarkId === '') || (newMarkId !== currentMarkId && false === showCluster)) {
            var clusters = markerCluster.getClusters();
            for (let i = 0; i < clusters.length; i++) {
                for( var j=0; j < clusters[i].markers_.length; j++){
                    if ('' !== clusters[i].markers_[j] && clusters[i].markers_[j].id === currentMarkId && null === clusters[i].markers_[j].getMap()) {
                        infoWindowBig.close();
                        break;
                    }
                }
            }
        }

        if (('' === newMarkId && newMarkId !== currentMarkId) || (newMarkId !== currentMarkId && true === showCluster) || (newMarkId !== currentMarkId && false === showCluster && newMarkId !== '')) {
            let mark = this.state.markers.filter(function(mark) { return mark.id == currentMarkId });
            google.maps.event.trigger(mark[0], 'tilt_changed');
        }

        if ( newMarkId !== currentMarkId && '' !== newMarkId && false === showCluster) {
            let mark = this.state.markers.filter(function(mark) { return mark.id == newMarkId });
            google.maps.event.trigger(mark[0], 'dblclick');
        }
    }

    updateMarkers(data) {
        let markers = [];
        bounds = new google.maps.LatLngBounds();
        for (let i=0; i < this.state.markers.length; i++) {
            let curMarker = this.state.markers[i];
            let foundMarker = false;
            for (let k=0; k < data.length; k++) {
                if (data[k].id === curMarker.id && true !== curMarker.getVisible) {
                    curMarker.setVisible(true);
                    foundMarker = true;
                    bounds.extend(curMarker.getPosition());
                    break;
                }
            }

            if (!foundMarker && curMarker.getVisible() !== false) {
                curMarker.setVisible(false);
            }
            markers.push(curMarker);
        }

        if (markers !== this.state.markers) {
            this.setState({ markers: markers });
            markerCluster.repaint();

            if (this.state.fitToBounds) {
                map.setCenter(bounds.getCenter());
                map.fitBounds(bounds);
            }
        }
        this.setState({ fitToBounds: true });
    }

    zoomInMap () {
        map.setZoom(map.getZoom() + 2);
        this.updateBoundsChange();
    }
    zoomOutMap () {
        map.setZoom(map.getZoom() - 2);
        this.updateBoundsChange();
    }

    render () {
        return (
            <div>
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