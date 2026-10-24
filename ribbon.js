// A small native WebGL sculpture. No external runtime, textures or tracking.
export function initRibbon(canvas, control) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
  function fallback() {
    canvas.style.display = 'none'; control.style.display = 'none';
    const ring = document.createElement('div'); ring.className = 'ribbon-fallback'; canvas.after(ring);
  }
  if (!gl) { fallback(); return; }
  const vertex = `attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aUV;
    uniform float uTime; uniform float uAspect; uniform vec2 uPointer;
    varying vec3 vNormal; varying vec3 vPosition; varying vec2 vUV;
    mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
    mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
    mat3 rz(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}
    void main(){mat3 r=rz(-.55+uPointer.x*.07)*rx(.75+uPointer.y*.12)*ry(.38+sin(uTime*.18)*.16);vec3 p=r*aPosition;vNormal=r*aNormal;vPosition=p;vUV=aUV;float d=4.8-p.z;gl_Position=vec4(p.x*2.7/uAspect,p.y*2.7,p.z*.15,d);}`;
  const fragment = `precision mediump float;varying vec3 vNormal;varying vec3 vPosition;varying vec2 vUV;
    void main(){vec3 n=normalize(vNormal);if(!gl_FrontFacing)n=-n;vec3 view=normalize(vec3(0.,0.,4.8)-vPosition);vec3 refl=reflect(-view,n);
      float light=smoothstep(.1,.7,refl.y*.6+refl.x*.75);float strip=pow(max(0.,1.-abs(refl.y-.42)),28.);float rim=pow(1.-abs(dot(n,view)),2.5);
      float sheen=pow(max(0.,dot(n,normalize(vec3(-1.,1.,2.)))),22.);float brush=sin(vUV.x*1950.+vUV.y*16.)*.003;
      float metal=.10+light*.57+strip*.55+rim*.34+sheen*.3+brush;
      vec3 color=vec3(metal*.97,metal*.98,metal*1.02);gl_FragColor=vec4(color,1.);}`;
  function shader(type, source) { const s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('Shader unavailable'); return s; }
  let program;
  try { program = gl.createProgram(); gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex)); gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment)); gl.linkProgram(program); if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('WebGL unavailable'); }
  catch { fallback(); return; }
  gl.useProgram(program);
  const vertices = [], normals = [], uvs = [], indices = []; const segments = 280, widthSegments = 24;
  function position(u, v) { const radius = 1.2 + v * Math.cos(u * 1.5); return [radius * Math.cos(u), radius * Math.sin(u), .26 * Math.sin(2 * u) + v * Math.sin(u * 1.5)]; }
  for (let i = 0; i <= segments; i++) {
    const u = i / segments * Math.PI * 2;
    for (let j = 0; j <= widthSegments; j++) {
      const v = (j / widthSegments - .5) * .9; const p = position(u, v); const pu = position(u + .001, v); const pv = position(u, v + .001);
      const a = pu.map((x, k) => x - p[k]), b = pv.map((x, k) => x - p[k]);
      const n = [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]], len = Math.hypot(...n);
      vertices.push(...p); normals.push(...n.map(x => x / len)); uvs.push(i / segments, j / widthSegments);
      if (i < segments && j < widthSegments) { const k = i * (widthSegments + 1) + j; indices.push(k,k+1,k+widthSegments+1,k+1,k+widthSegments+2,k+widthSegments+1); }
    }
  }
  function attribute(name, data, size) { const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW); const loc = gl.getAttribLocation(program, name); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0); }
  attribute('aPosition', vertices, 3); attribute('aNormal', normals, 3); attribute('aUV', uvs, 2);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  gl.enable(gl.DEPTH_TEST); gl.clearColor(0,0,0,0);
  const timeLocation = gl.getUniformLocation(program, 'uTime'), aspectLocation = gl.getUniformLocation(program, 'uAspect'), pointerLocation = gl.getUniformLocation(program, 'uPointer');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)'); let paused = reduced.matches, visible = true, frame = 0, time = 0, last = 0, pointer = [0,0];
  function render(stamp) {
    frame = 0;
    if (!paused && last) time += Math.min((stamp - last) / 1000, .05); last = stamp;
    const rect = canvas.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 1.75); const w = Math.round(rect.width * dpr), h = Math.round(rect.height * dpr);
    if (w && h) { if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; } gl.viewport(0,0,w,h); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.uniform1f(timeLocation,time); gl.uniform1f(aspectLocation,w/h); gl.uniform2fv(pointerLocation,pointer); gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_SHORT,0); }
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(render);
  }
  function draw() { if (!frame) { last = 0; frame = requestAnimationFrame(render); } }
  function updateControl() { control.setAttribute('aria-pressed',String(paused)); control.setAttribute('aria-label',paused ? 'Play animation' : 'Pause animation'); control.innerHTML = `${paused ? '▷' : 'Ⅱ'} <span>${paused ? 'PLAY MOTION' : 'PAUSE MOTION'}</span>`; }
  control.addEventListener('click',() => { paused = !paused; updateControl(); draw(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; updateControl(); draw(); });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) draw(); }).observe(canvas);
  new ResizeObserver(draw).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) draw(); });
  canvas.addEventListener('pointermove', event => { if (paused || reduced.matches) return; const r = canvas.getBoundingClientRect(); pointer = [(event.clientX-r.left)/r.width-.5,(event.clientY-r.top)/r.height-.5]; draw(); });
  canvas.addEventListener('pointerleave', () => { pointer = [0,0]; draw(); });
  canvas.addEventListener('webglcontextlost',event => { event.preventDefault(); cancelAnimationFrame(frame); paused = true; fallback(); });
  updateControl(); draw();
}
