//CORE
console.log('CORE LOADED V1.2');

///////////////////
// SMOOTH SCROLL //
///////////////////

let smoother;

window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
  if (smoother) return; // prevent double init

  const wrapper = document.querySelector('.max-width_wrapper');
  const content = document.querySelector('.website');

  if (!wrapper || !content) {
    console.warn('ScrollSmoother: wrapper or content missing');
    return;
  }

  // Guard: ScrollSmoother must exist
  if (typeof ScrollSmoother === 'undefined') {
    console.warn('ScrollSmoother not found (plugin not loaded). Skipping smooth scroll init.');
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

  // Guard dependencies
  if (typeof gsap === 'undefined' || typeof SplitText === 'undefined') {
    console.warn('Loader: gsap and/or SplitText missing. Skipping loader animation.');
    document.documentElement.classList.remove('is-loading');
    window.dispatchEvent(new Event('loaderComplete'));
    return;
  }

  // Reset transform only (NO visibility control)
  gsap.set(loader, { yPercent: 0 });

  // Split text
  const split = new SplitText(logo, { type: 'words' });

  // Initial state: words below
  gsap.set(logo, { visibility: 'visible' });
  gsap.set(split.words, { y: '2em' });

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' }
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

  // Reveal page BEFORE loader exits
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
  tl.to(
    loader,
    {
      yPercent: -100,
      duration: 1,
      ease: 'power3.in'
    },
    '-=0.5'
  );

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

  // Guard: gsap + ScrollTrigger required
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Don't hard-fail the whole file; just skip parallax
    console.warn('Parallax: gsap and/or ScrollTrigger missing. Skipping parallax init.');
    return;
  }

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

// TESTIMONIALS
initImageParallax({
  containerSelector: '.reviews_highlight',
  imageSelector: '.review_bg_img',
  yPercent: 10
});

/////////////////////////
// GLOBAL TEXT EFFECTS //
/////////////////////////

const revealItems = [];

/**
 * PRIME: split + mask + set initial state
 */
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => {
  // Guard: dependencies
  if (typeof gsap === 'undefined' || typeof SplitText === 'undefined') {
    console.warn('RevealText: gsap and/or SplitText missing. Skipping reveal text priming.');
    return;
  }

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
  // Guard: ScrollTrigger required
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('RevealText: gsap and/or ScrollTrigger missing. Skipping reveal text triggers.');
    return;
  }

  revealItems.forEach(({ el, words, stagger, delay }) => {
    const tl = gsap.timeline({
      paused: true,
      defaults: { duration: 0.9, ease: 'power3.out' }
    });

    // Reveal visibility right before animating
    tl.call(() => {
      el.style.setProperty('visibility', 'visible', 'important');
    });

    tl.to(words, { y: 0, stagger, delay });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',

      onEnter: self => {
        tl.play();
        self.kill();
      },

      onRefresh: self => {
        if (self.progress > 0 && !tl.isActive()) {
          tl.play();
          self.kill();
        }
      }
    });
  });
}

// Init after loader (ONLY once)
window.addEventListener('loaderComplete', initRevealText);

//////////////////////////
// HEADER MARGIN PUSHER //
//////////////////////////

const header = document.querySelector('.header');
const pusher = document.querySelector('.menu_pusher');

if (header && pusher && typeof ResizeObserver !== 'undefined') {
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

// Guard jQuery so it doesn't crash the entire file if $ is missing on some pages.
const $ = window.jQuery || window.$;

if ($ && typeof $.fn !== 'undefined') {
  $(document).ready(function () {
    const amsterdam_datetime_str = new Date().toLocaleString('en-UK', {
      timeZone: 'Europe/Amsterdam',
      hour: '2-digit',
      minute: '2-digit'
    });

    const jakarta_datetime_str = new Date().toLocaleString('en-UK', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit'
    });

    const ams = document.getElementById('time_amsterdam');
    const jkt = document.getElementById('time_jakarta');

    if (ams) ams.innerHTML = amsterdam_datetime_str;
    if (jkt) jkt.innerHTML = jakarta_datetime_str;
  });
} else {
  // Optional: keep this quiet if you want
  console.warn('jQuery ($) not found. Skipping timezone DOM updates.');
}

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

  // Guard
  if (typeof gsap === 'undefined' || typeof SplitText === 'undefined') return;

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
    .set(split.words, { y: '100%' })
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

if (typeof ScrollTrigger !== 'undefined') {
  ScrollTrigger.matchMedia({
    "(min-width: 768px)": function () {
      const detailsBody = document.querySelector('.details_body');
      const bioBlock = document.querySelector('.bio');
      const bioGrid = document.querySelector('.details_body_bio');

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
      });
    },

    "(max-width: 767px)": function () {
      // Intentionally empty
    }
  });
} else {
  console.warn('ScrollTrigger not found. Skipping bio pin logic.');
}

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

  // Guard
  if (!wrapper || !overlay || !panel || !closeBtn) return;
  if (typeof gsap === 'undefined') {
    console.warn('Nav: gsap missing. Skipping nav init.');
    return;
  }

  // --------------------------------
  // MOBILE: ALWAYS SHOW SCROLL HAMBURGER
  // --------------------------------
  const MOBILE_MQ = window.matchMedia('(max-width: 767px)');

  function applyHamburgerMode() {
    if (!openScrollBtn) return;

    if (MOBILE_MQ.matches) {
      gsap.set(openScrollBtn, {
        display: 'flex',
        opacity: 1,
        scale: 1,
        yPercent: 0,
        pointerEvents: 'auto',
        willChange: 'transform, opacity'
      });
    } else {
      gsap.set(openScrollBtn, {
        display: 'none',
        opacity: 0,
        scale: 0.25,
        yPercent: 100,
        pointerEvents: 'auto',
        willChange: 'transform, opacity'
      });
    }
  }

  applyHamburgerMode();

  if (MOBILE_MQ.addEventListener) {
    MOBILE_MQ.addEventListener('change', applyHamburgerMode);
  } else if (MOBILE_MQ.addListener) {
    MOBILE_MQ.addListener(applyHamburgerMode);
  }

  window.addEventListener('resize', applyHamburgerMode);

  // --------------------------------
  // HOVER SHIMMER
  // --------------------------------
  if (openScrollBtn) {
    let hoverTl;

    openScrollBtn.addEventListener('mouseenter', () => {
      if (hoverTl) hoverTl.kill();

      hoverTl = gsap.fromTo(
        openScrollBtn,
        { '--shine-x': '-120%' },
        { '--shine-x': '120%', duration: 0.25, ease: 'power1.out' }
      );
    });
  }

  // --------------------------------
  // INITIAL HARD STATE
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

  // --------------------------------
  // OPEN TIMELINE (NO TEXT)
  // --------------------------------
  const openTl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.out' }
  });

  openTl
    .set(wrapper, { display: 'flex' })
    .to(overlay, { opacity: 0.7, duration: 0.3 }, 0)
    .to(panel, { xPercent: 0, duration: 0.6, ease: 'power4.out' }, 0);

  // --------------------------------
  // TEXT REVEAL
  // --------------------------------
  function revealMenuText() {
    const words = panel.querySelectorAll('[data-reveal] .reveal-word > span');
    if (!words.length) return;

    gsap.set(words, { yPercent: 140 });

    gsap.to(words, {
      yPercent: 0,
      duration: 0.5,
      stagger: 0.02,
      ease: 'power3.out',
      delay: 0.2
    });
  }

  // --------------------------------
  // OPEN / CLOSE
  // --------------------------------
  function openMenu() {
    if (typeof smoother !== 'undefined' && smoother && smoother.paused) {
      smoother.paused(true);
    }

    document.body.classList.add('menu-open');
    openTl.restart();
    revealMenuText();
  }

  function closeMenu() {
    gsap.timeline({ defaults: { ease: 'power2.in' } })
      .to(panel, { xPercent: 100, duration: 0.4, ease: 'power3.in' }, 0)
      .to(overlay, { opacity: 0, duration: 0.25 }, 0.1)
      .set(wrapper, { display: 'none' })
      .add(() => {
        document.body.classList.remove('menu-open');

        if (typeof smoother !== 'undefined' && smoother && smoother.paused) {
          smoother.paused(false);
        }

        applyHamburgerMode();
      });
  }

  // --------------------------------
  // CLICK TRIGGERS
  // --------------------------------
  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (openScrollBtn) openScrollBtn.addEventListener('click', openMenu);

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

  //////////////////////////////////////////
  // SCROLL NAV BUTTON (IN + OUT + SHINE) //
  //////////////////////////////////////////

  if (openScrollBtn && typeof ScrollTrigger !== 'undefined') {
    const showTl = gsap.timeline({ paused: true });
    const hideTl = gsap.timeline({ paused: true });

    // IN
    showTl
      .set(openScrollBtn, { display: 'flex' })
      .to(openScrollBtn, {
        opacity: 1,
        scale: 1,
        yPercent: 0,
        duration: 0.4,
        ease: 'back.out(2.4)'
      })
      .fromTo(
        openScrollBtn,
        { backgroundPosition: '0% 50%' },
        {
          backgroundPosition: '200% 50%',
          duration: 0.45,
          ease: 'power2.out'
        },
        0.1
      );

    // OUT
    hideTl
      .to(openScrollBtn, {
        opacity: 0,
        scale: 0.25,
        yPercent: 100,
        duration: 0.25,
        ease: 'power2.in'
      })
      .set(openScrollBtn, { display: 'none' });

    // Resolve scroller element SAFELY (ScrollSmoother wrapper is often a function: wrapper())
    let scrollerEl = null;

    if (typeof smoother !== 'undefined' && smoother) {
      if (typeof smoother.wrapper === 'function') {
        scrollerEl = smoother.wrapper();
      } else if (smoother.wrapper && smoother.wrapper.nodeType === 1) {
        scrollerEl = smoother.wrapper;
      }
    }

    // Build config without scroller by default (window scrolling)
    const stConfig = {
      trigger: document.body,
      start: 'top -25%',
      onEnter: () => {
        if (MOBILE_MQ.matches) return;

        hideTl.kill();
        showTl.restart();

        gsap.fromTo(
          openScrollBtn,
          { '--shine-x': '-120%' },
          {
            '--shine-x': '120%',
            duration: 0.65,
            ease: 'power2.out'
          }
        );
      },
      onLeaveBack: () => {
        if (MOBILE_MQ.matches) return;

        showTl.kill();
        hideTl.restart();
      }
    };

    // Only add scroller if it's a real Element
    if (scrollerEl && scrollerEl.nodeType === 1) {
      stConfig.scroller = scrollerEl;
    }

    ScrollTrigger.create(stConfig);
  }
} // ✅ FIX: closes initMainMenu()


///////////////////////////////
// TOTAL NUMBER OF CASES TXT //
///////////////////////////////

window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
  const cases = document.querySelectorAll('.cases_card');
  const total = cases.length;

  cases.forEach((card, i) => {
    const indexEl = card.querySelector('.case_index');
    if (!indexEl) return;

    const current = String(i + 1).padStart(2, '0');
    const totalFormatted = String(total).padStart(2, '0');

    indexEl.setAttribute('data-index', current);
    indexEl.setAttribute('data-total', totalFormatted);
  });
});

///////////////////////////////
// INIT
///////////////////////////////

window.Webflow = window.Webflow || [];
window.Webflow.push(() => {
  initMainMenu();
});

//////////////////////////////////////////////
//////////////////// CARDS ///////////////////
//////////////////////////////////////////////

const newsItems = document.querySelectorAll('.card_highlights_item');

newsItems.forEach(item => {
  // Guard: gsap required for animations
  if (typeof gsap === 'undefined') return;

  const newsText = item.querySelectorAll('.card_highlights_txt_preview');
  const newsTag = item.querySelector('.tag.details');
  const newsArrow = item.querySelector('.card_highlights_arrow');
  const newsOverlay = item.querySelector('.card_highlights_overlay');
  const newsLogo = item.querySelector('.card_logo');

  if (!newsText.length && !newsTag && !newsArrow && !newsOverlay && !newsLogo) return;

  const tl_news_preview = gsap.timeline({ paused: true });

  tl_news_preview.to(newsText, {
    translateY: '100%',
    opacity: '0',
    stagger: { each: 0 },
    ease: 'circ.in',
    delay: 0,
    duration: 0.3
  });

  tl_news_preview.to(newsArrow, { opacity: '0', duration: 0.3 }, 0);
  tl_news_preview.to(newsOverlay, { opacity: '0', duration: 0.3 }, 0);
  tl_news_preview.to(newsLogo, { opacity: '0', duration: 0.3 }, 0);
  tl_news_preview.to('.transition_overlay', { opacity: '1', duration: 0.3 }, 0);

  tl_news_preview.to('.card_highlights_item', { pointerEvents: 'none', duration: 0 }, 0);

  tl_news_preview.to(
    newsTag,
    {
      translateY: '100%',
      opacity: '0',
      ease: 'circ.in',
      delay: 0,
      duration: 0.3
    },
    0
  );

  item.addEventListener('click', newsTransition);

  function newsTransition() {
    // Guard Flip
    if (typeof Flip === 'undefined') {
      console.warn('Flip plugin not found. Skipping Flip animation.');
      tl_news_preview.resume();
      item.classList.toggle('active');
      return;
    }

    const state = Flip.getState('.card_highlights_item');

    tl_news_preview.resume();
    item.classList.toggle('active');

    Flip.from(state, {
      duration: 0.5,
      ease: 'circ.inOut',
      delay: 0.5
    });
  }
});

//////////////////////////////////////////////
/////////////// WINDOWS STYLING //////////////
//////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function () {
  if (navigator.userAgent.indexOf('Windows') !== -1) {
    document.documentElement.classList.add('windows');
  }
});