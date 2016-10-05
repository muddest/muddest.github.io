import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

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

        this.testar = this.testar.bind(this);

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
        $('#plus').click($.proxy(function() { this.zoomInMap(); }, this));
        $('#minus').click($.proxy(function() { this.zoomOutMap(); }, this));

        markerCluster = new MarkerClusterer(map, this.state.markers, {imagePath: '/muddest/assets/images/cluster/m', ignoreHidden: true, zoomOnClick: false});
        google.maps.event.addListener(markerCluster, 'click', function(cluster) {
            var markers = cluster.getMarkers();
            var array = [];
            var num = 0;
            var string = '';
            for (let i = 0; i < markers.length; i++) {
                string += markers[i].title+'<br>';
            }

            //marker.addListener('mouseup', () => this.props.handlepinclick(mark.id));

            infoWindowBig.setContent('<h1>Events</h1><br>'+string);
            infoWindowBig.setPosition(cluster.getCenter());
            infoWindowBig.open(map);
        });

        google.maps.event.addListener(markerCluster, 'mouseover', function(cluster) {
            var markers = cluster.getMarkers();
            var array = [];
            var num = 0;
            var string = '';
            for (let i = 0; i < markers.length; i++) {
                console.log(markers[i].id);
                let reactString = ReactDOMServer.renderToString(<div onClick={() => this.testar()}>YAYAYAY</div>);
                string += reactString+markers[i].title+'<br>';
            }

            infoWindowBig.setContent('<h1>Events</h1><br>'+string);
            infoWindowBig.setPosition(cluster.getCenter());
            infoWindowBig.open(map);
        });
        
        google.maps.event.addListener(map, "click", function(event) { infoWindowBig.close(); });
        this.updateMarkers(this.props.visible);
    }

    testar() {
        alert('HEJ');
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

            marker.addListener('mouseover', () => this.handleMousePinMouseover(marker, infowindow));
            marker.addListener('mouseout', () => this.handleMousePinMouseout(marker, infowindow));

            // Add support to open infobox
            marker.addListener('mouseup', () => this.props.handlepinclick(mark.id));

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

        if (this.props.visible !== nextProps.visible) {
            this.updateMarkers(nextProps.visible);
        }

        let inCluster = false;

        if (newMarkId !== currentMarkId && '' !== newMarkId) {
            var clusters = markerCluster.getClusters();
            for (let i = 0; i < clusters.length; i++) {
                for( var j=0; j < clusters[i].markers_.length; j++){
                    if (clusters[i].markers_[j] !== '' && clusters[i].markers_[j].id === newMarkId && null === clusters[i].markers_[j].getMap()) {
                        google.maps.event.trigger(markerCluster, 'click', clusters[i]);
                        inCluster = true;
                        break;
                    }
                }
            }
        }

        if ((newMarkId === '') || (newMarkId !== currentMarkId && false === inCluster)) {
            var clusters = markerCluster.getClusters();
            for (let i = 0; i < clusters.length; i++) {
                for( var j=0; j < clusters[i].markers_.length; j++){
                    if ('' !== clusters[i].markers_[j] && clusters[i].markers_[j].id === currentMarkId && null === clusters[i].markers_[j].getMap()) {
                        infoWindowBig.close();
                        //inCluster = true;
                        break;
                    }
                }
            }
        }
        if ('' === newMarkId || newMarkId !== currentMarkId) {
            let mark = this.state.markers.filter(function(mark) { return mark.id == currentMarkId });
            google.maps.event.trigger(mark[0], 'dblclick');
        }
        if (newMarkId !== currentMarkId && '' !== newMarkId && false === inCluster) {
            let mark = this.state.markers.filter(function(mark) { return mark.id == newMarkId });
            google.maps.event.trigger(mark[0], 'mousedown');
        }

        
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
                if (data[k].id === curMarker.id && true !== curMarker.getVisible) {
                    curMarker.setVisible(true);
                    foundMarker = true;
                    bounds.extend(curMarker.getPosition());
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
            this.setState({ markers: markers });
            map.fitBounds(bounds);
            markerCluster.repaint();
        }
    }

    zoomInMap () { 
        map.setZoom(map.getZoom() + 1);
    }
    zoomOutMap () { map.setZoom(map.getZoom() - 1); }

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