//HOME
console.log ('HOME LOADED V2.1');

////////////////////
// HERO INTRO ANI //
////////////////////

// Shared state (important)
let heroSplits = [];
let heroWords = [];

/**
 * Prepare hero titles:
 * - Split text
 * - Set initial hidden state
 * - Run ASAP (before loader finishes)
 */
function prepareHomeHeroIntro() {
  const smallTitles = document.querySelectorAll('.hero_titles_small');
  const largeTitles = document.querySelectorAll('.hero_titles_large');

  if (!smallTitles.length && !largeTitles.length) return;

  heroSplits = [];
  heroWords = [];

  smallTitles.forEach(el => {
    const split = new SplitText(el, { type: 'words' });
    heroSplits.push(split);
    heroWords.push(...split.words);
  });

  largeTitles.forEach(el => {
    const split = new SplitText(el, { type: 'words' });
    heroSplits.push(split);
    heroWords.push(...split.words);
  });

  // 🔑 Initial hidden state (NO animation yet)
  gsap.set(heroWords, {
    yPercent: 100
  });
}

/**
 * Play hero intro animation
 * - Triggered after loader completes
 */
function playHomeHeroIntro() {
  if (!heroWords.length) return;

  const tl = gsap.timeline({
    defaults: {
      ease: 'power3.out',
      duration: 0.8
    }
  });

  tl.to(heroWords, {
    yPercent: 0,
    stagger: 0.06
  });

  // Cleanup: revert DOM back to normal
  tl.add(() => {
    heroSplits.forEach(split => split.revert());
  });
}

// 1️⃣ Prepare immediately (critical to avoid FOUC)
prepareHomeHeroIntro();

// 2️⃣ Play after loader finishes
window.addEventListener('loaderComplete', () => {
  playHomeHeroIntro();
});


////////////////////////////
// GENERIC CASE VIEWER //
////////////////////////////

function createCaseViewer(config) {
  const slides = Array.from(document.querySelectorAll(config.slides));
  if (!slides.length) return;

  const titleEl     = document.querySelector(config.titleTarget);
  const linkEl      = document.querySelector(config.linkTarget);
  const textWrap    = document.querySelector(config.textWrap);
  const progressBar = document.querySelector(config.progressBar);
  const hoverWrap   = document.querySelector(config.hoverPause);

  let currentIndex = 0;
  let timeline;

  function updateContent() {
    const activeSlide = slides[currentIndex];
    if (!activeSlide) return;

    const loaderTitle = activeSlide.querySelector('.case_content_loader_title');
    const loaderLink  = activeSlide.querySelector('.case_content_loader_link');

    const state = Flip.getState(textWrap);

    if (loaderTitle && titleEl) {
      titleEl.textContent = loaderTitle.textContent;
    }

    if (loaderLink && linkEl) {
      linkEl.href = loaderLink.getAttribute('href');
    }

    Flip.from(state, {
      duration: 0.5,
      ease: 'power2.out',
      absolute: true
    });
  }

  function activateSlide(index) {
    slides.forEach(slide => slide.classList.remove('is-active'));
    slides[index].classList.add('is-active');
    updateContent();
  }

  function nextIndex() {
    return (currentIndex + 1) % slides.length;
  }

  function runCycle() {
    const next = nextIndex();

    timeline = gsap.timeline({
      onComplete: () => {
        currentIndex = next;
        runCycle();
      }
    });

    timeline.set(progressBar, { width: '0%' });

    timeline.to(progressBar, {
      width: '100%',
      duration: config.duration || 8,
      ease: 'linear'
    });

    timeline.to(progressBar, {
      width: '0%',
      duration: 1,
      ease: 'power3.out'
    }, '+=0.1');

    timeline.to(slides[currentIndex], {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    });

    timeline.call(() => activateSlide(next));

    timeline.fromTo(
      slides[next],
      { opacity: 0, scale: 1.2 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
    );
  }

  // Init
  slides[0].classList.add('is-active');
  updateContent();
  runCycle();

  if (hoverWrap) {
    hoverWrap.addEventListener('mouseenter', () => timeline.pause());
    hoverWrap.addEventListener('mouseleave', () => timeline.resume());
  }
}

// HERO INSTANCE

document.addEventListener('DOMContentLoaded', () => {
  createCaseViewer({
    slides: '.hero_bg_container.w-dyn-item',
    titleTarget: '.featured-case_title',
    linkTarget: '.case_timer',
    textWrap: '.case_timer_text_wrap',
    progressBar: '.case_timer_progress',
    hoverPause: '.case_timer_wrapper',
    duration: 8
  });
});

// ATHLETES INSTANCE

createCaseViewer({
  slides: '.athlete_case_viewer .athlete_bg_container.w-dyn-item',
  titleTarget: '.athlete_case_viewer .featured-case_title',
  linkTarget: '.athlete_case_viewer .case_timer',
  textWrap: '.athlete_case_viewer .case_timer_text_wrap',
  progressBar: '.athlete_case_viewer .case_timer_progress',
  hoverPause: '.athlete_case_viewer .case_timer_wrapper',
  duration: 10
});

// HERO PARALAX //

document.querySelectorAll('.hero_bg_container').forEach(container => {
  const img = container.querySelector('.hero_bg_img');
  if (!img) return;

  gsap.to(img, {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
});

// SERVICE BLOCKS
window.addEventListener('load', () => ScrollTrigger.refresh());

ScrollTrigger.create({
  trigger: '.why_services',
  start: 'top top+=32',

  end: () => {
    const grid  = document.querySelector('.service_block_grid');
    const block = document.querySelector('.service_block_360_pin');
    const topOffset = 0;

    const dist = grid.offsetHeight - block.offsetHeight - topOffset;
    return `+=${Math.max(0, dist)}`;
  },

  pin: '.service_block_360_pin',
  pinSpacing: false,
  anticipatePin: 1,
  //markers: true
});

// SERVICE VISUAL
gsap.set(".circle", {
  transformOrigin: "50% 50%",
  overwrite: false   // ⬅️ VERY important
});

// Outer clockwise
gsap.to(".circle.outer", {
  rotation: 360,
  duration: 60,
  ease: "none",
  repeat: -1
});

// Inner counter-clockwise
gsap.to(".circle.inner", {
  rotation: -360,
  duration: 45,
  ease: "none",
  repeat: -1
});

//// ABOUT ANIMATIONS
//new SplitType(".about_story_intro", {
//  types: "lines, words, chars",
//  tagName: "span"
//});
//
//$(".word").wrap("<div class='line_mask'></div>");
//
//let tl_about_story = gsap.timeline({ paused: true });
//tl_about_story.from(".about_story_intro .word", {
//  translateY: "150%",
//  //rotationZ: "-30deg",
//  stagger: { each: 0.01 },
//  ease: "power3.out",
//  delay: 0.5,
//  duration: 0.5
//});
//
//// CONTACT ANIMATIONS
//// ...TXT
//new SplitType(".contact_title", {
//  types: "lines, words, chars",
//  tagName: "span"
//});
//
//$(".contact_title .word").wrap("<div class='line_mask'></div>");
//
//let tl_contact = gsap.timeline({
//  scrollTrigger: {
//    trigger: ".section_contact",
//    start: "top 50%",
//    end: "bottom top",
//    toggleActions: "restart reverse restart reverse"
//  }
//});
//tl_contact.from(".contact_title .word", {
//  translateY: "150%",
//  //rotationZ: "-30deg",
//  stagger: { each: 0.025 },
//  ease: "power3.out",
//  duration: 0.5
//});
//
//$("#button_story").on("click", function () {
//  setTimeout(() => {
//    console.log("refresh scroll trigger after page height change");
//    ScrollTrigger.refresh();
//  }, 1000);
//});

//////////////////////////////////////////////
/////////////////// CTA ANI //////////////////
//////////////////////////////////////////////

new SplitType(".grid_cta_title", {
  types: "lines, words",
  tagName: "span"
});

$(".grid_cta_title .line").wrap("<div class='line_mask'></div>");

$(".grid_cta").each(function (index) {
  let ctaLineOne = $(this).find(".grid_cta_title.is-1 .word");
  let ctaLineTwo = $(this).find(".grid_cta_title.is-2 .word");
  // Timeline
  let tl_grid_cta = gsap.timeline({ paused: true });
  tl_grid_cta.to(ctaLineOne, {
    translateY: "-100%",
    stagger: { each: 0.1 },
    ease: "power3.InOut",
    duration: 0.3
  });
  tl_grid_cta.from(
    ctaLineTwo,
    {
      translateY: "100%",
      stagger: { each: 0.1 },
      ease: "power3.InOut",
      duration: 0.3
    },
    0.1
  );
  $(this).on("mouseenter", function () {
    tl_grid_cta.restart();
  });
  $(this).on("mouseleave", function () {
    tl_grid_cta.reverse();
  });
});

//////////////////////////////////////////////
//////////////////// ABOUT ///////////////////
//////////////////////////////////////////////

// TITLE LARGE
new SplitType(".about_title_large", {
  types: "lines, words",
  tagName: "span"
});

$(".about_title_large .word").wrap("<div class='line_mask'></div>");

let tl_about_title_large = gsap.timeline({
  scrollTrigger: {
    trigger: ".about_intro",
    start: "top 50%",
    end: "bottom top"
  }
});
tl_about_title_large.from(".about_title_large .word", {
  translateY: "150%",
  //rotationZ: "-30deg",
  stagger: { each: 0.025 },
  ease: "power3.out",
  duration: 0.5
});

// TITLE SMALL
new SplitType(".about_title_small", {
  types: "lines, words",
  tagName: "span"
});

$(".about_title_small .word").wrap("<div class='line_mask'></div>");

let tl_about_title_small = gsap.timeline({
  scrollTrigger: {
    trigger: ".about_pilars",
    start: "top 50%",
    end: "bottom top"
  }
});
tl_about_title_small.from(".about_title_small .word", {
  translateY: "150%",
  //rotationZ: "-30deg",
  stagger: { each: 0.025 },
  ease: "power3.out",
  duration: 0.5
});

// SPLINE BALL - IN
let tl_spline_ball = gsap.timeline({
  scrollTrigger: {
    trigger: ".about_intro",
    scrub: 1,
    start: "top bottom",
    end: "bottom bottom"
  }
});
tl_spline_ball.from(".spline_wrapper", {
  opacity: 0
});

// SPLINE BALL - OUT
let tl_spline_ball_out = gsap.timeline({
  scrollTrigger: {
    trigger: ".about_pilars",
    scrub: 1,
    start: "top bottom",
    end: "bottom bottom"
  }
});
tl_spline_ball_out.to(".spline_wrapper", {
  opacity: 0
});``