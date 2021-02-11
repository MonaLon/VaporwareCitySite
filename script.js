mapboxgl.accessToken = 'pk.eyJ1Ijoia29sYWhyIiwiYSI6ImNra3p5dGZiYjBtdnEyd3FuaG1sbGk1NmoifQ.alWaywx7j6vE1zvsKS0MQQ';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/kolahr/ckl19ggq2094y18tcbn0r9699',
  center: [2.8168823755547323, 12.884638460813202],
  zoom: 3.5
});

map.on('click', function(e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['cities'] // replace this with the name of the layer
    });
  
    if (!features.length) {
      return;
    }
  
    var feature = features[0];
  
    var popup = new mapboxgl.Popup({ offset: [0, -15] })
      .setLngLat(feature.geometry.coordinates)
      .setHTML('<h3>' + feature.properties.Title + '</h3><p>' + feature.properties[ 'Business Type' ] + '</p><p>' + feature.properties.City + '</p>')
      .addTo(map);

    d3.csv('/Vaporware Cities.csv')
      .then(function(data) {
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].Title);
        }
      })
      .catch(function(error, rows){
        console.log(rows);
      })
});