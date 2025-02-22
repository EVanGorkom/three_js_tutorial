import './style.css'
import * as THREE from 'three';

const SCENE = new THREE.Scene();
const CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.IcosahedronGeometry(10);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const d20 = new THREE.Mesh(geometry, material);
SCENE.add(d20);

CAMERA.position.z = 30;

function animate() {
  d20.rotation.x += 0.01;
  d20.rotation.y += 0.01;

  renderer.render(SCENE, CAMERA);
}

animate();