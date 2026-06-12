import { GLSL3, Matrix4, ShaderMaterial, Texture } from 'three';
import { IUniform } from './types';

// Algorithm by Christian Boucheny, shader code adapted from CloudCompare.
// see https://github.com/cloudcompare/trunk/tree/master/plugins/qEDL/shaders/EDL

export interface IEDLMaterialUniforms {
  [name: string]: IUniform<any>;
  screenWidth: IUniform<number>;
  screenHeight: IUniform<number>;
  edlStrength: IUniform<number>;
  radius: IUniform<number>;
  opacity: IUniform<number>;
  uProj: IUniform<Matrix4>;
  neighbours: IUniform<Float32Array>;
  colorMap: IUniform<Texture | null>;
}

const DEFAULT_NEIGHBOUR_COUNT = 8;

/**
 * Full-screen composite material for Eye-Dome-Lighting.
 *
 * It is the matched counterpart to `PointCloudMaterial`: render the point
 * cloud(s) with `material.useEDL = true` into a float render target (so the
 * color pass can pack log-depth into the alpha channel), then run this
 * material over a full-screen quad to shade and composite the result.
 */
export class EDLMaterial extends ShaderMaterial {
  vertexShader = require('./shaders/edl.vert').default;
  fragmentShader = require('./shaders/edl.frag').default;

  uniforms: IEDLMaterialUniforms = {
    screenWidth: { type: 'f', value: 0 },
    screenHeight: { type: 'f', value: 0 },
    edlStrength: { type: 'f', value: 1.0 },
    radius: { type: 'f', value: 1.4 },
    opacity: { type: 'f', value: 1.0 },
    uProj: { type: 'Matrix4', value: new Matrix4() },
    neighbours: { type: '2fv', value: new Float32Array(0) },
    colorMap: { type: 't', value: null },
  };

  constructor(neighbourCount: number = DEFAULT_NEIGHBOUR_COUNT) {
    super();

    this.glslVersion = GLSL3;
    this.depthTest = true;
    this.depthWrite = true;
    this.transparent = true;

    this.neighbourCount = neighbourCount;
  }

  private _neighbourCount = 0;

  get neighbourCount(): number {
    return this._neighbourCount;
  }

  set neighbourCount(value: number) {
    if (this._neighbourCount === value) {
      return;
    }

    this._neighbourCount = value;

    const neighbours = new Float32Array(value * 2);
    for (let i = 0; i < value; i++) {
      neighbours[2 * i + 0] = Math.cos((2 * i * Math.PI) / value);
      neighbours[2 * i + 1] = Math.sin((2 * i * Math.PI) / value);
    }

    this.uniforms.neighbours.value = neighbours;
    this.defines = { ...this.defines, NEIGHBOUR_COUNT: value };
    this.needsUpdate = true;
  }
}
