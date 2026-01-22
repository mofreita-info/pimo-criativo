import { useRef } from "react";
import * as THREE from "three";
import type { Peca } from "../../core/types";

const SCALE = 0.01;

export default function PecaMesh({ peca }: { peca: Peca }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const largura = peca.dimensoes.largura * SCALE;
  const altura = peca.dimensoes.altura * SCALE;
  const profundidade = peca.dimensoes.profundidade * SCALE;

  const x = peca.posicao.x * SCALE;
  const y = peca.posicao.y * SCALE;
  const z = peca.posicao.z * SCALE;

  const color = peca.cor || "#8B4513";
  const rotation: [number, number, number] = peca.rotacao
    ? [peca.rotacao.x, peca.rotacao.y, peca.rotacao.z]
    : [0, 0, 0];

  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[largura, altura, profundidade]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
    </mesh>
  );
}
