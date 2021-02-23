// cluster map configuration

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: [19.321315880091586, 49.990050613630636],
  zoom: 7.5,
});

map.on("load", function () {
  map.addSource("spots", {
    type: "geojson",
    data: spots,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "spots",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": ["step", ["get", "point_count"], "#82d394", 5, "#609e6d", 10, "#386641"],
      "circle-radius": ["step", ["get", "point_count"], 15, 5, 20, 10, 25],
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "spots",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "spots",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#6a994e",
      "circle-radius": 7,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#ebebeb",
    },
  });

  // inspect a cluster on click
  map.on("click", "clusters", function (e) {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ["clusters"],
    });
    const clusterId = features[0].properties.cluster_id;
    map.getSource("spots").getClusterExpansionZoom(clusterId, function (err, zoom) {
      if (err) return;

      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom,
      });
    });
  });

  // When a click event occurs on a feature in
  // the unclustered-point layer, open a popup at
  // the location of the feature, with
  // description HTML from its properties.
  map.on("click", "unclustered-point", function (e) {
    const coordinates = e.features[0].geometry.coordinates.slice();
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup({
      anchor: "center",
      closeOnMove: true,
      closeButton: false,
    })
      .setLngLat(coordinates)
      //
      .setHTML(`<h3>${e.features[0].properties.mapPointText}</h3>`)
      .addTo(map);
  });

  map.on("mouseenter", "clusters", function () {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", function () {
    map.getCanvas().style.cursor = "";
  });
});
