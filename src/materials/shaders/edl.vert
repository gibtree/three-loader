// Eye-Dome-Lighting composite pass (GLSL ES 3.00).
// Renders a full-screen quad; `position`/`uv` and the matrix uniforms are
// provided by three.js' ShaderMaterial.

out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
