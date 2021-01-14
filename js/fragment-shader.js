export default `
precision mediump float;

varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
varying vec2 vActiveTextureCoord;
varying vec2 vNextTextureCoord;

// custom uniforms
uniform float uTime;
uniform float PI;

// the texture samplers
uniform sampler2D activeTex;
uniform sampler2D nextTex;

void main() {
    // define transform functions and constants
    vec2 center = vec2(0.5);
    vec2 diff = vTextureCoord - center;
    vec2 dir = normalize(diff);
    float fadeOutScale = cos(min(uTime, 1.9634835) - (PI / 8.0)),
          scaleActive = max(sin(min(1.65 * uTime, (7.0 * PI / 6.0)) - (PI / 8.0)) * 1.5, 1.0),
          scaleNext = max(sin(2.0 * uTime - 1.0), 0.5),
          distance = length(diff),
          rotateX = cos(uTime / PI),
          rotateY = max(-pow(uTime * 0.4, 3.0), -PI / 5.0);
                    
    // rotate and scale active texture
    vec2 rotatedDir = vec2(dir.x  * rotateX - dir.y * rotateY, dir.x * rotateY + dir.y * rotateX);
    vec2 transformedActiveTex = center + rotatedDir * distance / scaleActive;   
    // scale next texture
    vec2 transformedNextTex = center + 0.5 * diff / scaleNext;
    
    // retrieve texel from transformed textures
    vec4 firstDistortedColor = texture2D(activeTex, transformedActiveTex);
    vec4 secondDistortedColor = texture2D(nextTex, transformedNextTex);

    // star shape
    float r = length(diff)*2.0;
    float a = atan(diff.y,diff.x);
    float f = smoothstep(-2.0, 1.0, cos(a*8.0)) * -0.2 + fadeOutScale;
    vec3 starOutline = vec3(1.-smoothstep(fadeOutScale*f, fadeOutScale * (f + 0.5), dot(diff, diff)));

    // mix active and next texture with the oscillating star shape
    vec4 finalColor = mix(secondDistortedColor, firstDistortedColor, starOutline.r);
    finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);
    gl_FragColor = finalColor;
}
`;