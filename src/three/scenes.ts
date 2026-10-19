import * as THREE from 'three';

export type SceneKind = 'ambient' | 'system' | 'craft';
export type Frame = {
  time: number; delta: number; progress: number; stage: number;
  mouse: THREE.Vector2; reduced: boolean; paused: boolean; pointerInside: boolean;
};
export type SceneRuntime = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update: (frame: Frame) => void;
  sample?: () => string;
  resize?: (aspect: number) => void;
  dispose?: () => void;
};
const ivory = '#e4efff';
const copper = '#82b4ff';
const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;
function random(seed = 827) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) | 0; return (seed >>> 0) / 4294967296; };
}
function base(fov = 36): SceneRuntime {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, .1, 100);
  camera.position.set(0, 0, 8);
  return { scene, camera, update: () => {} };
}
function makeDust(count: number, radius: number, color = ivory) {
  const rand = random(190);
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    points[i * 3] = (rand() - .5) * radius * 2;
    points[i * 3 + 1] = (rand() - .5) * radius * 1.5;
    points[i * 3 + 2] = (rand() - .5) * radius * 2;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
  return new THREE.Points(geometry, new THREE.PointsMaterial({ color, size: .016, transparent: true, opacity: .35, depthWrite: false, sizeAttenuation: true }));
}


// The same soft liquid material travels through the opening and the story.
function liquid(mobile: boolean, ambient: boolean): SceneRuntime {
  const runtime = base(36);
  let aspect = 1, scroll = 0;
  // Each story beat has its own silhouette and composition. Reuse the same
  // three meshes while interpolating their transforms and material uniforms.
  const storyForms = [
    // Discover: one large, organic pebble with two small satellites.
    [[-.10, .04, 1.05, .08, 1.10, 1, 1, -.2, '#a9bddc'],
      [.54, .40, .32, 0, 1, 1, 1, .3, '#b9d7ff'],
      [-.52, -.46, .25, .12, 1, 1.1, 1, -.4, '#758bac']],
    // Connect: three separated, flattened layers in a vertical stack.
    [[0, .48, .85, .35, 1.55, .44, .90, -.16, '#c0d6f2'],
      [0, 0, .85, .35, 1.55, .44, .90, -.16, '#7ba7e5'],
      [0, -.48, .85, .35, 1.55, .44, .90, -.16, '#4b6b9c']],
    // Build: rounded blocks assembled into a stable triangular structure.
    [[-.29, -.30, .73, .95, 1, 1, .8, .02, '#7597c8'],
      [.29, -.30, .73, .95, 1, 1, .8, -.02, '#a9caff'],
      [0, .35, .73, .95, 1, 1, .8, .08, '#d0e1f8']],
    // Improve: balanced polished pebbles circulating around an open centre.
    [[0, .49, .61, 0, 1, 1, 1, 0, '#c4dcff'],
      [-.47, -.26, .61, 0, 1, 1, 1, 0, '#82b4ff'],
      [.47, -.26, .61, 0, 1, 1, 1, 0, '#597baa']],
  ].map(forms => forms.map(([x, y, size, shape, sx, sy, sz, rotation, tint]) => ({
    x: Number(x), y: Number(y), size: Number(size), shape: Number(shape),
    stretch: new THREE.Vector3(Number(sx), Number(sy), Number(sz)),
    rotation: Number(rotation), tint: new THREE.Color(String(tint)),
  })));
  const targetPosition = new THREE.Vector3();
  const geometry = new THREE.SphereGeometry(1, mobile ? 40 : 64, mobile ? 28 : 48);
  const layouts = ambient ? [
    { x: .08, y: .66, size: .66, tint: '#8490a8', shape: .12, stretch: new THREE.Vector3(1.3, .8, 1) },
    { x: .66, y: -.12, size: .62, tint: '#a3bde5', shape: 0, stretch: new THREE.Vector3(1, 1, 1) },
    { x: -.82, y: -.72, size: .48, tint: '#858d9f', shape: .82, stretch: new THREE.Vector3(.83, 1, .65) },
    { x: .10, y: -.83, size: .34, tint: '#94add8', shape: 0, stretch: new THREE.Vector3(1, 1, 1) },
    { x: -.78, y: .62, size: .34, tint: '#696f7d', shape: .15, stretch: new THREE.Vector3(.85, 1.1, 1) },
  ].slice(0, mobile ? 3 : 5) : [
    { x: -.12, y: .08, size: 1.1, tint: '#9dafce', shape: .12, stretch: new THREE.Vector3(1.15, 1, 1) },
    { x: .58, y: -.53, size: .37, tint: '#b8c9e5', shape: 0, stretch: new THREE.Vector3(1, 1, 1) },
    { x: -.60, y: .58, size: .33, tint: '#7b869d', shape: .8, stretch: new THREE.Vector3(1, 1.15, .65) },
  ];
  const objects = layouts.map((layout, index) => {
    const uniforms = {
      uTime: { value: 0 }, uShape: { value: layout.shape }, uMorph: { value: index === 1 ? .025 : .15 },
      uTint: { value: new THREE.Color(layout.tint) }, uOpacity: { value: ambient ? .88 : .96 },
      uStretch: { value: layout.stretch.clone() }, uPointer: { value: new THREE.Vector2() },
    };
    const material = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, uniforms,
      vertexShader: `
        uniform float uTime;
        uniform float uShape;
        uniform float uMorph;
        uniform vec3 uStretch;
        varying vec3 vPosition;
        varying vec3 vNormal;
        vec3 deform(vec3 sphere) {
          vec3 rounded = sign(sphere) * pow(abs(sphere), vec3(0.55));
          vec3 p = mix(sphere, rounded, uShape);
          float wave = sin(p.x * 2.2 + uTime * 0.43) * cos(p.y * 1.8 - uTime * 0.31);
          wave += sin(p.z * 2.6 + p.y * 1.4 + uTime * 0.27) * 0.45;
          p += sphere * wave * uMorph;
          return p * uStretch;
        }
        void main() {
          vec3 sphere = normalize(position);
          vec3 p = deform(sphere);
          vec3 axis = abs(sphere.y) > 0.98 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
          vec3 tangent = normalize(cross(sphere, axis));
          vec3 bitangent = cross(sphere, tangent);
          vec3 dx = deform(normalize(sphere + tangent * 0.003)) - p;
          vec3 dy = deform(normalize(sphere + bitangent * 0.003)) - p;
          vNormal = normalize(normalMatrix * normalize(cross(dx, dy)));
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vPosition = mv.xyz;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 uTint;
        uniform float uOpacity;
        uniform vec2 uPointer;
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
          vec3 n = normalize(vNormal);
          vec3 view = normalize(-vPosition);
          vec3 light = normalize(vec3(-0.55 + uPointer.x * 0.15, 0.8 + uPointer.y * 0.12, 1.0));
          float diffuse = max(dot(n, light), 0.0);
          float rim = pow(1.0 - max(dot(n, view), 0.0), 2.5);
          float shine = pow(max(dot(reflect(-light, n), view), 0.0), 22.0);
          vec3 color = mix(vec3(0.016, 0.019, 0.025), uTint, 0.12 + diffuse * 0.58);
          color += rim * mix(vec3(0.24), uTint, 0.5) * 0.3;
          color += vec3(0.72, 0.78, 0.87) * shine * 0.27;
          gl_FragColor = vec4(color, uOpacity);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = index;
    runtime.scene.add(mesh);
    return { mesh, uniforms, layout };
  });
  runtime.resize = value => { aspect = value; };
  runtime.update = frame => {
    const time = frame.reduced ? 0 : frame.time;
    if (!frame.paused && !frame.reduced) scroll = lerp(scroll, window.scrollY / Math.max(1, window.innerHeight), .055);
    const halfHeight = Math.tan(THREE.MathUtils.degToRad(18)) * 8;
    const halfWidth = halfHeight * aspect;
    const stage = clamp(Math.round(frame.stage), 0, 3);
    const blend = frame.reduced || frame.paused ? 1 : 1 - Math.exp(-frame.delta * 6);
    objects.forEach(({ mesh, uniforms, layout }, index) => {
      const seed = index * 1.65;
      if (!ambient) {
        const form = storyForms[stage][index];
        const orbit = stage === 3 ? time * .24 : stage === 0 && index > 0 ? time * .22 : 0;
        const breath = Math.sin(time * .85 + seed);
        const sway = stage === 2 ? Math.sin(time * .55) * .022 : Math.sin(time * .65 + seed) * .04;
        const x = form.x * Math.cos(orbit) - form.y * Math.sin(orbit) + sway;
        const y = form.x * Math.sin(orbit) + form.y * Math.cos(orbit);
        // Keep spacing legible in both tall phone and wide desktop canvases.
        const spanX = Math.min(halfWidth, 2.7);
        targetPosition.set(x * spanX + frame.mouse.x * .06,
          y * halfHeight + Math.sin(time * .75 + (stage === 2 ? 0 : seed)) * .085,
          -index * .18 + Math.sin(time * .6 + seed) * .07);
        mesh.position.lerp(targetPosition, blend);
        const size = form.size * Math.min(1, halfWidth / 1.85) * (1 + breath * (stage === 2 ? .012 : .025));
        mesh.scale.setScalar(lerp(mesh.scale.x, size, blend));
        mesh.rotation.x = lerp(mesh.rotation.x, (stage === 1 ? .32 : .12) + Math.sin(time * .55 + seed) * .12, blend);
        mesh.rotation.y = lerp(mesh.rotation.y, stage === 2 ? .38 + Math.sin(time * .5) * .12 : Math.sin(time * .4 + seed) * .32, blend);
        mesh.rotation.z = lerp(mesh.rotation.z, form.rotation + Math.sin(time * .65 + (stage === 2 ? 0 : seed)) * .065, blend);
        uniforms.uShape.value = lerp(uniforms.uShape.value, form.shape, blend);
        uniforms.uStretch.value.lerp(form.stretch, blend);
        uniforms.uTint.value.lerp(form.tint, blend);
        uniforms.uMorph.value = lerp(uniforms.uMorph.value, stage === 0 ? .16 : stage === 2 ? .015 : .035, blend);
        uniforms.uTime.value = time + seed;
        uniforms.uPointer.value.copy(frame.mouse);
        return;
      }
      const drift = scroll * .5;
      const x = layout.x + Math.sin(drift + seed) * (ambient ? .2 : .06);
      const y = layout.y + Math.sin(drift * .8 + seed) * .15 + Math.sin(time * .24 + seed) * .07;
      mesh.position.set(x * halfWidth + frame.mouse.x * .08, y * halfHeight + frame.mouse.y * .06, -index * .25);
      const size = layout.size * (mobile && ambient ? .8 : 1) * (1 + Math.sin(drift + seed) * .12);
      mesh.scale.setScalar(size);
      mesh.rotation.set(Math.sin(time * .13 + seed) * .14, time * .035 + drift * .22 + seed, Math.sin(time * .16 + seed) * .22);
      uniforms.uTime.value = time + seed;
      uniforms.uPointer.value.copy(frame.mouse);
      uniforms.uShape.value = layout.shape;
      uniforms.uStretch.value.copy(layout.stretch);
    });
  };
  runtime.sample = () => objects.map(({ mesh, uniforms }) => `${mesh.position.x.toFixed(3)},${mesh.position.y.toFixed(3)},${uniforms.uTime.value.toFixed(3)},${uniforms.uShape.value.toFixed(3)}`).join(';');
  return runtime;
}
function craft(mobile: boolean): SceneRuntime {
  const runtime = base(36);
  runtime.camera.position.set(0, .15, 7.8);
  const count = mobile ? 1400 : 2800;
  const rand = random(42);
  const targets = Array.from({ length: 4 }, () => new Float32Array(count * 3));
  const backboneCount = Math.floor(count * .66);
  const latitudeCount = Math.floor(count / 2);
  for (let i = 0; i < count; i++) {
    // Latitude rings and pole-to-pole meridians form a readable particle globe.
    const globeIndex = i < latitudeCount ? i : i - latitudeCount;
    const latitude = i < latitudeCount
      ? ((globeIndex % 9) + 1) / 10 * Math.PI
      : Math.floor(globeIndex / 12) / (Math.ceil((count - latitudeCount) / 12) - 1) * Math.PI;
    const longitude = i < latitudeCount
      ? Math.floor(globeIndex / 9) / (Math.ceil(latitudeCount / 9) - 1) * Math.PI * 2
      : (globeIndex % 12) / 12 * Math.PI * 2;
    targets[0].set([
      Math.sin(latitude) * Math.cos(longitude) * 1.45,
      Math.cos(latitude) * 1.45,
      Math.sin(latitude) * Math.sin(longitude) * 1.45,
    ], i * 3);

    const edge = i % 12; const along = rand() * 2 - 1;
    const level = Math.floor(i / 12) % 4;
    const coords = [[along, -1, -1], [along, -1, 1], [along, 1, -1], [along, 1, 1], [-1, along, -1], [-1, along, 1], [1, along, -1], [1, along, 1], [-1, -1, along], [-1, 1, along], [1, -1, along], [1, 1, along]][edge];
    const factor = .38 + level * .3;
    targets[1].set(coords.map(v => v * factor), i * 3);

    // Original laptop silhouette sampled from the screen, keyboard, and base.
    const part = rand(); let x: number, ly: number, z: number;
    if (part < .52) {
      x = (rand() - .5) * 2.8; ly = -.1 + rand() * 1.85; z = -.6 - ly * .18;
      if (i % 4 === 0) { x = (i % 8 < 4 ? -1 : 1) * 1.4; }
      if (i % 5 === 0) { ly = i % 10 < 5 ? -.1 : 1.75; }
    } else {
      x = (rand() - .5) * 2.95; ly = -.23 + rand() * .05; z = -.6 + rand() * 1.9;
      if (i % 3 === 0) { x = Math.round(x / .2) * .2; z = Math.round(z / .16) * .16; }
    }
    targets[2].set([x, ly - .6, z], i * 3);

    // Two opposing backbones with evenly spaced connecting base-pair rungs.
    // Fewer turns leave enough negative space to read as a double helix.
    if (i < backboneCount) {
      const t = Math.floor(i / 2) / (Math.ceil(backboneCount / 2) - 1);
      const angle = t * Math.PI * 5 + (i % 2) * Math.PI;
      const radius = .73;
      targets[3].set([Math.cos(angle) * radius, (t - .5) * 3.7, Math.sin(angle) * radius], i * 3);
    } else {
      const rungPoint = i - backboneCount;
      const t = (rungPoint % 24) / 23;
      const along = Math.floor(rungPoint / 24) / (Math.ceil((count - backboneCount) / 24) - 1);
      const angle = t * Math.PI * 5;
      const across = (along * 2 - 1) * .73;
      targets[3].set([Math.cos(angle) * across, (t - .5) * 3.7, Math.sin(angle) * across], i * 3);
    }
  }
  const positions = new Float32Array(targets[0]);
  const colors = new Float32Array(count * 3);
  const sparkleRand = random(286);
  const scatterRand = random(712);
  const sparkles = new Float32Array(count);
  const scatterVectors = new Float32Array(count * 2);
  const white = new THREE.Color(ivory); const accent = new THREE.Color(copper);
  for (let i = 0; i < count; i++) {
    const c = i % 13 === 0 ? accent : white;
    colors.set([c.r, c.g, c.b], i * 3);
    sparkles[i] = sparkleRand();
    const scatterAngle = scatterRand() * Math.PI * 2;
    scatterVectors.set([Math.cos(scatterAngle), Math.sin(scatterAngle)], i * 2);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aSparkle', new THREE.BufferAttribute(sparkles, 1));
  geometry.setAttribute('aScatter', new THREE.BufferAttribute(scatterVectors, 2));
  const uniforms = {
    uPixelRatio: { value: Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.5) },
    uPointer: { value: new THREE.Vector2(2, 2) },
    uAspect: { value: 1 },
    uBloom: { value: 0 },
    uBloomRadius: { value: mobile ? .3 : .34 },
    uTime: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({
    vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms,
    vertexShader: `
      varying vec3 vColor;
      varying float vBloom;
      varying float vSparkle;
      attribute float aSparkle;
      attribute vec2 aScatter;
      uniform float uPixelRatio;
      uniform vec2 uPointer;
      uniform float uAspect;
      uniform float uBloom;
      uniform float uBloomRadius;
      uniform float uTime;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec4 clip = projectionMatrix * mv;
        vec2 screen = clip.xy / clip.w;
        vec2 delta = (screen - uPointer) * vec2(uAspect, 1.0);
        float distanceToPointer = length(delta);
        float influence = (1.0 - smoothstep(0.0, uBloomRadius, distanceToPointer)) * uBloom;
        vec2 direction = normalize(delta + vec2(0.0001));
        // A small radial magnification gives the pointer a fisheye-lens character.
        float lens = distanceToPointer * influence * 0.64;
        // Individual points fan outward with a softly varied direction and settle with the hover field.
        vec2 scatterDirection = normalize(direction + aScatter * 0.7);
        float particleSpread = influence * mix(0.018, 0.052, length(aScatter));
        clip.xy += (direction * lens + scatterDirection * particleSpread) * vec2(1.0 / uAspect, 1.0) * clip.w;
        float twinkle = pow(max(0.0, sin(uTime * (2.2 + aSparkle * 2.8) + aSparkle * 37.0)), 9.0);
        vSparkle = twinkle * (0.38 + aSparkle * 0.55) * (0.5 + uBloom * 0.5);
        float pointSize = clamp(17.0 / -mv.z, 1.0, 5.0) * uPixelRatio;
        gl_PointSize = min(pointSize * (1.0 + influence * 0.3 + vSparkle * 1.6), 10.0);
        vBloom = influence;
        gl_Position = clip;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vBloom;
      varying float vSparkle;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        float core = smoothstep(0.5, 0.08, d);
        vec2 ray = abs(gl_PointCoord - vec2(0.5)) * 2.0;
        float sparkleRay = max(exp(-ray.x * 5.5) * exp(-ray.y * 2.2), exp(-ray.y * 5.5) * exp(-ray.x * 2.2));
        float sparkle = sparkleRay * vSparkle * 1.2;
        float glow = exp(-d * d * 17.0) * vBloom * 0.12;
        vec3 particleColor = mix(vColor, vec3(0.78, 0.88, 1.0), min(vBloom * 0.35 + vSparkle * 0.8, 0.75));
        particleColor += vec3(0.5, 0.72, 1.0) * sparkle * 0.8;
        float alpha = clamp(core * (0.84 + vBloom * 0.16 + vSparkle * 0.5) + glow + sparkle * 0.8, 0.0, 1.0);
        gl_FragColor = vec4(particleColor, alpha);
        #include <colorspace_fragment>
      }
    `,
  });
  const points = new THREE.Points(geometry, material); points.frustumCulled = false;
  const group = new THREE.Group(); group.add(points); runtime.scene.add(group);
  runtime.scene.add(makeDust(mobile ? 35 : 80, 4));
  runtime.resize = aspect => { uniforms.uAspect.value = aspect; };
  let bloomStrength = 0;
  runtime.update = frame => {
    const target = targets[clamp(frame.stage, 0, 3)];
    const step = frame.reduced || frame.paused ? 1 : 1 - Math.exp(-frame.delta * 4.2);
    const bloomTarget = frame.pointerInside && !frame.reduced && !frame.paused ? 1 : 0;
    bloomStrength = lerp(bloomStrength, bloomTarget, frame.reduced || frame.paused ? 1 : 1 - Math.exp(-frame.delta * 8));
    uniforms.uPointer.value.copy(frame.mouse);
    uniforms.uBloom.value = bloomStrength;
    uniforms.uTime.value = frame.time;
    for (let i = 0; i < count; i++) {
      const offset = i * 3;
      positions[offset] = lerp(positions[offset], target[offset], step);
      positions[offset + 1] = lerp(positions[offset + 1], target[offset + 1], step);
      positions[offset + 2] = lerp(positions[offset + 2], target[offset + 2], step);
    }
    geometry.attributes.position.needsUpdate = true;
    group.rotation.y = frame.reduced ? -.3 : Math.sin(frame.time * .2) * .3 + frame.mouse.x * .22;
    group.rotation.x = frame.reduced ? .1 : frame.mouse.y * .13;
    if (frame.stage === 0) {
      group.rotation.x += .18;
      if (!frame.reduced) group.rotation.y += frame.time * .14;
    }
    if (frame.stage === 2) { group.rotation.y += -.4; group.rotation.x += .16; }
    if (frame.stage === 3 && !frame.reduced) group.rotation.y += frame.time * .16;
    group.scale.setScalar(frame.stage === 2 ? .96 : 1);
  };
  runtime.sample = () => `${Array.from(positions.slice(0, 12)).map(value => value.toFixed(3)).join(',')};bloom=${bloomStrength.toFixed(2)}`;
  return runtime;
}


export function createScene(kind: SceneKind, mobile: boolean): SceneRuntime {
  if (kind === 'craft') return craft(mobile);
  return liquid(mobile, kind === 'ambient');
}
export function disposeScene(runtime: SceneRuntime) {
  runtime.dispose?.();
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  runtime.scene.traverse(object => {
    const node = object as THREE.Mesh;
    if (node.geometry) geometries.add(node.geometry);
    const list = Array.isArray(node.material) ? node.material : node.material ? [node.material] : [];
    list.forEach(material => {
      materials.add(material);
      Object.values(material).forEach(value => { if (value instanceof THREE.Texture) textures.add(value); });
      if (material instanceof THREE.ShaderMaterial) Object.values(material.uniforms).forEach(uniform => { if (uniform.value instanceof THREE.Texture) textures.add(uniform.value); });
    });
  });
  textures.forEach(texture => texture.dispose());
  geometries.forEach(geometry => geometry.dispose());
  materials.forEach(material => material.dispose());
}
