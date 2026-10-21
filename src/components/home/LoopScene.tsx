"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A slow ring of particles drawn as a closed loop: materials circulating
 * instead of ending in landfill. Loaded lazily; the parent shows an SVG
 * fallback until it is ready, or if WebGL is unavailable.
 */
export default function LoopScene({ onReady, onFail }: { onReady: () => void; onFail: () => void }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      onFail();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 2.2, 7.5);
    camera.lookAt(0, 0, 0);

    // Particles distributed around a torus.
    const count = 2400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const lime = new THREE.Color("#CCFF00");
    const cyan = new THREE.Color("#00E5FF");
    const ivory = new THREE.Color("#F4F0E5");
    for (let i = 0; i < count; i++) {
      const u = (i / count) * Math.PI * 2;
      const v = (i * 2.399963) % (Math.PI * 2); // golden-angle spread
      const R = 2.4;
      const r = 0.35 + ((i * 7919) % 100) / 400;
      positions[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
      positions[i * 3 + 1] = r * Math.sin(v);
      positions[i * 3 + 2] = (R + r * Math.cos(v)) * Math.sin(u);
      const c = i % 9 === 0 ? cyan : i % 3 === 0 ? ivory : lime;
      colors.set([c.r, c.g, c.b], i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geometry, material);
    points.rotation.x = 0.35;
    scene.add(points);

    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Only animate while visible.
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    let frame = 0;
    const clock = new THREE.Clock();
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!visible) return;
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.12;
      points.rotation.z = Math.sin(t * 0.2) * 0.06;
      renderer.render(scene, camera);
    };
    loop();
    onReady();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady, onFail]);

  return <div ref={host} className="h-full w-full [&_canvas]:h-full [&_canvas]:w-full" aria-hidden="true" />;
}
