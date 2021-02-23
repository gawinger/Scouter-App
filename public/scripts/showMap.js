// configure mapbox

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
  center: spot.geometry.coordinates, // starting position [lng, lat]
  zoom: 13, // starting zoom
});

const marker = new mapboxgl.Marker().setLngLat(spot.geometry.coordinates).addTo(map);
