import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

// Controls for interactivity
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 50);

// 🌍 Create the Earth Sphere
const earthTexture = new THREE.TextureLoader().load("earth.jpg"); // Ensure the image is in the same directory
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earthGeometry = new THREE.SphereGeometry(15, 32, 32);
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// 🌟 Lighting for the Earth
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(ambientLight, directionalLight);

// 🕸 Create Nodes & Connections
const numNodes = 100;
const sphereRadius = 20;
const connectionDistance = 15;
const nodes = [];
const edges = [];

// Function to Generate Spherical Coordinates
function getSpherePosition(radius) {
  const theta = Math.acos(2 * Math.random() - 1);
  const phi = Math.random() * 2 * Math.PI;
  return new THREE.Vector3(
    radius * Math.sin(theta) * Math.cos(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(theta)
  );
}

// 🟢 Create Nodes (Spheres)
const nodeMaterial = new THREE.MeshBasicMaterial({ color: "cyan" });
const nodeGeometry = new THREE.SphereGeometry(1, 16, 16);

for (let i = 0; i < numNodes; i++) {
  const position = getSpherePosition(sphereRadius);
  const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
  node.position.copy(position);
  nodes.push(node);
  scene.add(node);
}

// 🔗 Create More Connections (Lines)
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

for (let i = 0; i < numNodes; i++) {
  for (let j = i + 1; j < numNodes; j++) {
    if (nodes[i].position.distanceTo(nodes[j].position) < connectionDistance) {
      const points = [nodes[i].position, nodes[j].position];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, edgeMaterial);
      edges.push(line);
      scene.add(line);
    }
  }
}

// 🎥 Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the network
  scene.rotation.y += 0.002;

  // Rotate Earth in the opposite direction
  earth.rotation.y -= 0.002;

  renderer.render(scene, camera);
}
animate();

// 🖥 Handle Resizing
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
