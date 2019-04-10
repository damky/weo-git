// get all locations and make array from datasets
var locations = document.querySelectorAll('[id^="mapLocation"]');

// fix this. change latLng into floats
var locCoords = [];
var mapMarker = [];
var infoContent = [];
var mapAddress = [];
var markers = [];
var center;

for (var i = 0; i < locations.length; i++) {
  // locCoords.push(JSON.parse(locations[i].dataset.latlng));
  markers.push({});

  if (locations[i].dataset.latlng) {
    markers[i].coords = JSON.parse(locations[i].dataset.latlng);
  }
  if (locations[i].dataset.mapmarker) {
    markers[i].iconImage = locations[i].dataset.mapmarker;
  }
  if (locations[i].dataset.infocontent) {
    markers[i].content = locations[i].dataset.infocontent;
  }
  if (locations[i].dataset.mapaddress) {
    markers[i].address = locations[i].dataset.mapaddress;
  }
  if (locations[i].dataset.lat && locations[i].dataset.lng) {
    markers[i].coords = JSON.parse('{"lat":' + locations[i].dataset.lat + ', "lng":' + locations[i].dataset.lng + '}');
  }
}



var mapStyler = document.querySelector('[data-mapstyler]').dataset.mapstyler.split(',');
var mapZoom = document.querySelector('[data-mapzoom]').dataset.mapzoom;
var options = {
  zoom: mapZoom,
  center: markers[0].coords,
  styles: [{
      elementType: 'geometry',
      stylers: [{
        color: mapStyler[0]
      }]
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [{
        color: mapStyler[1]
      }]
    },
    {
      elementType: 'labels.text.fill',
      stylers: [{
        color: mapStyler[2]
      }]
    },    
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{
        color: mapStyler[3]
      }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{
        color: mapStyler[4]
      }]
    },
  ]

};


function initMap() {

  var map = new google.maps.Map(document.getElementById('map'), options);
  var marker;

  // Add all markers
  for (j = 0; j < markers.length; j++) {
    window.setTimeout(addMarker(markers[j]), j * 400);
  }


  function addMarker(props) {
    if (props.coords) {

     marker = new google.maps.Marker({
        position: props.coords,
        map: map,
        animation: google.maps.Animation.DROP
      });
    } else {
        var geocoder = new google.maps.Geocoder();
        geocodeAddress(geocoder, map);
    } 


    // check for custom icon
    if (props.iconImage) {
      // set icon image
      marker.setIcon(props.iconImage);
    }

    //check content
    if (props.content) {
      var infoWindow = new google.maps.InfoWindow({
        content: props.content
      });

      marker.addListener('click', function() {
        infoWindow.open(map, marker);
      });

    }
  }


  // convert addresses into lat long
  function geocodeAddress(geocoder, resultsMap) {
    var latlngAddress = markers[j].address;
    geocoder.geocode({
      'address': latlngAddress
    }, function(results, status) {
      if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }

    });
  }




}