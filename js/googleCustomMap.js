function initMap() {
    // get all locations and make array from datasets
  var locations = document.querySelectorAll('[id^="mapLocation"]');

  // fix this. change latLng into floats
  var mapMarker = [];
  var infoContent = [];
  var mapAddress = [];
  var markers = [];

  // loop through locations and set dataset values
  for (var i = 0; i < locations.length; i++) {
    markers.push({});
    if (locations[i].dataset.mapmarker) {
      markers[i].iconImage = locations[i].dataset.mapmarker;
    }
    if (locations[i].dataset.infocontent) {
      markers[i].content = locations[i].dataset.infocontent;
    }
    if (locations[i].dataset.mapaddress) {
      markers[i].address = locations[i].dataset.mapaddress;
      markers[i].coords = '';
    }
  }

  // set zoom distance
  var mapZoom = Number(document.querySelector('[data-mapzoom]').dataset.mapzoom);

  // set default values for map styles
  var mapStyler = document.getElementById('map').dataset;
  if (!mapStyler.mapcolor) {
    mapStyler.mapcolor = "#ebe9e5";
  }
  if (!mapStyler.textstroke) {
    mapStyler.textstroke = "#ffffff";
  }
  if (!mapStyler.textfill) {
    mapStyler.textfill = "#000000";
  }
  if (!mapStyler.roadcolor) {
    mapStyler.roadcolor = "#fbe18b";
  }
  if (!mapStyler.watercolor) {
    mapStyler.watercolor = "#aadaff";
  }

  // set default values for map
  var options = {
    zoom: mapZoom,
    styles: [{
        elementType: 'geometry',
        stylers: [{
          color: mapStyler.mapcolor
        }]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{
          color: mapStyler.textstroke
        }]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{
          color: mapStyler.textfill
        }]
      },    
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{
          color: mapStyler.roadcolor
        }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          color: mapStyler.watercolor
        }]
      },
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{
          visibility: "off"
        }]
      },
      {
        featureType: "poi",
        stylers: [{
          visibility: "off"
        }]
      }
    ]
  };

  // create map
  var map = new google.maps.Map(document.getElementById('map'), options);

  // Add all markers
  for (j = 0; j < markers.length; j++) {
    addMarker(markers[j]);
  }

  // if there is an address, create marker from address
  function addMarker(props) {
    if (props.address) {

      var geocoder = new google.maps.Geocoder();
      geocodeAddress(geocoder, map, props.address, props);
    } 
  }


  // convert addresses into lat long
  function geocodeAddress(geocoder, resultsMap, address, props) {
    var latlngAddress = address;
    geocoder.geocode({
      'address': latlngAddress
    }, function(results, status) {
      if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);

        // create new marker
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });

        // check for and set custom icon
        if (props.iconImage) {
          // set icon image
          marker.setIcon(props.iconImage);
        }

        //check for and set modal window content
        if (props.content) {
          // create new modal window
          var infoWindow = new google.maps.InfoWindow({
            // set contents
            content: props.content
          });

          // add click event listener
          marker.addListener('click', function() {
            infoWindow.open(map, marker);
          });
        }

        // set marker coords
        props.coords = results[0].geometry.location;
        return;
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
}