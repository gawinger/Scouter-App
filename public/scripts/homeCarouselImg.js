// get random image from all images connected with spots
const randomImg = (spots) => {
  // if no spots are found reload page to prevent errors
  if (!spots) {
    return window.location.reload(true);
  }
  const random = Math.floor(Math.random() * spots.length);
  // if spot is found and has images return its url 
  if (spots[random].images[0] && spots[random].images.length) {
    return spots[random].images[0].url;
  } else {
    // else run this function again
    randomImg();
  }
};

// set source of image to random image returned by randomImg()
const images = document.querySelectorAll("#home-carousel-img");
images.forEach((img) => {
  img.src = `${randomImg(spots.features)}`;
});
