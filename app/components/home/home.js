'use client'
import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { Plane } from 'three'
THREE.ColorManagement.enabled = false
//import starImg from '/textures/1.png'
export default function ThreeJsScene() {
  useEffect(() => {
    //Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const star = textureLoader.load('/textures/star.png')
    // Debug
    const gui = new dat.GUI();

    // Canvas
    const canvas = document.querySelector('canvas.webgl');

    // Scene
    const scene = new THREE.Scene();

    // Objects
    const geometry = new THREE.SphereGeometry(0.7,32);

    //background particles 
    const particlesGeometry = new THREE.BufferGeometry;
    const particlesCount = 5000;

    let positions = new Float32Array(particlesCount*3);
    for (let i=0; i<particlesCount*3; i++){
    positions[i] = (Math.random() - 0.5 )* 5;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions,3))
    // Materials
    const material = new THREE.PointsMaterial({ 
       size: 0.005

     });

     const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005, 
        transparent: true,
        map: star,

     })

    //particlesMaterial.alphaMap = star;
    particlesMaterial.blending = THREE.AdditiveBlendingß
    // Mesh
    const sphere = new THREE.Points(geometry, material);
    const particlesMesh = new THREE.Points(particlesGeometry,particlesMaterial )
    scene.add(sphere,particlesMesh);

    // Lights
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(0, 0, 2);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    //mouse

    document.addEventListener('mousemove', animateParticles)

    let mouseX = 0;
    let mouseY = 0;

    function animateParticles(event){
        mouseX = event.clientX 
        mouseY = event.clientY
    }
    /**
     * Animate
     */
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update objects
      sphere.rotation.y = 0.08 * elapsedTime;
      particlesMesh.rotation.y = -.1 * elapsedTime 

      if(mouseX > 0){
        particlesMesh.rotation.x = mouseY * (elapsedTime* 0.0002)
        particlesMesh.rotation.y = - mouseX * (elapsedTime* 0.0002)
        //particlesMesh.rotation.x = mouseX * (elapsedTime* 0.0008)  
      }
      
      // Update Orbital Controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }, []);

  return <canvas className="webgl"></canvas>;
}
