/*
  PROJECTS STAGE
  Scout (RC plane), Chadermod (3 lb battlebot) and a stand-in RC car,
  drawn with WebGL 2 in two-colour halftone so they look printed on the page.
  Models come from assets/models.js (generated from the CAD files).
*/
(() => {
  const canvas = document.getElementById('stage-canvas');
  const models = window.STAGE_MODELS;
  if (!canvas) return;
  const frameEl = canvas.closest('.stage__frame');
  const gl = canvas.getContext('webgl2', { antialias: true });
  if (!gl || !models) {
    frameEl.classList.add('is-unsupported');
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  /* ---------- Colours come from the page's design tokens ---------- */
  const css = getComputedStyle(document.documentElement);
  const colour = (name) => {
    const hex = css.getPropertyValue(name).trim().replace('#', '');
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  };
  const PAPER = colour('--color-parchment');
  const INK = colour('--color-ink-black');
  const EMBER = colour('--color-ember-orange');
  const CHARCOAL = colour('--color-charcoal');

  /* ---------- Small matrix kit (column-major, as WebGL expects) ---------- */
  const mul = (a, b) => {
    const o = new Float32Array(16);
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
      }
    }
    return o;
  };
  const translate = (x, y, z) => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
  const scale = (s) => new Float32Array([s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, 1]);
  const rotX = (a) => { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]); };
  const rotY = (a) => { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]); };
  const rotZ = (a) => { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); };
  const perspective = (fovy, aspect, near, far) => {
    const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
  };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a) => { const l = Math.hypot(...a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const lookAt = (eye, target) => {
    const z = norm(sub(eye, target));
    const x = norm(cross([0, 1, 0], z));
    const y = cross(z, x);
    return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1]);
  };
  const apply = (m, p) => {
    const x = m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12];
    const y = m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13];
    const z = m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14];
    const w = m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15];
    return [x / w, y / w, z / w, w];
  };

  /* ---------- Shaders ---------- */
  const HALFTONE = `
    float halftone(float darkness, float cellPx) {
      vec2 p = mat2(0.7071, 0.7071, -0.7071, 0.7071) * (gl_FragCoord.xy / cellPx);
      float d = length(fract(p) - 0.5);
      float r = sqrt(clamp(darkness, 0.0, 1.0)) * 0.72;
      return 1.0 - smoothstep(r - 0.07, r + 0.07, d);
    }`;

  const objectVS = `#version 300 es
    in vec3 a_pos;
    in vec3 a_nrm;
    uniform mat4 u_model, u_viewProj;
    uniform vec3 u_offset, u_scale;
    uniform float u_outline;
    out vec3 v_world;
    void main() {
      vec3 p = a_pos * u_scale + u_offset + normalize(a_nrm) * u_outline;
      vec4 w = u_model * vec4(p, 1.0);
      v_world = w.xyz;
      gl_Position = u_viewProj * w;
    }`;

  const objectFS = `#version 300 es
    precision highp float;
    in vec3 v_world;
    uniform vec3 u_eye, u_light, u_paper, u_ink;
    uniform float u_cell, u_base, u_solid;
    out vec4 outColor;
    ${HALFTONE}
    void main() {
      if (u_solid > 0.5) { outColor = vec4(u_ink, 1.0); return; }
      vec3 n = normalize(cross(dFdx(v_world), dFdy(v_world)));
      vec3 toEye = normalize(u_eye - v_world);
      if (dot(n, toEye) < 0.0) n = -n;
      float diffuse = max(dot(n, u_light), 0.0);
      float rim = pow(1.0 - max(dot(n, toEye), 0.0), 3.0);
      float light = clamp(0.12 + 0.88 * diffuse + 0.25 * rim, 0.0, 1.0);
      float darkness = u_base + (1.0 - u_base) * (1.0 - light);
      outColor = vec4(mix(u_paper, u_ink, halftone(darkness, u_cell)), 1.0);
    }`;

  const floorVS = `#version 300 es
    in vec2 a_pos;
    uniform mat4 u_viewProj;
    out vec2 v_xz;
    void main() {
      v_xz = a_pos;
      gl_Position = u_viewProj * vec4(a_pos.x, 0.0, a_pos.y, 1.0);
    }`;

  const floorFS = `#version 300 es
    precision highp float;
    in vec2 v_xz;
    uniform vec3 u_paper, u_line, u_ink;
    uniform vec4 u_shadows[3];
    uniform float u_cell;
    out vec4 outColor;
    ${HALFTONE}
    float grid(vec2 p, float stepSize) {
      vec2 g = abs(fract(p / stepSize - 0.5) - 0.5) * stepSize;
      vec2 w = fwidth(p);
      vec2 l = 1.0 - smoothstep(vec2(0.0), w * 1.2, g);
      return max(l.x, l.y);
    }
    void main() {
      float fade = 1.0 - smoothstep(0.6, 2.0, length(v_xz));
      float density = max(fwidth(v_xz).x, fwidth(v_xz).y);
      float minor = grid(v_xz, 0.1) * 0.16 * (1.0 - smoothstep(0.012, 0.03, density));
      float major = grid(v_xz, 0.5) * 0.36 * (1.0 - smoothstep(0.06, 0.15, density));
      float lines = max(minor, major) * fade;
      float shade = 0.0;
      for (int i = 0; i < 3; i++) {
        vec4 s = u_shadows[i];
        float e = length(v_xz - s.xy) / s.z;
        shade = max(shade, (1.0 - smoothstep(0.25, 1.0, e)) * s.w);
      }
      vec3 c = mix(u_paper, u_line, lines);
      c = mix(c, u_ink, halftone(shade, u_cell) * step(0.02, shade));
      outColor = vec4(c, 1.0);
    }`;

  const compile = (vs, fs) => {
    const program = gl.createProgram();
    [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]].forEach(([type, src]) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      gl.attachShader(program, shader);
    });
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    const uniforms = {};
    for (let i = 0; i < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); i++) {
      const name = gl.getActiveUniform(program, i).name.replace('[0]', '');
      uniforms[name] = gl.getUniformLocation(program, name);
    }
    return { program, uniforms };
  };

  let objectProgram, floorProgram;
  try {
    objectProgram = compile(objectVS, objectFS);
    floorProgram = compile(floorVS, floorFS);
  } catch (error) {
    console.error(error);
    frameEl.classList.add('is-unsupported');
    return;
  }

  /* ---------- Upload the models ---------- */
  const decode = (b64, Type) => {
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    return new Type(bytes.buffer);
  };
  const upload = (part) => {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const attrib = (name, data, type) => {
      const loc = gl.getAttribLocation(objectProgram.program, name);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 3, type, true, 0, 0);
    };
    attrib('a_pos', decode(part.positions, Int16Array), gl.SHORT);
    attrib('a_nrm', decode(part.normals, Int8Array), gl.BYTE);
    const indices = decode(part.indices, Uint16Array);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    return { vao, count: indices.length, offset: part.offset, scale: part.scale };
  };
  const meshes = {};
  Object.entries(models).forEach(([key, parts]) => {
    meshes[key] = Object.fromEntries(parts.map((part) => [part.name, upload(part)]));
  });

  const floorVao = gl.createVertexArray();
  gl.bindVertexArray(floorVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  const R = 3;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-R, -R, R, -R, -R, R, R, R]), gl.STATIC_DRAW);
  const floorLoc = gl.getAttribLocation(floorProgram.program, 'a_pos');
  gl.enableVertexAttribArray(floorLoc);
  gl.vertexAttribPointer(floorLoc, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  /* ---------- Scene ---------- */
  // Each actor: which parts to draw, ink colour per part, and where it is at time t.
  const actors = [
    {
      key: 'car', label: null, shadow: [0.22, 0.4], base: 0.22, outline: 0.004,
      ink: { car: CHARCOAL },
      pose: (t) => {
        const a = t * 0.35;
        const centre = [-0.55, -0.45], r = 0.24;
        const vx = -Math.sin(a), vz = Math.cos(a);
        return { pos: [centre[0] + Math.cos(a) * r, 0, centre[1] + Math.sin(a) * r], yaw: Math.atan2(vz, -vx), pitch: 0, roll: 0, scale: 0.85 };
      },
    },
    {
      key: 'chadermod', label: 'chadermod', shadow: [0.3, 0.55], base: 0.1, outline: 0.0035,
      ink: { chassis: INK },
      pose: (t) => ({
        pos: [0.42, 0, 0.26],
        yaw: 2.4 + 0.35 * Math.sin(t * 0.6) + 0.08 * Math.sin(t * 3.1),
        pitch: 0, roll: 0, scale: 1.6,
      }),
    },
    {
      key: 'scout', label: 'scout', shadow: [0.36, 0.2], base: 0.06, outline: 0.0045,
      ink: { airframe: EMBER, fuselage: INK },
      pose: (t) => ({
        pos: [-0.05, 0.62 + 0.035 * Math.sin(t * 1.1), 0],
        yaw: 0.95 + 0.3 * Math.sin(t * 0.23),
        pitch: 0.05 * Math.sin(t * 0.8),
        roll: 0.2 * Math.sin(t * 0.5),
        scale: 1,
      }),
    },
  ];
  const anchors = { scout: [0, 0.16, 0], chadermod: [0, 0.14, 0] };
  const labels = {};
  frameEl.querySelectorAll('[data-anchor]').forEach((el) => { labels[el.dataset.anchor] = el; });

  const LIGHT = norm([-0.45, 0.85, 0.4]);
  const camera = { yaw: 0.45, pitch: 0.3, target: [0, 0.34, 0], fov: 0.5 };
  let width = 1, height = 1, dpr = 1;
  let time = reduceMotion ? 2 : 0;
  let lastFrame = 0, idleUntil = 0, running = false, inView = false;

  const draw = () => {
    const aspect = width / height;
    const distance = 2.75 * Math.max(1, 1.15 / aspect);
    const eye = [
      camera.target[0] + distance * Math.cos(camera.pitch) * Math.sin(camera.yaw),
      camera.target[1] + distance * Math.sin(camera.pitch),
      camera.target[2] + distance * Math.cos(camera.pitch) * Math.cos(camera.yaw),
    ];
    const viewProj = mul(perspective(camera.fov, aspect, 0.05, 20), lookAt(eye, camera.target));
    const cell = 4.5 * dpr;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(PAPER[0], PAPER[1], PAPER[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    const poses = actors.map((actor) => actor.pose(time));

    // Floor with graph-paper lines and halftone contact shadows
    gl.useProgram(floorProgram.program);
    const fu = floorProgram.uniforms;
    gl.uniformMatrix4fv(fu.u_viewProj, false, viewProj);
    gl.uniform3fv(fu.u_paper, PAPER);
    gl.uniform3fv(fu.u_line, CHARCOAL);
    gl.uniform3fv(fu.u_ink, INK);
    gl.uniform1f(fu.u_cell, cell);
    const shadows = new Float32Array(12);
    poses.forEach((pose, i) => {
      const [radius, strength] = actors[i].shadow;
      shadows.set([pose.pos[0], pose.pos[2], radius, strength], i * 4);
    });
    gl.uniform4fv(fu.u_shadows, shadows);
    gl.disable(gl.CULL_FACE);
    gl.bindVertexArray(floorVao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Models: an ink outline pass (inverted hull), then the halftone fill
    gl.useProgram(objectProgram.program);
    const ou = objectProgram.uniforms;
    gl.uniformMatrix4fv(ou.u_viewProj, false, viewProj);
    gl.uniform3fv(ou.u_eye, eye);
    gl.uniform3fv(ou.u_light, LIGHT);
    gl.uniform3fv(ou.u_paper, PAPER);
    gl.uniform1f(ou.u_cell, cell);
    gl.enable(gl.CULL_FACE);

    actors.forEach((actor, i) => {
      const pose = poses[i];
      const model = mul(
        mul(translate(...pose.pos), rotY(pose.yaw)),
        mul(mul(rotZ(pose.pitch), rotX(pose.roll)), scale(pose.scale))
      );
      gl.uniformMatrix4fv(ou.u_model, false, model);
      gl.uniform1f(ou.u_base, actor.base);
      Object.entries(meshes[actor.key]).forEach(([name, mesh]) => {
        gl.uniform3fv(ou.u_offset, mesh.offset);
        gl.uniform3fv(ou.u_scale, mesh.scale);
        gl.uniform3fv(ou.u_ink, actor.ink[name] || INK);
        gl.bindVertexArray(mesh.vao);

        gl.cullFace(gl.FRONT);
        gl.uniform1f(ou.u_solid, 1);
        gl.uniform1f(ou.u_outline, actor.outline / pose.scale);
        gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);

        gl.disable(gl.CULL_FACE);
        gl.uniform1f(ou.u_solid, 0);
        gl.uniform1f(ou.u_outline, 0);
        gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
        gl.enable(gl.CULL_FACE);
      });

      // Pin the HTML label to the model
      const label = actor.label && labels[actor.label];
      if (label) {
        const p = apply(mul(viewProj, model), anchors[actor.label]);
        const x = (p[0] * 0.5 + 0.5) * width;
        const y = (1 - (p[1] * 0.5 + 0.5)) * height;
        label.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        label.hidden = p[3] <= 0;
      }
    });
    gl.bindVertexArray(null);
  };

  const tick = (now) => {
    if (!running) return;
    const dt = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0;
    lastFrame = now;
    time += dt;
    if (!dragging && now > idleUntil) camera.yaw += dt * 0.09;
    draw();
    requestAnimationFrame(tick);
  };
  const start = () => {
    if (running || reduceMotion || !inView || document.hidden) return;
    running = true;
    lastFrame = 0;
    requestAnimationFrame(tick);
  };
  const stop = () => { running = false; };

  const resize = () => {
    const box = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, box.width);
    height = Math.max(1, box.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    draw();
  };

  /* ---------- Drag or arrow keys to turn the camera ---------- */
  let dragging = false, lastX = 0, lastY = 0;
  canvas.addEventListener('pointerdown', (event) => {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
    frameEl.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    camera.yaw -= (event.clientX - lastX) * 0.008;
    camera.pitch = clamp(camera.pitch + (event.clientY - lastY) * 0.005, 0.05, 1.0);
    lastX = event.clientX;
    lastY = event.clientY;
    if (!running) draw();
  });
  const endDrag = () => {
    dragging = false;
    idleUntil = performance.now() + 2500;
    frameEl.classList.remove('is-dragging');
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('keydown', (event) => {
    const turns = { ArrowLeft: [0.15, 0], ArrowRight: [-0.15, 0], ArrowUp: [0, 0.08], ArrowDown: [0, -0.08] };
    const turn = turns[event.key];
    if (!turn) return;
    event.preventDefault();
    camera.yaw += turn[0];
    camera.pitch = clamp(camera.pitch + turn[1], 0.05, 1.0);
    idleUntil = performance.now() + 2500;
    if (!running) draw();
  });

  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);
  resize();
  frameEl.classList.add('is-ready');

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start(); else stop();
    }).observe(canvas);
  } else {
    inView = true;
    start();
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
})();
