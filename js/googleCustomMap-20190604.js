/*
 * Dynamically load in google map info based on 'data-' attributes
 * supports multiple pin locations, custom content in pop ups, custom pin icons,
 * custom map colors, removal of other businesses and nearby practices.
 *
============================================================================================
//  Copyright Â© 2011-2019 WEO MEDIA (TouchPoint Communications LLC). All rights reserved.
//   UNAUTHORIZED USE IS STRICTLY PROHIBITED
//   FOR QUESTIONS AND APPROPRIATE LICENSING PLEASE CONTACT WEO MEDIA
//   www.weomedia.com | info@weomedia.com
//
//   Some portions of code (modified and unmodified) have been included from public,
//   or open source, sources and have been indicated as appropriate.
//
//   ***** LIMITATION OF LIABILITY *****
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
//  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
//  PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
//  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
//  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
//  OR OTHER DEALINGS IN THE SOFTWARE.
//   ***********************************
============================================================================================
*/

// get all locations and make array from datasets
var locations = document.querySelectorAll('[id^="mapLocation"]');

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
    markers[i].coords = "";
  }
}

// set zoom distance
var mapZoom = Number(document.querySelector("[data-mapzoom]").dataset.mapzoom);

// set default values for map styles
var mapStyler = document.getElementById("map").dataset;
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
  styles: [
    {
      elementType: "geometry",
      stylers: [
        {
          color: mapStyler.mapcolor
        }
      ]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: mapStyler.textstroke
        }
      ]
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: mapStyler.textfill
        }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: mapStyler.roadcolor
        }
      ]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: mapStyler.watercolor
        }
      ]
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "poi",
      stylers: [
        {
          visibility: "off"
        }
      ]
    }
  ]
};

function initMap() {
  // create map
  var map = new google.maps.Map(document.getElementById("map"), options);

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
    geocoder.geocode(
      {
        address: address
      },
      function(results, status) {
        if (status === "OK") {
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
            marker.addListener("click", function() {
              infoWindow.open(map, marker);
            });
          }

          // set marker coords
          props.coords = results[0].geometry.location;
          return;
        } else {
          console.log(
            "Geocode was not successful for the following reason: " + status
          );
        }
      }
    );
  }
}
// catch a failure to authorize
function gm_authFailure() {
  document.getElementById("map").innerHTML =
    '<iframe width="600px" height="450px" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q=' +
    markers[0].address.replace(/ /g, "+") +
    '&amp;ie=UTF8&amp;&amp;output=embed"></iframe>';
}
