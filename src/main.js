import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";

// Scene & Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls for interaction
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 50);

// Nodes & Connections Data
const numNodes = 100; // Increase for complexity
const sphereRadius = 30;
const nodes = [];
const edges = [];

// Function to Generate Spherical Coordinates
function getSpherePosition(radius) {
  const theta = Math.acos(2 * Math.random() - 1); // Angle from z-axis
  const phi = Math.random() * 2 * Math.PI; // Angle in xy-plane

  return new THREE.Vector3(
    radius * Math.sin(theta) * Math.cos(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(theta)
  );
}

// Create Nodes (Spheres)
const nodeMaterial = new THREE.MeshBasicMaterial({ color: 'cyan' });
const nodeGeometry = new THREE.SphereGeometry(1, 16, 16);

for (let i = 0; i < numNodes; i++) {
  const position = getSpherePosition(sphereRadius);
  const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
  node.position.copy(position);
  nodes.push(node);
  scene.add(node);
}

// Create Connections (Lines) - Connect nearby nodes
const edgeMaterial = new THREE.LineBasicMaterial({ color: 'lightblue' });

for (let i = 0; i < numNodes; i++) {
  for (let j = i + 1; j < numNodes; j++) {
    if (nodes[i].position.distanceTo(nodes[j].position) < 20) {
      // Only connect nearby nodes
      const points = [nodes[i].position, nodes[j].position];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, edgeMaterial);
      edges.push(line);
      scene.add(line);
    }
  }
}

// Blur effect
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  10.5,
  10.4,
  10.85
);
composer.addPass(bloomPass);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the network
  scene.rotation.y += 0.001;

  composer.render(scene, camera);
}
animate();

// Resize Handling
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
