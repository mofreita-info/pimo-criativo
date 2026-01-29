import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type PimoViewerCleanBoxOptions = {
  width?: number;
  height?: number;
  depth?: number;
  position?: { x: number; y: number; z: number };
};

/**
 * Viewer mínimo: cena, câmera, OrbitControls, renderer, luzes, loop.
 * addBox(id, options) adiciona um cubo sem reflow, updateCameraTarget ou updateCanvasSize.
 */
export class PimoViewerClean {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private rafId: number | null = null;
  private boxes = new Map<string, THREE.Mesh>();
  private _setSizeBound = () => this.setSize();

  constructor(container: HTMLElement) {
    if (!container) {
      throw new Error("PimoViewerClean: container is required");
    }
    this.container = container;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a);

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.01, 5000);
    this.camera.position.set(3, 2, 5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(window.devicePixelRatio ?? 1);
    this.renderer.setSize(container.clientWidth || 1, container.clientHeight || 1);
    this.renderer.setClearColor(0x0f172a);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if ("outputColorSpace" in this.renderer) {
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    this.container.appendChild(this.renderer.domElement);

    this.camera.aspect = (this.container.clientWidth || 1) / (this.container.clientHeight || 1);
    this.camera.updateProjectionMatrix();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 0.5;
    this.controls.maxDistance = 2000;

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 10, 5);
    dir.castShadow = true;
    this.scene.add(dir);

    window.addEventListener("resize", this._setSizeBound);
    this.start();
  }

  private setSize(): void {
    if (!this.container) return;
    const w = this.container.clientWidth ?? 1;
    const h = this.container.clientHeight ?? 1;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private start(): void {
    const animate = () => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.rafId = requestAnimationFrame(animate);
    };
    this.rafId = requestAnimationFrame(animate);
  }

  addBox(id: string, options: PimoViewerCleanBoxOptions = {}): boolean {
    if (this.boxes.has(id)) return false;
    const width = Math.max(0.001, options.width ?? 1);
    const height = Math.max(0.001, options.height ?? 1);
    const depth = Math.max(0.001, options.depth ?? 1);
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({
      color: 0xc8b79a,
      roughness: 0.7,
      metalness: 0,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    const pos = options.position ?? { x: 0, y: 0, z: 0 };
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.name = id;
    this.scene.add(mesh);
    this.boxes.set(id, mesh);
    return true;
  }

  dispose(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    window.removeEventListener("resize", this._setSizeBound);
    this.controls.dispose();
    this.boxes.forEach((mesh) => {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      if (mesh.material instanceof THREE.Material) {
        mesh.material.dispose();
      }
    });
    this.boxes.clear();
    this.renderer.dispose();
    const canvas = this.renderer.domElement;
    if (canvas.parentElement) {
      canvas.parentElement.removeChild(canvas);
    }
  }
}
