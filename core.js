//CORE
console.log ('CORE LOADED V1.12');

///////////////////
// SMOOTH SCROLL //
///////////////////

let smoother;

window.Webflow ||= [];
window.Webflow.push(() => {
  if (smoother) return; // 🔑 prevent double init

  const wrapper = document.querySelector('.max-width_wrapper');
  const content = document.querySelector('.website');

  if (!wrapper || !content) {
    console.warn('ScrollSmoother: wrapper or content missing');
    return;
  }

  // Only enable on desktop
  if (window.innerWidth >= 992) {
    smoother = ScrollSmoother.create({
      wrapper,
      content,
      smooth: 1.2,
      effects: true,
      normalizeScroll: true
    });
  }
});

///////////////////
// GLOBAL LOADER //
///////////////////

function initPageLoader() {

  const loader = document.querySelector('.loader_container');
  const logo = document.querySelector('.loader_logo');

  if (!loader || !logo) return;

  // Reset transform only (NO visibility control)
  gsap.set(loader, {
    yPercent: 0
  });

  // Split text
  const split = new SplitText(logo, {
    type: 'words'
  });
  
  // Initial state: words below
  gsap.set(logo, { visibility: 'visible' });
  gsap.set(split.words, { y: '2em' });

  const tl = gsap.timeline({
    defaults: {
      ease: 'power3.out'
    }
  });

  // IN
  tl.to(split.words, {
    y: 0,
    duration: 1,
    stagger: 0.15,
    delay: 0.6
  });

  // HOLD
  tl.to({}, { duration: 0.25 });

  // 🔑 Reveal page BEFORE loader exits
  tl.add(() => {
    document.documentElement.classList.remove('is-loading');
  });

  // OUT (words go up)
  tl.to(split.words, {
    y: '-2em',
    duration: 0.5,
    stagger: 0.15,
    ease: 'power3.in'
  });

  // Loader slides up
  tl.to(loader, {
    yPercent: -100,
    duration: 1,
    ease: 'power3.in'
  }, '-=0.5');

  // Cleanup + signal (ONCE)
  tl.add(() => {
    split.revert();
    window.dispatchEvent(new Event('loaderComplete'));
  });
}

window.addEventListener('DOMContentLoaded', initPageLoader);

/////////////////////
// GLOBAL PARALLAX //
/////////////////////

function initImageParallax({
  containerSelector,
  imageSelector,
  yPercent = 10,
  start = 'top bottom',
  end = 'bottom top'
}) {
  const containers = document.querySelectorAll(containerSelector);
  if (!containers.length) return;

  containers.forEach(container => {
    const image = container.querySelector(imageSelector);
    if (!image) return;

    gsap.fromTo(
      image,
      { yPercent: -yPercent },
      {
        yPercent: yPercent,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start,
          end,
          scrub: true
        }
      }
    );
  });
}

window.addEventListener('loaderComplete', () => {
    initRevealText();
});

// CASES
initImageParallax({
  containerSelector: '.partners',
  imageSelector: '.partners_bg_img',
  yPercent: 10
});

// CARDS
initImageParallax({
  containerSelector: '.service_card',
  imageSelector: '.card_bg_img',
  yPercent: 10
});

// CTA
initImageParallax({
  containerSelector: '.cta',
  imageSelector: '.cta_bg_img',
  yPercent: 10
});

/////////////////////////
// GLOBAL TEXT EFFECTS //
/////////////////////////

const revealItems = [];

/**
 * PRIME: split + mask + set initial state
 */
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve())
.then(() => {
  document.querySelectorAll('[data-reveal]').forEach(el => {

    const split = new SplitText(el, {
      type: 'words',
      wordsClass: 'reveal-word'
    });

    // Wrap each word with inner span (mask)
    split.words.forEach(word => {
      const inner = document.createElement('span');
      inner.textContent = word.textContent;
      word.textContent = '';
      word.appendChild(inner);
    });

    const wordsInner = el.querySelectorAll('.reveal-word > span');

    // Initial state
    gsap.set(wordsInner, { y: '1.1em' });
    el.style.setProperty('visibility', 'hidden', 'important');

    revealItems.push({
      el,
      words: wordsInner,
      stagger: parseFloat(el.dataset.revealStagger) || 0.04,
      delay: parseFloat(el.dataset.revealDelay) || 0
    });
  });
});


/**
 * REVEAL: play animation on scroll
 */
function initRevealText() {
  revealItems.forEach(({ el, words, stagger, delay }) => {

    const tl = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.9,
        ease: 'power3.out'
      }
    });

    // Reveal visibility right before animating
    tl.call(() => {
      el.style.setProperty('visibility', 'visible', 'important');
    });

    tl.to(words, {
      y: 0,
      stagger,
      delay
    });

    // ✅ FIXED ScrollTrigger
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',

      onEnter: self => {
        tl.play();
        self.kill(); // 🔑 critical
      },

      // Handles elements already in view on init / refresh
      onRefresh: self => {
        if (self.progress > 0 && !tl.isActive()) {
          tl.play();
          self.kill(); // 🔑 critical
        }
      }
    });
  });
}

// Init after loader
window.addEventListener('loaderComplete', initRevealText);

//////////////////////////
// HEADER MARGIN PUSHER //
//////////////////////////

const header = document.querySelector('.header');
const pusher = document.querySelector('.menu_pusher');

if (header && pusher) {
  const ro = new ResizeObserver(entries => {
    for (const entry of entries) {
      pusher.style.height = `${entry.contentRect.height}px`;
    }
  });

  ro.observe(header);
}
  
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
    const ams = document.getElementById("time_amsterdam");
    const jkt = document.getElementById("time_jakarta");

    if (ams) ams.innerHTML = amsterdam_datetime_str;
    if (jkt) jkt.innerHTML = jakarta_datetime_str;

});

////////////////////////////
// SECONDARY BUTTON LOGIC //
////////////////////////////

// CORE
function initSplitHoverText({
  trigger,
  textEl,
  splitType = 'words',
  wordClass = 'button_word',
  maskClass = 'button_word_mask'
}) {
  if (!trigger || !textEl || textEl.dataset.split) return;

  textEl.dataset.split = 'true';

  const split = new SplitText(textEl, {
    type: splitType,
    wordsClass: wordClass
  });

  split.words.forEach(word => {
    const mask = document.createElement('span');
    mask.classList.add(maskClass);
    word.parentNode.insertBefore(mask, word);
    mask.appendChild(word);
  });

  const tl = gsap.timeline({ paused: true });

  tl.to(split.words, {
    y: '-110%',
    duration: 0.18,
    ease: 'power2.in',
    stagger: 0.03
  })
  .set(split.words, {
    y: '100%'
  })
  .to(split.words, {
    y: '0%',
    duration: 0.22,
    ease: 'power2.out',
    stagger: 0.03
  });

  trigger.addEventListener('mouseenter', () => tl.restart());
}

// SEC BUTTON
function initSecondaryButtons() {
  document.querySelectorAll('.button_secondary').forEach(button => {
    initSplitHoverText({
      trigger: button,
      textEl: button.querySelector('.button_txt')
    });
  });
}

// LIST ITEMS
function initConnectLines() {
  document.querySelectorAll('.connect_line').forEach(line => {
    initSplitHoverText({
      trigger: line,
      textEl: line.querySelector('.connect_line_txt')
    });
  });
}

// INIT
window.addEventListener('DOMContentLoaded', () => {
  initSecondaryButtons();
  initConnectLines();
});

///////////////
// BIO BLOCK //
///////////////

ScrollTrigger.matchMedia({

  // DESKTOP & TABLET
  "(min-width: 768px)": function () {

    const detailsBody = document.querySelector('.details_body');
    const bioBlock    = document.querySelector('.bio');
    const bioGrid     = document.querySelector('.details_body_bio');

    // 🔒 HARD GUARD — prevents ScrollTrigger from even initializing
    if (!detailsBody || !bioBlock || !bioGrid) return;

    ScrollTrigger.create({
      trigger: detailsBody,
      start: 'top top+=32',

      end: () => {
        const topOffset = 0;
        const dist = bioGrid.offsetHeight - bioBlock.offsetHeight - topOffset;
        return `+=${Math.max(0, dist)}`;
      },

      pin: bioBlock,
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

////////////////////
// MAIN NAV MENU //
////////////////////

function initMainMenu() {
  const wrapper        = document.querySelector('.menu_wrapper');
  const overlay        = document.querySelector('.menu_overlay');
  const panel          = document.querySelector('.menu_items');
  const openBtn        = document.querySelector('.nav_open');
  const openScrollBtn  = document.querySelector('.nav_open_scroll');
  const closeBtn       = document.querySelector('.menu_close');

  if (!wrapper || !overlay || !panel || !openBtn || !closeBtn) return;

  // --------------------------------
  // Initial hard state
  // --------------------------------
  gsap.set(wrapper, {
    display: 'none',
    position: 'fixed',
    inset: 0,
    width: '100vw',
    height: '100vh'
  });

  gsap.set(overlay, { opacity: 0 });
  gsap.set(panel, { xPercent: 100 });

  // Scroll nav button hidden by default
  if (openScrollBtn) {
    gsap.set(openScrollBtn, {
      display: 'none',
      opacity: 0,
      scale: 0.25,
      yPercent: 100
    });
  }

  // --------------------------------
  // OPEN TIMELINE (NO TEXT HERE)
  // --------------------------------
  const openTl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.out' }
  });

  openTl
    .set(wrapper, { display: 'flex' })
    .to(overlay, {
      opacity: 0.7,
      duration: 0.3
    }, 0)
    .to(panel, {
      xPercent: 0,
      duration: 0.6,
      ease: 'power4.out'
    }, 0);

  // --------------------------------
  // TEXT REVEAL (imperative & safe)
  // --------------------------------
  function revealMenuText() {
    const revealWords = panel.querySelectorAll(
      '[data-reveal] .reveal-word > span'
    );

    if (!revealWords.length) return;

    gsap.set(revealWords, { yPercent: 140 });

    gsap.to(revealWords, {
      yPercent: 0,
      duration: 0.5,
      stagger: 0.02,
      ease: 'power3.out',
      delay: 0.2
    });
  }

  // --------------------------------
  // OPEN (shared logic)
  // --------------------------------
  function openMenu() {
    smoother?.paused(true);
    document.body.classList.add('menu-open');

    openTl.restart();
    revealMenuText();
  }

  // --------------------------------
  // CLOSE
  // --------------------------------
  function closeMenu() {
    gsap.timeline({
      defaults: { ease: 'power2.in' }
    })
      .to(panel, {
        xPercent: 100,
        duration: 0.4,
        ease: 'power3.in'
      }, 0)
      .to(overlay, {
        opacity: 0,
        duration: 0.25
      }, 0.1)
      .set(wrapper, { display: 'none' })
      .add(() => {
        document.body.classList.remove('menu-open');
        smoother?.paused(false);
      });
  }

  // --------------------------------
  // CLICK TRIGGERS
  // --------------------------------
  openBtn.addEventListener('click', openMenu);
  openScrollBtn?.addEventListener('click', openMenu);

  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // --------------------------------
  // ESC KEY
  // --------------------------------
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && wrapper.style.display === 'flex') {
      closeMenu();
    }
  });

  ////////////////////////////////////
// SCROLL NAV BUTTON REVEAL (UPDATED)
////////////////////////////////////

if (openScrollBtn) {
  const showTl = gsap.timeline({ paused: true });
  const hideTl = gsap.timeline({ paused: true });

  // IN animation
  showTl
    .set(openScrollBtn, { display: 'flex' })
    .to(openScrollBtn, {
      opacity: 1,
      scale: 1,
      yPercent: 0,
      duration: 0.4,
      ease: 'back.out(2.4)'
    });

  // OUT animation
  hideTl
    .to(openScrollBtn, {
      opacity: 0,
      scale: 0.25,
      yPercent: 100,
      duration: 0.25,
      ease: 'power2.in'
    })
    .set(openScrollBtn, { display: 'none' });

  ScrollTrigger.create({
    trigger: document.body,
    scroller: smoother?.wrapper || undefined,
    start: 'top -25%',
    onEnter: () => {
      hideTl.kill();
      showTl.restart();
      
      // SHINE
      gsap.fromTo(
        openScrollBtn,
        { '--shine': '-120%' },
        { '--shine': '120%',
        duration: 0.45,
        ease: 'power2.out'
        }
    );
      
    },
    onLeaveBack: () => {
      showTl.kill();
      hideTl.restart();
    }
  });
}

// Init once DOM is ready
window.addEventListener('DOMContentLoaded', initMainMenu);

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
  
  if (
  !newsText.length &&
  !newsTag &&
  !newsArrow &&
  !newsOverlay &&
  !newsLogo
) return;

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