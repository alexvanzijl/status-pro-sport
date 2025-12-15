//HOME
console.log ('HOME LOADED V1');

///////////////////
// FEATURED CASE //
///////////////////

function updateHeroContent() {
  const activeSlide = document.querySelector(
    '.hero_bg_container.w-dyn-item.is-active'
  );

  if (!activeSlide) return;

  const titleEl = activeSlide.querySelector('.case_content_loader_title');
  const linkEl  = activeSlide.querySelector('.case_content_loader_link');

  const heroTitle = document.querySelector('.featured-case_title');
  const heroLink  = document.querySelector('.case_timer');
  const textWrap  = document.querySelector('.case_timer_text_wrap');

  // Capture current layout
  const state = Flip.getState(textWrap);

  if (titleEl && heroTitle) {
    heroTitle.textContent = titleEl.textContent;
  }

  if (linkEl && heroLink) {
    heroLink.href = linkEl.getAttribute('href');
  }

  // Animate layout change
  Flip.from(state, {
    duration: 0.5,
    ease: 'power2.out',
    absolute: true
  });
}


document.addEventListener('DOMContentLoaded', () => {
  const firstSlide = document.querySelector(
    '.hero_bg_img_list .w-dyn-item'
  );

  if (firstSlide) {
    firstSlide.classList.add('is-active');
    updateHeroContent();
  }
});

function setActiveSlide(newSlide) {
  document
    .querySelectorAll('.hero_bg_img_list .w-dyn-item')
    .forEach(item => item.classList.remove('is-active'));

  newSlide.classList.add('is-active');
  updateHeroContent();
}

// TIMER //

const slides = Array.from(
  document.querySelectorAll('.hero_bg_container.w-dyn-item')
);

const heroTitle = document.querySelector('.featured-case_title');
const heroLink  = document.querySelector('.case_timer');

const progressBar = document.querySelector('.case_timer_progress');

let currentIndex = 0;
let heroTimeline;

function getNextIndex() {
  return (currentIndex + 1) % slides.length;
}

function activateSlide(index) {
  slides.forEach(slide => slide.classList.remove('is-active'));

  const newSlide = slides[index];
  newSlide.classList.add('is-active');

  updateHeroContent(); // your existing CMS sync function
}

function runHeroCycle() {
  const currentSlide = slides[currentIndex];
  const nextIndex    = getNextIndex();
  const nextSlide    = slides[nextIndex];

  heroTimeline = gsap.timeline({
    onComplete: () => {
      currentIndex = nextIndex;
      runHeroCycle();
    }
  });

  heroTimeline.set(progressBar, { width: '0%' });

// Progress bar fill
heroTimeline.to(progressBar, {
  width: '100%',
  duration: 3,
  ease: 'linear'
});

// Smooth reset before transition
heroTimeline.to(progressBar, {
  width: '0%',
  duration: 1,
  ease: 'power3.out'
}, '+=0.1');

  heroTimeline.to([currentSlide, heroTitle], {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.inOut'
  });

  heroTimeline.call(() => {
    activateSlide(nextIndex);
  });

  heroTimeline.set(nextSlide, {
    opacity: 0,
    scale: 1.2
  });

  heroTimeline.to(nextSlide, {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: 'power3.out'
  }, '<');

  heroTimeline.to(heroTitle, {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.4');
}

const timerWrapper = document.querySelector('.case_timer_wrapper');

if (timerWrapper) {
  timerWrapper.addEventListener('mouseenter', () => {
    heroTimeline?.pause();
  });

  timerWrapper.addEventListener('mouseleave', () => {
    heroTimeline?.resume();
  });
}

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
gsap.utils.toArray(".circle").forEach(circle => {
  const isInner = circle.classList.contains("inner");
  const duration = isInner ? 45 : 60;
  const direction = isInner ? -360 : 360;
  const iconDirection = -direction;

  // Rotate the circle
  gsap.to(circle, {
    rotation: direction,
    duration,
    ease: "none",
    repeat: -1,
    transformOrigin: "50% 50%"
  });

  // Counter-rotate icons inside THIS circle
  gsap.to(circle.querySelectorAll(".dot_icon"), {
    rotation: iconDirection,
    duration,
    ease: "none",
    repeat: -1,
    transformOrigin: "50% 50%",
    overwrite: false   // 🔑 CRITICAL
  });
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