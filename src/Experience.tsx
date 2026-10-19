import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowDown, Plus, Minus } from 'lucide-react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { process, profile } from './content';

const Canvas = lazy(() => import('./three/SceneCanvas'));
export type MotionSettings = { paused: boolean; reduced: boolean };

export function AmbientMotion({ paused, reduced }: MotionSettings) {
  return <Suspense fallback={null}><Canvas kind="ambient" paused={paused} reduced={reduced} /></Suspense>;
}

export function PortraitFigure({ paused, reduced }: MotionSettings) {
  const tilt = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const reset = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    if (tilt.current) tilt.current.style.transform = '';
  };
  useEffect(() => { if (paused || reduced) reset(); }, [paused, reduced]);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (paused || reduced || event.pointerType !== 'mouse') return;
    pointer.current = { x: event.clientX, y: event.clientY };
    if (frame.current) return;
    const stage = event.currentTarget;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      if (!tilt.current) return;
      // Read stable bounds before writing, at most once per display frame.
      const rect = stage.getBoundingClientRect();
      const { x: clientX, y: clientY } = pointer.current;
      const x = (clientX - rect.left) / rect.width - .5;
      const y = (clientY - rect.top) / rect.height - .5;
      tilt.current.style.transform = `perspective(900px) translate3d(${x * 10}px,0,0) rotateX(${-y * 7}deg) rotateY(${x * 11}deg)`;
    });
  };
  return <div className="hero-art hero-standing-stage" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
    <div className="portrait-placement">
      <div className="portrait-parallax"><div ref={tilt} className="portrait-tilt"><div className="portrait-float">
        <div className="portrait-crop"><img className="hero-standing-photo" src={`${import.meta.env.BASE_URL}assets/nayana-standing.png`} alt="Portrait of Nayana S Parthan in professional attire" width="1024" height="1536" fetchPriority="high" /></div>
      </div></div></div>
    </div>
  </div>;
}

const stages = profile.journey;

export function SystemStory({ paused, reduced }: MotionSettings) {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0; const rect = section.current!.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      setProgress(p); if (!reduced) setActive(Math.min(3, Math.floor(p * 4)));
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
    update(); window.addEventListener('scroll', queue, { passive: true }); window.addEventListener('resize', queue);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); };
  }, [reduced]);
  const navigate = (index: number) => {
    setActive(index);
    if (!reduced && section.current) {
      const rect = section.current.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + rect.top + (rect.height - window.innerHeight) * ((index + .18) / 4), behavior: paused ? 'instant' : 'smooth' });
    }
  };
  const current = stages[active];
  return <section ref={section} id="story" className={`system-story ${reduced ? 'reduced-story' : ''}`} data-scroll-scene aria-labelledby="system-title">
    <div className="system-sticky"><div className="system-topline section-label mono"><span>03 / HOW THE PIECES FIT</span><span>SCROLL TO FOLLOW THE BUILD <ArrowDown size={11}/></span></div>
      <div className="system-layout"><div className="system-copy"><p className="system-phase mono"><span className="accent-line"/> {current.label}</p><h2 id="system-title" key={active} className="system-title">{current.title[0]}<br/><em>{current.title[1]}</em></h2><p className="system-description" key={`copy-${active}`}>{current.copy}</p><span className="system-footnote mono">{current.footnote}</span></div><div className="system-visual"><Suspense fallback={<div className="scene-loading"/>}><Canvas kind="system" paused={paused} reduced={reduced} stage={active}/></Suspense><span className="system-figure-caption mono">ONE IDEA. MANY PERSPECTIVES.</span></div></div>
      <div className="story-stage-nav" aria-label="Engineering story stages">{stages.map((stage, i) => <button key={stage.name} onClick={() => navigate(i)} className={active === i ? 'active' : ''} aria-current={active === i ? 'step' : undefined}><span className="mono">0{i + 1}</span><span>{stage.name}</span><span className="stage-nav-track"><i style={{ transform: `scaleX(${reduced ? (active >= i ? 1 : 0) : Math.max(0, Math.min(1, progress * 4 - i))})` }}/></span></button>)}</div>
    </div>
  </section>;
}

export function CraftStory({ paused, reduced }: MotionSettings) {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const activeRef = useRef(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const rows = [...section.current!.querySelectorAll<HTMLElement>('.craft-beat')];
      let closest = 0, distance = Infinity;
      const targetLine = window.innerHeight * (window.innerWidth < 768 ? .8 : .53);
      rows.forEach((row, i) => { const rect = row.getBoundingClientRect(); const d = Math.abs(rect.top + rect.height / 2 - targetLine); if (d < distance) { closest = i; distance = d; } });
      if (closest !== activeRef.current) { activeRef.current = closest; setActive(closest); }
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
    if (!reduced) { update(); window.addEventListener('scroll', queue, { passive: true }); window.addEventListener('resize', queue); }
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); };
  }, [reduced]);
  const forms = ['DISCOVER', 'PREPARE', 'BUILD', 'EVALUATE'];
  return <section ref={section} id="process" className={`craft-story ${reduced ? 'reduced-craft' : ''}`} aria-labelledby="process-title">
    <div className="craft-sticky"><div className="section-label mono"><span>06 / FROM QUESTION TO MODEL</span><span>＋</span></div><div className="craft-sculpture"><Suspense fallback={<div className="scene-loading"/>}><Canvas kind="craft" paused={paused} reduced={reduced} stage={active}/></Suspense><div className="sculpture-form mono"><span>0{active + 1} / {forms[active]}</span><span className="sculpture-status">{paused || reduced ? 'STILL FRAME' : 'ALWAYS TAKING SHAPE'}</span></div></div><h2 id="process-title">Curiosity<span className="craft-title-second">into <em>practice.</em></span></h2><p className="craft-intro">Explore the problem, build with care,<br/>and make room to keep learning.</p><div className="craft-terminal mono"><span>›</span> {['understand the problem and people', 'prepare data and explore the signals', 'turn the plan into a useful application or model', 'evaluate performance and improve the result'][active]}<i/></div></div>
    <div className="craft-beats">{process.map((step, i) => <article key={step.name} className={`craft-beat ${active === i ? 'active' : ''}`} data-stage={i}><div className="craft-beat-number mono">0{i + 1} / {forms[i]}</div><button className="craft-beat-heading" onClick={() => { setOpen(open === i ? null : i); setActive(i); activeRef.current = i; }} aria-expanded={open === i} aria-controls={`process-detail-${i}`}><span className="sr-only">0{i + 1} </span><span>{step.name}</span><span className="step-toggle">{open === i ? <Minus size={21}/> : <Plus size={21}/>}</span></button><p className="craft-beat-tagline">{step.tagline}</p><div id={`process-detail-${i}`} className="craft-beat-detail" hidden={open !== i}><p>{step.description}</p></div><div className="beat-bottom mono"><span>{['ASK BETTER QUESTIONS.', 'MAKE THE PIECES FIT.', 'BRING IT TO LIFE.', 'KEEP MOVING FORWARD.'][i]}</span><span>＋</span></div></article>)}</div>
  </section>;
}

