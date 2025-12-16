//HOME
console.log ('HOME LOADED V1');

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

  const titleTarget = document.querySelector(config.titleTarget);
  const linkTarget  = document.querySelector(config.linkTarget);
  const textWrap    = document.querySelector(config.textWrap);
  const progressBar = document.querySelector(config.progressBar);
  const hoverPause  = document.querySelector(config.hoverPause);

  let currentIndex = 0;
  let timeline;

  function updateContent(slide) {
    const titleEl = slide.querySelector('.case_content_loader_title');
    const linkEl  = slide.querySelector('.case_content_loader_link');

    if (!titleEl || !linkEl || !titleTarget || !linkTarget) return;

    const state = textWrap ? Flip.getState(textWrap) : null;

    titleTarget.textContent = titleEl.textContent;
    linkTarget.href = linkEl.href;

    if (state) {
      Flip.from(state, {
        duration: 0.5,
        ease: 'power2.out',
        absolute: true
      });
    }
  }

  function activate(index) {
    slides.forEach(s => s.classList.remove('is-active'));
    const slide = slides[index];
    slide.classList.add('is-active');
    updateContent(slide);
  }

  function run() {
    const currentSlide = slides[currentIndex];
    const nextIndex = (currentIndex + 1) % slides.length;
    const nextSlide = slides[nextIndex];

    timeline = gsap.timeline({
      onComplete: () => {
        currentIndex = nextIndex;
        run();
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

    timeline.to([currentSlide, titleTarget], {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    });

    timeline.call(() => activate(nextIndex));

    timeline.set(nextSlide, {
      opacity: 0,
      scale: 1.2
    });

    timeline.to(nextSlide, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power3.out'
    }, '<');

    timeline.to(titleTarget, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.4');
  }

  // Init
  slides[0].classList.add('is-active');
  updateContent(slides[0]);
  run();

  if (hoverPause) {
    hoverPause.addEventListener('mouseenter', () => timeline.pause());
    hoverPause.addEventListener('mouseleave', () => timeline.resume());
  }
}

///////////////////
// HERO INSTANCE //
///////////////////

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

document.addEventListener('DOMContentLoaded', () => {
  slides[0].classList.add('is-active');
  updateHeroContent();
  runHeroCycle();
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

//////////////
//// LOADER //
//////////////
//
//// Vars
//
//let loaderDuration = 2;
//
////let counter = {
////  value: 0
////};
//
//// If not a first time visit in this tab
//if (sessionStorage.getItem("visited") !== null) {
//  loaderDuration = 1;
////  counter = {
////    value: 75
////  };
//}
//sessionStorage.setItem("visited", "true");
//
////function updateLoaderText() {
////  let progress = Math.round(counter.value);
////  $(".loader_number").text(progress);
////}
//
//let tl_loader = gsap.timeline({ onComplete: endLoaderAnimation });
//tl_loader.to(counter, {
//  value: 100,
//  onUpdate: updateLoaderText,
//  ease: CustomEase.create("custom", customEase),
//  duration: loaderDuration
//});
//
//function endLoaderAnimation() {
//  $(".trigger").click();
//  tl_title.resume();
//  //enable rest of the website after load
//  const element = document.querySelector(".website.home");
//  element.style.overflow = "visible";
//  //element.style.height = "auto";
//}
//
//tl_loader.from(
//  ".logo_loader_progress",
//  {
//    scaleX: "0",
//    ease: CustomEase.create("custom", customEase),
//    duration: loaderDuration
//  },
//  0
//);
//tl_loader.to(
//  ".hero",
//  {
//    opacity: "100",
//    ease: CustomEase.create("custom", customEase),
//    duration: loaderDuration
//  },
//  0
//);

// HERO INTRO
// Prevent animation glitch on page load
//gsap.set(".website", { autoAlpha: 1 });
//
//let tl_title = gsap.timeline({ paused: true });
//tl_title.from(
//  ".hero",
//  {
//    scale: 0.1,
//    ease: "power3.inOut",
//    duration: 1
//  },
//  ">0.5"
//);
//tl_title.from(
//  ".hero-txt_line",
//  {
//    translateY: "100%",
//    rotationZ: "30deg",
//    stagger: { each: 0.05 },
//    ease: "power3.out",
//    //delay: 0.5,
//    duration: 0.5
//  },
//  1
//);
//tl_title.from(
//  ".hero_section_but",
//  {
//    borderColor: "rgba(0, 0, 0, 0)",
//    duration: 0.5
//  },
//  1.5
//);
//tl_title.from(
//  ".hero_bottom_wrapper",
//  {
//    opacity: "0",
//    duration: 1
//  },
//  1
//);
//tl_title.from(
//  ".hero_bg_img_overlay",
//  {
//    opacity: "0",
//    duration: 1
//  },
//  1
//);
//tl_title.from(
//  ".nav",
//  {
//    opacity: "0",
//    duration: 1
//  },
//  1
//);
//tl_title.from(
//  ".logo_loader_part",
//  {
//    translateY: "100%",
//    stagger: { each: 0.05 },
//    ease: "power3.out",
//    //delay: 0.5,
//    duration: 0.5
//  },
//  1
//);

// ABOUT ANIMATIONS
new SplitType(".about_story_intro", {
  types: "lines, words, chars",
  tagName: "span"
});

$(".word").wrap("<div class='line_mask'></div>");

let tl_about_story = gsap.timeline({ paused: true });
tl_about_story.from(".about_story_intro .word", {
  translateY: "150%",
  //rotationZ: "-30deg",
  stagger: { each: 0.01 },
  ease: "power3.out",
  delay: 0.5,
  duration: 0.5
});

// CONTACT ANIMATIONS
// ...TXT
new SplitType(".contact_title", {
  types: "lines, words, chars",
  tagName: "span"
});

$(".contact_title .word").wrap("<div class='line_mask'></div>");

let tl_contact = gsap.timeline({
  scrollTrigger: {
    trigger: ".section_contact",
    start: "top 50%",
    end: "bottom top",
    toggleActions: "restart reverse restart reverse"
  }
});
tl_contact.from(".contact_title .word", {
  translateY: "150%",
  //rotationZ: "-30deg",
  stagger: { each: 0.025 },
  ease: "power3.out",
  duration: 0.5
});

//...BALL
let tl_contact_ball = gsap.timeline({
  scrollTrigger: {
    trigger: ".section_contact",
    scrub: 1,
    start: "top bottom",
    end: "bottom bottom"
  }
});
tl_contact_ball.from(".ball", {
  translateX: "-150%",
  rotationZ: "-360deg",
  opacity: "0",
  ease: "circ.out"
});

$("#button_story").on("click", function () {
  setTimeout(() => {
    console.log("refresh scroll trigger after page height change");
    ScrollTrigger.refresh();
  }, 1000);
});

//////////////////////////////////////////////
///////////////// UNLOCK CTA /////////////////
//////////////////////////////////////////////

let tl_unlocked = gsap.timeline({ paused: true });

// tl_unlocked.to("input#email", {
//   opacity: "0.5",
//   translateY: "100%",
//   duration: 0.3
// });

tl_unlocked.to(".button_secondary.unlocked", {
  display: "block"
});

tl_unlocked.to(".button_secondary.unlocked", {
  opacity: "0",
  duration: 0.3
});

tl_unlocked.to(".button_secondary.unlocked", {
  autoAlpha: 1,
  delay: 0.5,
  duration: 0.5
});

$(".unlock_form").submit(() => {
  $(".trigger_unlock").click();
  setTimeout(() => {
    console.log("submitted");
    const state = Flip.getState(".button_unlock_wrapper");

    tl_unlocked.play();
    $(".button_unlock_wrapper").addClass("unlocked");

    Flip.from(state, {
      duration: 0.5,
      ease: "power1.inOut"
    });
  }, 1000);
});

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