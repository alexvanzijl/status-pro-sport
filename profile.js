//PROFILE
console.log ('PROFILE LOADED V1.0');

//////////////
// PARALLAX //
//////////////

// HERO

initImageParallax({
  containerSelector: '.hero_secondary_details_wrapper',
  imageSelector: '.hero_secondary_details',
  yPercent: 10
});

// ADDITIONAL IMGS

initImageParallax({
  containerSelector: '.news_body_img_wrapper',
  imageSelector: '.news_body_img',
  yPercent: 10
});