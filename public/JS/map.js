// console.log(mapToken); Arrived from ejs file

// console.log(listing);
// console.log(listing.geometry); //arrived from ejs file parListing

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12",
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

//Adding marker
// const marker = new mapboxgl.Marker()
// .setLngLat(listing.geometry.coordinates)
// .addTo(map);

// Adding pop up to marker
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup().setHTML(
      `<h4>${listing.location + ", " + listing.country}</h4>
      <p>Exact Location will be provided after booking</p>`
    )
  )
  .addTo(map);
