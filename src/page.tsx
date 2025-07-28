'use client';

import * as THREE from 'three';
import { useEffect, useRef } from 'react';

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 50);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const gridHelper = new THREE.GridHelper(100, 20);
    scene.add(gridHelper);

    const dataGroup = new THREE.Group();
    scene.add(dataGroup);

    let time = 0;

    function generateMockOrderData() {
      const entries = [];
      for (let i = 0; i < 50; i++) {
        const price = Math.floor(Math.random() * 100) - 50;
        const quantity = Math.random() * 10;
        entries.push({ price, quantity });
      }
      return entries;
    }

    function addOrderCubes() {
      const orders = generateMockOrderData();

      orders.forEach((order) => {
        const geometry = new THREE.BoxGeometry(1, order.quantity, 1);
        const material = new THREE.MeshStandardMaterial({
          color: order.price >= 0 ? 0x00ff00 : 0xff0000,
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(order.price, order.quantity / 2, time);
        dataGroup.add(cube);
      });

      time += 2;
    }

    const animate = () => {
      requestAnimationFrame(animate);
      dataGroup.rotation.y += 0.002;
      renderer.render(scene, camera);
    };

    const interval = setInterval(() => {
      addOrderCubes();
      if (time > 100) {
        dataGroup.children.splice(0, 50).forEach((mesh) => {
          dataGroup.remove(mesh);
        });
      }
    }, 1000);

    animate();

    return () => {
      clearInterval(interval);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100vw',
        height: '100vh',
        background: 'black',
        overflow: 'hidden',
      }}
    />
  );
}
