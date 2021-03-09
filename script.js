mapboxgl.accessToken = 'pk.eyJ1Ijoia29sYWhyIiwiYSI6ImNra3p5dGZiYjBtdnEyd3FuaG1sbGk1NmoifQ.alWaywx7j6vE1zvsKS0MQQ';

function arcDraw(origin, dest) { //this will be used to draw individual arcs that connect the investors to the main city onClick
  var route = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [origin, dest]
        }
      }
    ]
  };

  // Calculate the distance in kilometers between route start/end point.
  var lineDistance = turf.length(route.features[0]);
 
  var arc = [];
 
  // Number of steps to use in the arc and animation, more steps means
  // a smoother arc and animation, but too many steps will result in a
  // low frame rate
  var steps = 500;
 
  // Draw an arc between the `origin` & `destination` of the two points
  for (var i = 0; i < lineDistance; i += lineDistance / steps) {
    var segment = turf.along(route.features[0], i);
    arc.push(segment.geometry.coordinates);
  }
 
  // Update the route with calculated arc coordinates
  route.features[0].geometry.coordinates = arc;

  return route;
}

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/kolahr/ckl19ggq2094y18tcbn0r9699',
  center: [2.8168823755547323, 12.884638460813202],
  zoom: 3.5
});

map.on('click', function(e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['vaporware-cities-investors', 'cities'] // replace this with the name of the layer
    });
  
    if (!features.length) {
      return;
    }
  
    var feature = features[0];
    var connections = new Array();
  
    var popup = new mapboxgl.Popup({ offset: [0, -15] })
      .setLngLat(feature.geometry.coordinates)
      .setHTML('<h3>' + feature.properties.Title + '</h3><p>' + feature.properties[ 'Business Type' ] + '</p><p>' + feature.properties.City + '</p>')
      .addTo(map);

    d3.csv('/Vaporware Cities Investors.csv')
      .then(function(data) {
        for (var i = 0; i < data.length; i++) {
          console.log("does " + feature.properties.Title + " equal " + data[i].City);
          if (data[i].City.includes(feature.properties.Title)) {
            console.log("yes! " + data[i].Title);
            connections.push(data[i].Title);
          }
        }

        console.log("array: " + connections);
      })
      .catch(function(error, rows){
        console.log(rows);
      })
});