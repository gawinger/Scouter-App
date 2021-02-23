// rating count functionality

module.exports.ratingCounter = (spot) => {
  // Count sum and number of all ratings
  spot.rateNumber = 0;
  let allRates = 0;
  spot.reviews.forEach((rev) => {
    spot.rateNumber += 1;
    allRates += rev.rating;
  });
  // Count mean
  spot.meanRate = allRates / spot.rateNumber;
  // set spot rating to mean Rate and round it
  spot.rating = Math.round(spot.meanRate);
};

module.exports.ratingCounterDelete = (spot, review) => {
  // Remove one number of ratings
  spot.rateNumber -= 1;
  // if there is no rates set its rating to 0
  if (spot.rateNumber === 0) {
    spot.rating = 0;
    return;
  }
  // count rating value
  let allRates = 0;
  spot.reviews.forEach((rev) => {
    allRates += rev.rating;
  });
  // From all ratings remove deleted review value
  spot.meanRate = (allRates - review.rating) / spot.rateNumber;
  // set spot rating to mean rate and round it
  spot.rating = Math.round(spot.meanRate);
};
