//STUDIO
console.log ('STUDIO LOADED V1.0');

//////////////
// PARALLAX //
//////////////

// HERO
initImageParallax({
  containerSelector: '.hero_bg-img_wrapper',
  imageSelector: '.hero_secondary_details',
  yPercent: 10
});

// CALL OUT
initImageParallax({
  containerSelector: '.call-out_visual',
  imageSelector: '.call-out_visual_img',
  yPercent: 10
});

// CASES
initImageParallax({
  containerSelector: '.cases_card',
  imageSelector: '.cases_img',
  yPercent: 10
});