import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useMotion(paused: boolean, reduced: boolean) {
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const timed = useRef<gsap.core.Animation[]>([]);

  useLayoutEffect(() => {
    if (reduced) return;
    let disposed = false;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      const entrance = gsap.timeline({ delay: .12 });
      entrance.fromTo('.hero-greeting, .hero-copy .eyebrow', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .75, ease: 'power3.out' }, 0);
      entrance.fromTo('.hero-name-line', { yPercent: 75, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .14, duration: 1.2, ease: 'power4.out' }, .12);
      entrance.fromTo('.hero-lede, .hero-summary, .hero-actions, .hero-location', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .9, ease: 'power3.out' }, .38);
      entrance.fromTo('.portrait-placement', { opacity: 0, filter: 'blur(10px)', clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, filter: 'blur(0px)', clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power3.out', clearProps: 'filter,clipPath' }, .3);
      timed.current.push(entrance);
      if (pausedRef.current) entrance.progress(1);

      gsap.to('.hero-copy', { y: -65, opacity: .25, ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: .9 } });
      gsap.to('.portrait-parallax', { y: -65, ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 1.1 } });

      document.querySelectorAll('.about h2, .section-heading h2:not(#skills-title), .education h2, .contact h2').forEach(element => {
        const reveal = gsap.fromTo(element, { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 92%', toggleActions: 'play none none none' } });
        timed.current.push(reveal);
      });
      document.querySelectorAll('.about-copy, .education-column, .languages-column, .contact-content').forEach(element => {
        const reveal = gsap.fromTo(element, { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 94%', toggleActions: 'play none none none' } });
        timed.current.push(reveal);
      });

      const toolkitHeading = gsap.timeline({
        scrollTrigger: { trigger: '.skills-heading', start: 'top 93%', end: 'top 58%', scrub: .5 },
      });
      toolkitHeading.fromTo('.skills-title-line',
        { y: 54, rotationX: -12, transformPerspective: 900, transformOrigin: '50% 100%', opacity: 0 },
        { y: 0, rotationX: 0, opacity: 1, stagger: .2, duration: 1, ease: 'power3.out' });
      toolkitHeading.fromTo('.skills-heading>p',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: .65, ease: 'power3.out' }, .3);
      document.querySelectorAll<HTMLElement>('.skill-card').forEach((card, index) => {
        const reveal = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 96%', end: 'top 52%', scrub: .6 },
        });
        reveal.fromTo(card,
          { y: 96, scale: .93, rotationX: -10, rotationZ: index % 2 ? 1.5 : -1.5, transformPerspective: 1000, transformOrigin: '50% 100%', opacity: 0 },
          { y: 0, scale: 1, rotationX: 0, rotationZ: 0, opacity: 1, duration: 1, ease: 'power3.out' }, (index % 3) * .1);
        reveal.fromTo(card.querySelector('.skill-card-heading'),
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: .5, ease: 'power2.out' }, .15);
        reveal.fromTo(card.querySelector('.skill-icon'),
          { scale: .45, rotation: -25 },
          { scale: 1, rotation: 0, duration: .65, ease: 'back.out(1.5)' }, .2);
        reveal.fromTo(card.querySelectorAll('.skill-tags>span'),
          { y: 18, scale: .9, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, stagger: .05, duration: .5, ease: 'power3.out' }, .32);
      });

      const experienceCards = gsap.utils.toArray<HTMLElement>('.experience-item');
      experienceCards.forEach((card, index) => {
        gsap.fromTo(card, {
          y: () => Math.min(150, window.innerHeight * .17),
          scale: .94, rotationX: -9, rotationZ: index % 2 ? 1.2 : -1.2,
          opacity: .12, transformPerspective: 1000, transformOrigin: '50% 100%',
        }, {
          y: 0, scale: 1, rotationX: 0, rotationZ: 0, opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card, start: 'top 98%', end: 'top 58%',
            scrub: .65, invalidateOnRefresh: true,
          },
        });
      });
      media.add('(min-width: 768px) and (min-height: 760px)', () => {
        const section = document.querySelector<HTMLElement>('#experience')!;
        section.classList.add('experience-stack');
        experienceCards.forEach((card, index) => {
          gsap.set(card, { '--experience-stack-top': `${110 + index * 22}px`, zIndex: index + 1 });
        });
        return () => section.classList.remove('experience-stack');
      });

      media.add('(min-width: 1100px) and (min-height: 720px)', () => {
        const section = document.querySelector<HTMLElement>('#projects')!;
        const viewport = section.querySelector<HTMLElement>('.projects-viewport')!;
        const track = section.querySelector<HTMLElement>('.project-grid')!;
        section.classList.add('projects-horizontal');
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const slide = gsap.to(track, {
          x: () => -distance(), ease: 'none',
          scrollTrigger: {
            trigger: viewport, start: 'top 116px', end: () => `+=${Math.round(distance() * .8)}`,
            pin: true, scrub: .85, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: self => section.style.setProperty('--work-progress', self.progress.toString()),
          },
        });
        const keyboard = (event: KeyboardEvent) => {
          const trigger = slide.scrollTrigger;
          if (!trigger?.isActive || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
          event.preventDefault();
          const direction = event.key === 'ArrowRight' ? 1 : -1;
          const card = track.querySelector<HTMLElement>('.project-card')!;
          const step = (card.offsetWidth + 28) / Math.max(1, distance());
          const progress = gsap.utils.clamp(0, 1, trigger.progress + direction * step);
          window.scrollTo({ top: trigger.start + progress * (trigger.end - trigger.start), behavior: 'smooth' });
        };
        viewport.addEventListener('keydown', keyboard);
        return () => { viewport.removeEventListener('keydown', keyboard); section.classList.remove('projects-horizontal'); section.style.removeProperty('--work-progress'); };
      });
    });
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => {
      disposed = true; media.revert(); context.revert(); timed.current = [];
    };
  }, [reduced]);

  // Pause stops timed effects; scroll-driven navigation continues to follow the user.
  useEffect(() => { if (paused) timed.current.forEach(animation => animation.progress(1)); }, [paused]);
}
