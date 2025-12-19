// SERVICE
console.log ('SERVICE LOADED V1.0');

//////////////////////
// SERVICE CARD ANI //
//////////////////////

document.querySelectorAll('.service_card').forEach(card => {
  const inner = card.querySelector('.title_inner');
  if (!inner) return;

  gsap.set(inner, { yPercent: 0 });

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
}, 0.15);

  card.addEventListener('mouseenter', () => tl.play());
  card.addEventListener('mouseleave', () => tl.reverse());
});