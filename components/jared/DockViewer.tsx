"use client";
// Interactive three.js view of the NFC Thought Dock, built from lib/dockModel.ts.
// Renders on demand (no idle loop). One short intro turn unless reduced motion is on.
import { useEffect, useRef, useState } from "react";
import type * as T from "three";
import { RotateLeftIcon, RotateRightIcon, PhoneIcon } from "@/components/Icons";

type Api = { orbit: (dTheta: number, dPhi: number) => void; zoom: (f: number) => void; reset: () => void; underside: () => void; showPhone: (on: boolean) => void };

const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduce";

export function DockViewer() {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<Api | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [phone, setPhone] = useState(true);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const [THREE, { OrbitControls }, { RoundedBoxGeometry }, model] = await Promise.all([
        import("three"),
        import("three/examples/jsm/controls/OrbitControls.js"),
        import("three/examples/jsm/geometries/RoundedBoxGeometry.js"),
        import("@/lib/dockModel"),
      ]);
      const el = host.current;
      if (disposed || !el) return;

      let renderer: T.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        setStatus("error");
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      const canvas = renderer.domElement;
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "3D model of the NFC Thought Dock with a phone resting in its 65 degree slot. Drag to rotate, scroll or pinch to zoom, or use the buttons below.");
      canvas.className = "block h-full w-full cursor-grab active:cursor-grabbing";
      el.appendChild(canvas);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 1, 3000);
      const target = new THREE.Vector3(0, 58, -6);
      const home = new THREE.Vector3(215, 200, 335);

      const hemi = new THREE.HemisphereLight(0xffffff, 0x8a8a90, 1.6);
      const sun = new THREE.DirectionalLight(0xffffff, 2.2);
      sun.position.set(160, 300, 220);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.radius = 6;
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.6;
      Object.assign(sun.shadow.camera, { left: -160, right: 160, top: 160, bottom: -160, near: 10, far: 700 });
      const rim = new THREE.DirectionalLight(0xffffff, 0.8);
      rim.position.set(-220, 140, -240);
      scene.add(hemi, sun, rim);

      const group = new THREE.Group();
      group.position.set(-model.DOCK.width / 2, 0, model.DOCK.depth / 2); // design z runs toward -Z
      scene.add(group);

      const bodyMat = new THREE.MeshStandardMaterial({ roughness: 0.62, metalness: 0 });
      const edgeMat = new THREE.LineBasicMaterial({ transparent: true });
      for (const g of model.buildDockGeometries()) {
        const m = new THREE.Mesh(g, bodyMat);
        m.castShadow = m.receiveShadow = true;
        group.add(m, new THREE.LineSegments(new THREE.EdgesGeometry(g, 28), edgeMat));
      }
      // NFC tag sticker sitting in its underside pocket (visible from below).
      const tagMat = new THREE.MeshStandardMaterial({ roughness: 0.4 });
      const tag = new THREE.Mesh(new THREE.CylinderGeometry(14.5, 14.5, 0.6, 48), tagMat);
      tag.position.set(model.DOCK.width / 2, 0.7, -model.DOCK.nfc.z);
      group.add(tag);

      const pose = model.phonePose();
      const phoneMat = new THREE.MeshStandardMaterial({ roughness: 0.3, transparent: true, opacity: 0.2, depthWrite: false });
      const phoneMesh = new THREE.Mesh(new RoundedBoxGeometry(pose.size.w, pose.size.h, pose.size.t, 4, 3.5), phoneMat);
      phoneMesh.position.set(...pose.position);
      phoneMesh.rotation.x = pose.tiltX;
      group.add(phoneMesh);

      const groundMat = new THREE.ShadowMaterial({ opacity: 0.12 });
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.05;
      ground.receiveShadow = true;
      scene.add(ground);

      const controls = new OrbitControls(camera, canvas);
      controls.enablePan = false;
      controls.minDistance = 170;
      controls.maxDistance = 900;
      controls.target.copy(target);

      const render = () => renderer.render(scene, camera);
      controls.addEventListener("change", render);

      const theme = () => {
        const cs = getComputedStyle(document.documentElement);
        const v = (n: string) => cs.getPropertyValue(n).trim();
        const dark = new THREE.Color(v("--surface") || "#ffffff").getHSL({ h: 0, s: 0, l: 0 }).l < 0.5;
        bodyMat.color.set(dark ? "#4a4a4e" : "#e6e6eb");
        edgeMat.color.set(v("--text") || "#1d1d1f");
        edgeMat.opacity = dark ? 0.4 : 0.45;
        tagMat.color.set(v("--accent") || "#0071e3");
        phoneMat.color.set(dark ? "#f5f5f7" : "#1d1d1f");
        phoneMat.opacity = dark ? 0.16 : 0.12;
        groundMat.opacity = dark ? 0.5 : 0.12;
        hemi.intensity = dark ? 1.1 : 1.6;
        render();
      };

      const size = () => {
        const w = el.clientWidth, h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        render();
      };

      const place = (pos: T.Vector3) => {
        camera.position.copy(pos);
        controls.target.copy(target);
        controls.update();
        render();
      };

      let raf = 0;
      const stopIntro = () => cancelAnimationFrame(raf);
      controls.addEventListener("start", stopIntro);

      api.current = {
        orbit(dTheta, dPhi) {
          stopIntro();
          const off = camera.position.clone().sub(controls.target);
          const s = new THREE.Spherical().setFromVector3(off);
          s.theta += dTheta;
          s.phi = Math.min(Math.PI - 0.12, Math.max(0.12, s.phi + dPhi));
          off.setFromSpherical(s);
          place(off.add(controls.target));
        },
        zoom(f) {
          stopIntro();
          const off = camera.position.clone().sub(controls.target);
          const len = Math.min(controls.maxDistance, Math.max(controls.minDistance, off.length() * f));
          place(off.setLength(len).add(controls.target));
        },
        reset() { stopIntro(); place(home); },
        underside() { stopIntro(); place(new THREE.Vector3(170, -300, 200)); },
        showPhone(on) { phoneMesh.visible = on; render(); },
      };

      place(home);
      theme();
      size();
      setStatus("ready");

      // One gentle quarter-turn into the home view the first time the viewer is on screen.
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (reduced()) return;
        const off = home.clone().sub(target);
        const s = new THREE.Spherical().setFromVector3(off);
        const end = s.theta, start = end - 0.7;
        const t0 = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - t0) / 1400);
          s.theta = start + (end - start) * (1 - Math.pow(1 - t, 4));
          place(new THREE.Vector3().setFromSpherical(s).add(target));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      }, { threshold: 0.4 });
      io.observe(el);

      const ro = new ResizeObserver(size);
      ro.observe(el);
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", theme);
      const mo = new MutationObserver(theme);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      cleanup = () => {
        stopIntro();
        io.disconnect();
        ro.disconnect();
        mo.disconnect();
        mq.removeEventListener("change", theme);
        controls.dispose();
        scene.traverse((o) => {
          const m = o as T.Mesh;
          m.geometry?.dispose();
          const mat = m.material as T.Material | T.Material[] | undefined;
          (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
        });
        renderer.dispose();
        renderer.forceContextLoss();
        canvas.remove();
        api.current = null;
      };
    })().catch(() => setStatus("error"));
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  const btn = "inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-[14px] font-medium text-text hover-soft disabled:opacity-45";
  const off = status !== "ready";

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-surface sm:aspect-[16/9]">
        <div ref={host} className="absolute inset-0" />
        {status !== "ready" ? (
          <p className="absolute inset-0 grid place-items-center px-6 text-center text-[15px] text-muted" aria-live="polite">
            {status === "loading" ? "Loading 3D model…" : "3D view isn’t available in this browser. The dimensioned drawing below shows every feature."}
          </p>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="3D view controls">
        <button type="button" className={btn} disabled={off} onClick={() => api.current?.orbit(-Math.PI / 8, 0)}>
          <RotateLeftIcon size={18} /> Rotate left
        </button>
        <button type="button" className={btn} disabled={off} onClick={() => api.current?.orbit(Math.PI / 8, 0)}>
          <RotateRightIcon size={18} /> Rotate right
        </button>
        <button type="button" className={btn} disabled={off} onClick={() => api.current?.orbit(0, -Math.PI / 12)}>Tilt up</button>
        <button type="button" className={btn} disabled={off} onClick={() => api.current?.orbit(0, Math.PI / 12)}>Tilt down</button>
        <button type="button" className={btn} disabled={off} onClick={() => api.current?.zoom(0.8)} aria-label="Zoom in" title="Zoom in">+</button>
        <button type="button" className={btn} disabled={off} onClick={() => api.current?.zoom(1.25)} aria-label="Zoom out" title="Zoom out">−</button>
        <button type="button" className={btn} disabled={off} onClick={() => api.current?.underside()}>Show underside</button>
        <button type="button" className={btn} disabled={off} aria-pressed={phone}
          onClick={() => { setPhone(!phone); api.current?.showPhone(!phone); }}>
          <PhoneIcon size={18} /> Phone
        </button>
        <button type="button" className={`${btn} sm:ml-auto`} disabled={off} onClick={() => api.current?.reset()}>Reset view</button>
      </div>
    </div>
  );
}
