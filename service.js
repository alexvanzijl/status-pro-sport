// SERVICE
console.log ('SERVICE LOADED V1.0');

//////////////////////
// SERVICE CARD ANI //
//////////////////////

document.querySelectorAll('.service_card').forEach(card => {
  const inner   = card.querySelector('.title_inner');
  const overlay = card.querySelector('.review_bg_overlay.no-fade');
  if (!inner || !overlay) return;

  gsap.set(inner, { yPercent: 0 });
  gsap.set(overlay, { opacity: 1 });

  const tl = gsap.timeline({ paused: true });

  tl.to(inner, {
    yPercent: -10,
    duration: 0.35,
    ease: 'power3.out'
  }, 0)
  .from(inner.querySelector('.icon_medium'), {
    opacity: 0,
    y: 6,
    duration: 0.2,
    ease: 'power2.out'
  }, 0.15)
  .to(overlay, {
    opacity: 0.5,
    duration: 0.3,
    ease: 'power2.out'
  }, 0); // start together with title move

  card.addEventListener('mouseenter', () => tl.play());
  card.addEventListener('mouseleave', () => tl.reverse());
});