import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createScene, disposeScene, type SceneKind, type SceneRuntime } from './scenes';

type Props = { kind: SceneKind; paused: boolean; reduced: boolean; stage?: number };

export default function SceneCanvas({ kind, paused, reduced, stage = 0 }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const settings = useRef({ paused, reduced, stage });
  settings.current = { paused, reduced, stage };
  const invalidateRef = useRef<() => void>(() => {});
  const [failed, setFailed] = useState(false);
  useEffect(() => { invalidateRef.current(); }, [paused, reduced, stage]);

  useEffect(() => {
    const host = hostRef.current!;
    let renderer: THREE.WebGLRenderer | null = null;
    let runtime: SceneRuntime | null = null;
    let active = false, destroyed = false, unavailable = false, dirty = true;
    let frameId = 0, elapsed = 0, previous = 0, frames = 0, progress = 0;
    let pointerInside = false;
    const mobile = matchMedia('(max-width: 767px)').matches;
    const targetMouse = new THREE.Vector2(), mouse = new THREE.Vector2();
    const section = host.closest<HTMLElement>('[data-scroll-scene]');
    const sectionProgress = () => {
      if (!section) return kind === 'ambient' ? scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) : 0;
      const rect = section.getBoundingClientRect();
      return THREE.MathUtils.clamp(-rect.top / Math.max(1, rect.height - innerHeight), 0, 1);
    };
    function resize() {
      if (!renderer || !runtime) return;
      const width = Math.max(1, host.clientWidth), height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false);
      runtime.camera.aspect = width / height; runtime.camera.updateProjectionMatrix();
      runtime.resize?.(width / height); invalidate();
    }
    function render(now: number) {
      frameId = 0;
      if (!renderer || !runtime || destroyed || unavailable || !active || document.hidden) return;
      const { paused, reduced, stage } = settings.current;
      const still = paused || reduced;
      const delta = previous ? Math.min((now - previous) / 1000, .05) : 1 / 60;
      previous = now;
      if (!still) elapsed += delta;
      if (!paused) progress = reduced ? sectionProgress() : THREE.MathUtils.lerp(progress, sectionProgress(), .085);
      if (!still) mouse.lerp(targetMouse, .055);
      runtime.update({ time: elapsed, delta, progress, stage, mouse, reduced, paused, pointerInside });
      renderer.render(runtime.scene, runtime.camera);
      frames++;
      if (frames % 8 === 1 || dirty) {
        const data = renderer.domElement.dataset;
        data.frames = String(frames); data.progress = progress.toFixed(3); data.stage = String(stage); data.paused = String(still);
        data.camera = runtime.camera.position.toArray().map(v => v.toFixed(2)).join(',');
        if (runtime.sample) data.geometry = runtime.sample();
      }
      dirty = false;
      if (!still) frameId = requestAnimationFrame(render);
    }
    function invalidate() {
      dirty = true;
      if (active && !unavailable && !frameId && !document.hidden) frameId = requestAnimationFrame(render);
    }
    invalidateRef.current = invalidate;
    function fail() {
      if (destroyed) return;
      unavailable = true; setFailed(true); host.classList.remove('is-ready');
      if (frameId) cancelAnimationFrame(frameId); frameId = 0;
    }
    function contextLost(event: Event) { event.preventDefault(); fail(); }
    function start() {
      if (renderer || unavailable || destroyed) return;
      try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('webgl2', { alpha: true, antialias: !mobile });
        if (!context) { fail(); return; }
        renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: !mobile });
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, kind === 'ambient' ? (mobile ? 1 : 1.25) : (mobile ? 1.25 : 1.5)));
        renderer.setClearColor('#090909', 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
        canvas.dataset.scene = kind; canvas.setAttribute('aria-hidden', 'true');
        canvas.addEventListener('webglcontextlost', contextLost); host.prepend(canvas);
        runtime = createScene(kind, mobile); host.classList.add('is-ready');
        progress = sectionProgress(); resize();
      } catch { fail(); }
    }
    function release() {
      if (frameId) cancelAnimationFrame(frameId); frameId = 0;
      if (runtime) { disposeScene(runtime); runtime = null; }
      if (renderer) {
        renderer.domElement.removeEventListener('webglcontextlost', contextLost);
        renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); renderer = null;
      }
      host.classList.remove('is-ready');
    }
    const intersection = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) { start(); previous = 0; invalidate(); }
      else if (kind !== 'ambient') release();
      else { if (frameId) cancelAnimationFrame(frameId); frameId = 0; }
    }, { rootMargin: '100px 0px' });
    intersection.observe(host);
    const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(host);
    const pointerMove = (event: PointerEvent) => {
      if (!active || settings.current.paused || settings.current.reduced) return;
      const rect = host.getBoundingClientRect();
      pointerInside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      targetMouse.set(THREE.MathUtils.clamp((event.clientX - rect.left) / Math.max(1, rect.width) * 2 - 1, -1, 1), THREE.MathUtils.clamp(1 - (event.clientY - rect.top) / Math.max(1, rect.height) * 2, -1, 1));
    };
    const pointerEnd = (event: PointerEvent) => { if (event.pointerType !== 'mouse') { pointerInside = false; targetMouse.set(0, 0); } };
    const scroll = () => { if (settings.current.reduced && !settings.current.paused && kind !== 'ambient') invalidate(); };
    const visibility = () => {
      if (document.hidden) { if (frameId) cancelAnimationFrame(frameId); frameId = 0; }
      else { previous = 0; invalidate(); }
    };
    window.addEventListener('pointermove', pointerMove, { passive: true });
    window.addEventListener('pointerup', pointerEnd); window.addEventListener('pointercancel', pointerEnd);
    window.addEventListener('scroll', scroll, { passive: true }); document.addEventListener('visibilitychange', visibility);
    return () => {
      destroyed = true; invalidateRef.current = () => {};
      intersection.disconnect(); sizeObserver.disconnect(); release();
      window.removeEventListener('pointermove', pointerMove); window.removeEventListener('pointerup', pointerEnd); window.removeEventListener('pointercancel', pointerEnd);
      window.removeEventListener('scroll', scroll); document.removeEventListener('visibilitychange', visibility);
    };
  }, [kind]);
  return <div ref={hostRef} className={`three-scene three-${kind} ${failed ? 'scene-failed' : ''}`} aria-hidden="true">
    <div className="liquid-fallback"><span /><i /></div>
  </div>;
}
