export default `
precision mediump float;

// default mandatory variables
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

// varyings
// one for our active texture
// and one for the next texture
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
varying vec2 vActiveTextureCoord;
varying vec2 vNextTextureCoord;

// textures matrices
uniform mat4 activeTexMatrix;
uniform mat4 nextTexMatrix;

// custom uniforms
uniform float uTime;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, .85);

    vActiveTextureCoord = (activeTexMatrix * vec4(aTextureCoord, 0, 1.0)).xy;
    vNextTextureCoord = (nextTexMatrix * vec4(aTextureCoord, 0, 1.0)).xy;

    vTextureCoord = aTextureCoord;
    vVertexPosition = aVertexPosition;
}
`;