//CORE
console.log ('CORE LOADED V1.3');

///////////////////
// SMOOTH SCROLL //
///////////////////

const smoother = ScrollSmoother.create({
  wrapper: '#smooth-wrapper',
  content: '#smooth-content',
  smooth: 1.1,
  effects: true,
  normalizeScroll: true
});

// Disable on mobile
ScrollSmoother.create({
  smooth: window.innerWidth > 991 ? 1.1 : 0,
});

///////////////////
// GLOBAL LOADER //
///////////////////

unction initPageLoader() {
  const loader = document.querySelector('.loader_container');
  const logo = document.querySelector('.loader_logo');

  if (!loader || !logo) return;

  // Hard reset loader visibility
  gsap.set(loader, {
    autoAlpha: 1,        // opacity + visibility
    pointerEvents: 'all',
    yPercent: 0
  });

  // Force show loader immediately
  gsap.set(loader, {
    autoAlpha: 1,
    yPercent: 0
  });

  // Split text
  const split = new SplitText(logo, {
    type: 'words'
  });

  // Initial state: words 100% below
  gsap.set(split.words, {
    yPercent: 100
  });

  const tl = gsap.timeline({
    defaults: {
      ease: 'power3.out'
    }
  });

  // IN
  tl.to(split.words, {
    yPercent: 0,
    duration: 1,
    stagger: 0.15,
    delay: 1
  });

  // HOLD
  tl.to({}, { duration: .5 });

  // OUT (words go up)
  tl.to(split.words, {
    yPercent: -100,
    duration: 0.5,
    stagger: 0.15,
    ease: 'power3.in'
  });

  // Loader slides up halfway through word-out
  tl.to(loader, {
    yPercent: -100,
    duration: 1,
    ease: 'power3.in'
  }, '-=0.9');

  // Cleanup + signal
  tl.add(() => {
  split.revert();

  gsap.set(loader, {
    autoAlpha: 0,
    pointerEvents: 'none'
  });

  window.dispatchEvent(new Event('loaderComplete'));
});
}

window.addEventListener('DOMContentLoaded', () => {
  initPageLoader();
});
  
//////////////////////////////////////////////
////////////////// TIMEZONES /////////////////
//////////////////////////////////////////////
const $ = window.$;

$(document).ready(function () {
  // datetime in Amsterdam
  let amsterdam_datetime_str = new Date().toLocaleString("en-UK", {
    timeZone: "Europe/Amsterdam",
    hour: "2-digit",
    minute: "2-digit"
  });

  let jakarta_datetime_str = new Date().toLocaleString("en-UK", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit"
  });

  // show timestamps
  document.getElementById(
    "time_amsterdam"
  ).innerHTML = amsterdam_datetime_str.toString();

  document.getElementById(
    "time_jakarta"
  ).innerHTML = jakarta_datetime_str.toString();
});

//////////////////////////////////////////////
/////////////////// CTA ANI //////////////////
//////////////////////////////////////////////

new SplitType(".button_txt", {
  types: "words, chars",
  tagName: "span"
});

$(".button_secondary").each(function (index) {
  let listOne = $(this).find(".button_txt.is-1 .word");
  let listTwo = $(this).find(".button_txt.is-2 .word");
  // Timeline
  let tl = gsap.timeline({ paused: true });
  tl.to(listOne, {
    translateY: "-1.5rem",
    stagger: { each: 0.1 },
    ease: "power3.Out",
    yoyoEase: "power3.In",
    duration: 0.3
  });
  tl.from(
    listTwo,
    {
      translateY: "1.5rem",
      stagger: { each: 0.1 },
      ease: "power3.Out",
      yoyoEase: "power3.In",
      duration: 0.3
    },
    0.1
  );
  $(this).on("mouseenter", function () {
    tl.restart();
  });
  $(this).on("mouseleave", function () {
    tl.reverse();
  });
});

//////////////////////////////////////////////
///////////////// NAVIGATION /////////////////
//////////////////////////////////////////////

let tl_menu = gsap.timeline({ paused: true, onReverseComplete: resetMenu });

tl_menu.to(".menu_wrapper", {
  display: "block"
});
tl_menu.from(
  ".menu_items",
  {
    translateY: "100%",
    ease: "power3.out",
    yoyoEase: "power3.in",
    duration: 0.5
  },
  0
);
tl_menu.from(".menu_item", {
  translateY: "100%",
  stagger: { each: 0.05 },
  ease: "power3.out",
  yoyoEase: "power3.in",
  duration: 0.5
});
tl_menu.from(".nav_close", {
  opacity: 0,
  duration: 0.5
});

$(".button_secondary.menu").on("click", function () {
  tl_menu.play();
});

$(".button_secondary.menu.inversed").on("click", function () {
  tl_menu.reverse();
});

function resetMenu() {
  const element = document.querySelector(".menu_wrapper");
  element.style.display = "none";
}

let tl_menuClick = gsap.timeline({ paused: true });

tl_menuClick.to(".menu_item", {
  translateY: "-100%",
  opacity: 0,
  stagger: { each: 0.05 },
  ease: "power3.in",
  yoyoEase: true,
  duration: 0.5
});

tl_menuClick.to(".menu_item_mask", {
  pointerEvents: "none"
});

$(".menu_item").on("click", function () {
  tl_menuClick.play();
});

//////////////////////////////////////////////
///////////////// PAGE LOADER ////////////////
//////////////////////////////////////////////

window.onload = function () {
  tl_pageTransition.play();
};

let tl_pageTransition = gsap.timeline({ paused: true });

tl_pageTransition.to(".page-loader", {
  opacity: 0,
  duration: 0.5
});

tl_pageTransition.to(".page-transition", {
  translateY: "-100%",
  ease: "power3.inOut",
  duration: 1
});

tl_pageTransition.to(".page-loader", {
  display: "none"
});

//////////////////////////////////////////////
/////////////// PAGE TRANSITION //////////////
//////////////////////////////////////////////

let tl_pageTransitionAlt = gsap.timeline({ paused: true });

tl_pageTransitionAlt.to(".page-transition_alt_bg", {
  autoAlpha: 1,
  duraiton: 0
});

tl_pageTransitionAlt.from(
  ".page-transition_alt_bg",
  {
    translateY: "100%",
    ease: "power3.inOut",
    duration: 1
  },
  0
);

$(".pagetransition_alt").on("click", function () {
  tl_pageTransitionAlt.play();
});

// Delay before link open
$(".pagetransition").click(function (e) {
  e.preventDefault();
  var linkUrl = $(this).attr("href");
  setTimeout(
    function (url) {
      window.location = url;
    },
    1500,
    linkUrl
  );
});

$(".pagetransition_alt").click(function (e) {
  e.preventDefault();
  var linkUrlAlt = $(this).attr("href");
  setTimeout(
    function (url) {
      window.location = url;
    },
    1500,
    linkUrlAlt
  );
});

//////////////////////////////////////////////
/////////////// FOOTER PARALAX ///////////////
//////////////////////////////////////////////

let tl_footer_paralax = gsap.timeline({
  scrollTrigger: {
    trigger: ".footer_wrapper",
    scrub: 1,
    start: "top bottom",
    end: "bottom bottom"
  }
});
tl_footer_paralax.from(".footer", {
  translateY: "-30%"
});

//////////////////////////////////////////////
/////////////// HEADER TXT ANI ///////////////
//////////////////////////////////////////////

 new SplitType(".header_intro", {
   types: "lines",
   tagName: "span"
 });

let tl_header_intro = gsap.timeline({
  scrollTrigger: {
    trigger: ".header_intro",
    start: "top bottom",
    end: "bottom bottom"
  }
});
 tl_header_intro.from(".header_intro .line", {
   translateY: "200%",
   opacity: 0,
   stagger: { each: 0.1 },
   ease: "power3.out",
   duration: 1
});
tl_header_intro.from(".header_intro", {
  translateY: "200%",
  opacity: 0,
  stagger: { each: 0.1 },
  ease: "power3.out",
  duration: 1
});

//////////////////////////////////////////////
//////////////// REFRESH FIXES ///////////////
//////////////////////////////////////////////

//let isResizing = false;
//let isScrolling = false;
//let debounceTimeout;

//$(window).on('resize', function() {
//  if (!isResizing) {
//    isResizing = true;
//    clearTimeout(debounceTimeout);
//    debounceTimeout = setTimeout(function() {
      //console.log('Window resized');
//      if (!isScrolling) {
//        location.reload();
//      }
//      isResizing = false;
//    }, 250);
//  }
//});

//$(window).on('scroll', function() {
//  if (!isScrolling) {
//    isScrolling = true;
//    clearTimeout(debounceTimeout);
//    debounceTimeout = setTimeout(function() {
      //console.log('Scroll stopped');
//      isScrolling = false;
//    }, 250);
//  }
//});
  
//////////////////////////////////////////////
//////////////////// CARDS ///////////////////
//////////////////////////////////////////////

// new SplitType(".card_highlights_txt_preview", {
//   types: "lines, words",
//   tagName: "span"
// });

// $(".card_highlights_txt_preview .line").wrap("<div class='line_mask'></div>");
// $(".tag.details").wrap("<div class='line_mask'></div>");

const newsItems = document.querySelectorAll(".card_highlights_item");

newsItems.forEach((item) => {
  const newsText = item.querySelectorAll(".card_highlights_txt_preview");
  const newsTag = item.querySelector(".tag.details");
  const newsArrow = item.querySelector(".card_highlights_arrow");
  const newsOverlay = item.querySelector(".card_highlights_overlay");
  const newsLogo = item.querySelector(".card_logo");

  const tl_news_preview = gsap.timeline({
    paused: true
  });

  tl_news_preview.to(newsText, {
    translateY: "100%",
    opacity: "0",
    stagger: { each: 0 },
    ease: "circ.in",
    delay: 0,
    duration: 0.3
  });

  tl_news_preview.to(
    newsArrow,
    {
      opacity: "0",
      duration: 0.3
    },
    0
  );

  tl_news_preview.to(
    newsOverlay,
    {
      opacity: "0",
      duration: 0.3
    },
    0
  );

  tl_news_preview.to(
    newsLogo,
    {
      opacity: "0",
      duration: 0.3
    },
    0
  );

  tl_news_preview.to(
    ".transition_overlay",
    {
      opacity: "1",
      duration: 0.3
    },
    0
  );

  // Disable hover fx, add again later
  tl_news_preview.to(
    ".card_highlights_item",
    {
      pointerEvents: "none",
      duration: 0
    },
    0
  );

  tl_news_preview.to(
    newsTag,
    {
      translateY: "100%",
      opacity: "0",
      ease: "circ.in",
      delay: 0,
      duration: 0.3
    },
    0
  );

  item.addEventListener("click", newsTransition);

  function newsTransition() {
    //console.log("flip");
    const state = Flip.getState(".card_highlights_item");

    tl_news_preview.resume();
    $(this).toggleClass("active");

    Flip.from(state, {
      duration: 0.5,
      ease: "circ.inOut",
      delay: 0.5
    });
  }
});
  
//////////////////////////////////////////////
/////////////// WINDOWS STYLING //////////////
//////////////////////////////////////////////  

  document.addEventListener("DOMContentLoaded", function() {
    if (navigator.userAgent.indexOf('Windows') !== -1) {
      document.documentElement.classList.add('windows');
    }
  });