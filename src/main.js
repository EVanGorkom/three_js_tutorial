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
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 50);

// Earth
const earthTexture = new THREE.TextureLoader().load("./world.png");
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earthGeometry = new THREE.SphereGeometry(18, 64, 64);
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.rotation.z = THREE.MathUtils.degToRad(23.5); 

// Network Group (Container for nodes & edges)
const networkGroup = new THREE.Group();
scene.add(earth);
scene.add(networkGroup);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(ambientLight, directionalLight);

// Create Nodes & Connections
const numNodes = 150;
const sphereRadius = 22;
const connectionDistance = 10;
const nodes = [];
const edges = [];

// Node Styling
const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x66ccff });
const nodeGeometry = new THREE.SphereGeometry(0.5, 16, 16);

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

// Create Nodes (Spheres)
for (let i = 0; i < numNodes; i++) {
  const position = getSpherePosition(sphereRadius);
  const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
  node.position.copy(position);
  nodes.push(node);
  networkGroup.add(node);
}

// Create Connections (Lines)
const edgeMaterial = new THREE.LineBasicMaterial({ color: "white" });

for (let i = 0; i < numNodes; i++) {
  for (let j = i + 1; j < numNodes; j++) {
    if (nodes[i].position.distanceTo(nodes[j].position) < connectionDistance) {
      const points = [nodes[i].position, nodes[j].position];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, edgeMaterial);
      edges.push(line);
      networkGroup.add(line);
    }
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate Earth on its proper axis (counterclockwise)
  earth.rotation.y -= 0.001;

  // Rotate network sphere around Earth
  networkGroup.rotation.y += 0.0008;

  // Add subtle pulsation effect to nodes
  nodes.forEach((node, index) => {
    node.scale.setScalar(1 + 0.05 * Math.sin(Date.now() * 0.002 + index));
  });

  renderer.render(scene, camera);
}
animate();

// Handle Resizing
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
