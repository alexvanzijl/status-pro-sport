//PDP
console.log ('PDP LOADED V1.0');

//////////////
// PARALLAX //
//////////////

// PRODUCT IMGS
initImageParallax({
  containerSelector: '.pdp_imgs_container',
  imageSelector: '.pdp_img',
  yPercent: 10
});

////////////////
// STICKY TXT //
////////////////
ScrollTrigger.matchMedia({

  // DESKTOP & TABLET
  "(min-width: 768px)": function () {

    ScrollTrigger.create({
      trigger: '.pdp_body',
      start: 'top top+=32',

      end: () => {
        const grid  = document.querySelector('.pdp_txt_container');
        const block = document.querySelector('.pdp_txt');
        const topOffset = 0;

        if (!grid || !block) return '+=0';

        const dist = grid.offsetHeight - block.offsetHeight - topOffset;
        return `+=${Math.max(0, dist)}`;
      },

      pin: '.pdp_txt',
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