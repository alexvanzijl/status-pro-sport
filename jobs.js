//PROFILE
console.log ('JOBS LOADED V1.0');

//////////////
// PARALLAX //
//////////////

// VISUAL

initImageParallax({
  containerSelector: '.section_visual',
  imageSelector: '.section_visual_img',
  yPercent: 10
});

//////////
// HERO //
//////////

function initJobsHeroParallax() {
  const hero = document.querySelector('.hero_secondary_visual');
  if (!hero) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const front = hero.querySelector('.hero_secondary_visual_front');
  const back = hero.querySelector('.hero_secondary_visual_back');

  if (!front || !back) return;

  // Reset (important for re-inits / Webflow)
  gsap.set([front, back], { yPercent: 0 });

  gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      scroller: smoother?.wrapper || undefined,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  })
  .to(back, {
    yPercent: 10,
    ease: 'none'
  }, 0)
  .to(front, {
    yPercent: -35,
    ease: 'none'
  }, 0);
}

window.addEventListener('DOMContentLoaded', () => {
  initJobsHeroParallax();
});
