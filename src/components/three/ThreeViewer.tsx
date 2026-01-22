import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

type ThreeViewerProps = {
  modelUrl: string;
  autoRotate?: boolean;
  height?: number | string;
  backgroundColor?: string;
  showGrid?: boolean;
  showFloor?: boolean;
  colorize?: boolean;
  wireframe?: boolean;
  cameraPreset?: "perspective" | "top" | "front" | "left";
};

let sharedRenderer: THREE.WebGLRenderer | null = null;

const getSharedRenderer = () => {
  if (!sharedRenderer) {
    sharedRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    sharedRenderer.shadowMap.enabled = true;
    sharedRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  return sharedRenderer;
};

const buildPastelColor = (seed: number) => {
  const hue = (seed * 0.61803398875) % 1;
  return new THREE.Color().setHSL(hue, 0.35, 0.55);
};

const disposeScene = (root: THREE.Object3D) => {
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose?.();
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose?.());
      } else {
        child.material?.dispose?.();
      }
    }
  });
};

function Model({
  url,
  colorize,
  wireframe,
  onCentered,
}: {
  url: string;
  colorize: boolean;
  wireframe: boolean;
  onCentered: (box: THREE.Box3) => void;
}) {
  const { scene } = useGLTF(url);

  const coloredScene = useMemo(() => {
    const cloned = scene.clone(true);
    let index = 0;
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.frustumCulled = true;
        child.castShadow = false;
        child.receiveShadow = false;
        if (colorize) {
          const color = buildPastelColor(index);
          index += 1;
          if (Array.isArray(child.material)) {
            child.material = child.material.map((material) => {
              const next = material.clone();
              if ("color" in next) {
                next.color = color;
              }
              return next;
            });
          } else {
            const next = child.material.clone();
            if ("color" in next) {
              next.color = color;
            }
            child.material = next;
          }
        }
      }
    });
    return cloned;
  }, [scene, colorize]);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(coloredScene);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    coloredScene.position.sub(center);
    onCentered(box);
  }, [coloredScene, onCentered]);

  useEffect(() => {
    coloredScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            if ("wireframe" in material) {
              material.wireframe = wireframe;
            }
          });
        } else if ("wireframe" in child.material) {
          child.material.wireframe = wireframe;
        }
      }
    });
  }, [coloredScene, wireframe]);

  useEffect(() => {
    return () => {
      disposeScene(coloredScene);
    };
  }, [coloredScene]);

  return <primitive object={coloredScene} />;
}

function ViewerScene({
  modelUrl,
  autoRotate,
  resetToken,
  showGrid,
  showFloor,
  colorize,
  wireframe,
  cameraPreset,
  backgroundColor,
  controlsRef,
  cameraRef,
  rendererRef,
}: {
  modelUrl: string;
  autoRotate: boolean;
  resetToken: number;
  showGrid: boolean;
  showFloor: boolean;
  colorize: boolean;
  wireframe: boolean;
  cameraPreset: "perspective" | "top" | "front" | "left";
  backgroundColor: string;
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  cameraRef: React.MutableRefObject<THREE.Camera | null>;
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>;
}) {
  const { camera, gl, scene } = useThree();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    cameraRef.current = camera;
    rendererRef.current = gl as THREE.WebGLRenderer;
    camera.position.set(2, 2, 2);
    camera.lookAt(0, 0, 0);
    const controls = controlsRef.current as unknown as {
      target?: THREE.Vector3;
      update?: () => void;
    } | null;
    if (controls?.target) {
      controls.target.set(0, 0, 0);
      controls.update?.();
    }
  }, [camera, resetToken, controlsRef, cameraRef, rendererRef]);

  useEffect(() => {
    if ("outputColorSpace" in gl) {
      (gl as THREE.WebGLRenderer).outputColorSpace = THREE.SRGBColorSpace;
    }
    (gl as THREE.WebGLRenderer).toneMapping = THREE.ACESFilmicToneMapping;
  }, [gl]);

  useEffect(() => {
    scene.background = new THREE.Color(backgroundColor);
  }, [scene, backgroundColor]);

  useEffect(() => {
    const tick = () => {
      const controls = controlsRef.current as unknown as { update?: () => void } | null;
      controls?.update?.();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [controlsRef]);

  const applyPreset = (preset: "perspective" | "top" | "front" | "left") => {
    if (preset === "top") {
      camera.position.set(0, 5, 0);
    } else if (preset === "front") {
      camera.position.set(0, 1.5, 4);
    } else if (preset === "left") {
      camera.position.set(-4, 1.5, 0);
    } else {
      camera.position.set(2, 2, 2);
    }
    camera.lookAt(0, 0, 0);
    const controls = controlsRef.current as unknown as {
      target?: THREE.Vector3;
      update?: () => void;
    } | null;
    if (controls?.target) {
      controls.target.set(0, 0, 0);
      controls.update?.();
    }
  };

  useEffect(() => {
    applyPreset(cameraPreset);
  }, [cameraPreset]);

  return (
    <>
      <hemisphereLight intensity={0.7} />
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[5, 6, 4]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {showGrid && <gridHelper args={[10, 10, "#334155", "#1f2937"]} />}
      {showFloor && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      )}
      {modelUrl ? (
        <Suspense fallback={null}>
          <Model
            url={modelUrl}
            colorize={colorize}
            wireframe={wireframe}
            onCentered={(box) => {
              const size = new THREE.Vector3();
              const center = new THREE.Vector3();
              box.getSize(size);
              box.getCenter(center);
              const maxDim = Math.max(size.x, size.y, size.z, 1);
              const fov = (camera as THREE.PerspectiveCamera).fov ?? 45;
              const distance =
                maxDim / (2 * Math.tan((fov * Math.PI) / 360)) + maxDim * 0.6;
              camera.position.set(distance, distance, distance);
              camera.lookAt(0, 0, 0);
              const controls = controlsRef.current as unknown as {
                target?: THREE.Vector3;
                update?: () => void;
              } | null;
              if (controls?.target) {
                controls.target.set(0, 0, 0);
                controls.update?.();
              }
            }}
          />
        </Suspense>
      ) : null}
      <OrbitControls
        ref={controlsRef}
        enableDamping={true}
        dampingFactor={0.08}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        minDistance={0.5}
        maxDistance={50}
        panSpeed={0.6}
        autoRotate={autoRotate}
        autoRotateSpeed={1.0}
      />
    </>
  );
}

export default function ThreeViewer({
  modelUrl,
  autoRotate = false,
  height = 300,
  backgroundColor = "#1e293b",
  showGrid = true,
  showFloor = true,
  colorize = true,
  wireframe = false,
  cameraPreset = "perspective",
}: ThreeViewerProps) {
  const [resetToken, setResetToken] = useState(0);
  const [wireframeMode, setWireframeMode] = useState(wireframe);
  const [activePreset, setActivePreset] = useState(cameraPreset);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    setWireframeMode(wireframe);
  }, [wireframe]);

  useEffect(() => {
    setActivePreset(cameraPreset);
  }, [cameraPreset]);

  const handleSnapshot = () => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const url = renderer.domElement.toDataURL("image/png");
    const win = window.open();
    if (win) {
      win.document.write(`<img src="${url}" style="max-width:100%"/>`);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
        background: backgroundColor,
        borderRadius: "var(--radius)",
        overflow: "hidden",
      }}
    >
      <Canvas shadows camera={{ position: [2, 2, 2], fov: 45 }} gl={getSharedRenderer()}>
        <ViewerScene
          modelUrl={modelUrl}
          autoRotate={autoRotate}
          resetToken={resetToken}
          showGrid={showGrid}
          showFloor={showFloor}
          colorize={colorize}
          wireframe={wireframeMode}
          cameraPreset={activePreset}
          backgroundColor={backgroundColor}
          controlsRef={controlsRef}
          cameraRef={cameraRef}
          rendererRef={rendererRef}
        />
      </Canvas>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          gap: 6,
          background: "rgba(0,0,0,0.25)",
          padding: "6px 8px",
          borderRadius: 6,
        }}
      >
        <button
          onClick={() => setWireframeMode((prev) => !prev)}
          style={{
            background: "rgba(15,23,42,0.7)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "var(--text-main)",
            padding: "4px 6px",
            fontSize: 11,
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Wireframe
        </button>
        <button
          onClick={handleSnapshot}
          style={{
            background: "rgba(15,23,42,0.7)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "var(--text-main)",
            padding: "4px 6px",
            fontSize: 11,
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          📸 Snapshot
        </button>
        {(
          [
            { label: "Top", value: "top" },
            { label: "Front", value: "front" },
            { label: "Left", value: "left" },
            { label: "Persp", value: "perspective" },
          ] as { label: string; value: "top" | "front" | "left" | "perspective" }[]
        ).map((item) => (
          <button
            key={item.value}
            onClick={() => setActivePreset(item.value)}
            style={{
              background: "rgba(15,23,42,0.7)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--text-main)",
              padding: "4px 6px",
              fontSize: 11,
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={() => setResetToken((prev) => prev + 1)}
          style={{
            background: "rgba(15,23,42,0.7)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "var(--text-main)",
            padding: "4px 6px",
            fontSize: 11,
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Reset Camera
        </button>
      </div>
    </div>
  );
}
