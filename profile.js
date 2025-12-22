//PROFILE
console.log ('PROFILE LOADED V1.0');

///////////////
// BIO BLOCK //
///////////////

ScrollTrigger.matchMedia({

  // DESKTOP & TABLET
  "(min-width: 768px)": function () {

    ScrollTrigger.create({
      trigger: '.details_body',
      start: 'top top+=32',

      end: () => {
        const grid  = document.querySelector('.details_body_bio');
        const block = document.querySelector('.bio');
        const topOffset = 0;

        if (!grid || !block) return '+=0';

        const dist = grid.offsetHeight - block.offsetHeight - topOffset;
        return `+=${Math.max(0, dist)}`;
      },

      pin: '.bio',
      pinSpacing: false,
      anticipatePin: 1
      // markers: true
    });

  },

  // MOBILE
  "(max-width: 767px)": function () {
    // Intentionally empty
  }
});

///////////////////
// HERO PARALLAX //
///////////////////

initImageParallax({
  containerSelector: '.hero_secondary_details_wrapper',
  imageSelector: '.hero_secondary_details',
  yPercent: 10
});