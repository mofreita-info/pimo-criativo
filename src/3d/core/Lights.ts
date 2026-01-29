import * as THREE from "three";

export type LightsOptions = {
  ambientIntensity?: number;
  hemisphereIntensity?: number;
  /** Luz principal (key) — frontal diagonal; projeta sombra. */
  keyLightIntensity?: number;
  /** Luz de preenchimento (fill) — lado oposto, suaviza sombras. */
  fillLightIntensity?: number;
  /** Luz de contorno (rim) — atrás do módulo, destaca bordas. */
  rimLightIntensity?: number;
};

export class Lights {
  readonly ambient: THREE.AmbientLight;
  readonly hemisphere: THREE.HemisphereLight;
  /** Luz principal: frontal diagonal, intensidade moderada, projeta sombra. */
  readonly keyLight: THREE.DirectionalLight;
  /** Luz de preenchimento: lado oposto, suave, sem sombra. */
  readonly fillLight: THREE.DirectionalLight;
  /** Luz de contorno: atrás do módulo, destaca arestas. */
  readonly rimLight: THREE.DirectionalLight;

  constructor(scene: THREE.Scene, options: LightsOptions = {}) {
    // Ambient reduzido para não “lavar” as cores do MDF
    this.ambient = new THREE.AmbientLight(
      0xffffff,
      options.ambientIntensity ?? 0.22
    );

    this.hemisphere = new THREE.HemisphereLight(
      0xddeeff,
      0x2b2b2b,
      options.hemisphereIntensity ?? 0.4
    );

    // Key light: frontal diagonal, intensidade moderada
    this.keyLight = new THREE.DirectionalLight(
      0xffffff,
      options.keyLightIntensity ?? 0.9
    );
    this.keyLight.position.set(4, 5, 4);
    this.keyLight.castShadow = true;
    // Resolução maior = sombras mais nítidas
    this.keyLight.shadow.mapSize.width = 4096;
    this.keyLight.shadow.mapSize.height = 4096;
    // Suavidade do penumbra (PCF)
    this.keyLight.shadow.radius = 8;
    // Reduz acne e banding (artefactos)
    this.keyLight.shadow.bias = -0.0003;
    this.keyLight.shadow.normalBias = 0.03;
    // Frustum apertado na área do módulo = mais resolução, menos borrão
    this.keyLight.shadow.camera.near = 0.2;
    this.keyLight.shadow.camera.far = 12;
    this.keyLight.shadow.camera.left = -2.2;
    this.keyLight.shadow.camera.right = 2.2;
    this.keyLight.shadow.camera.top = 1.8;
    this.keyLight.shadow.camera.bottom = -1.2;

    // Fill light: lado oposto, suave, sem sombra
    this.fillLight = new THREE.DirectionalLight(
      0xe8f0ff,
      options.fillLightIntensity ?? 0.38
    );
    this.fillLight.position.set(-3, 3, 2.5);

    // Rim light: atrás do módulo, destaca bordas
    this.rimLight = new THREE.DirectionalLight(
      0xffffff,
      options.rimLightIntensity ?? 0.45
    );
    this.rimLight.position.set(-2, 2.5, -4);

    scene.add(
      this.ambient,
      this.hemisphere,
      this.keyLight,
      this.fillLight,
      this.rimLight
    );
  }
}
