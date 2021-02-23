const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// Check if address is provided, if so then add it to geodata
const addressChecker = async (req) => {
  let givenInfo = "";
  // check if address is provided by user
  if (req.body.spot.address) {
    // if there is address add it to givenInfo string
    givenInfo = `${req.body.spot.title}, ${req.body.spot.address}, ${req.body.spot.location}`;
  } else {
    // if there is no address skip it in givenInfo string
    givenInfo = `${req.body.spot.title}, ${req.body.spot.location}`;
  }

  // geocode givenInfo location and limit response to 1 location
  return await geocoder
    .forwardGeocode({
      query: givenInfo,
      limit: 1,
    })
    .send();
};

module.exports = addressChecker;
