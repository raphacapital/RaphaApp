import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GLView } from "expo-gl";

export type RaysOrigin =
  | "top-center"
  | "top-left"
  | "top-right"
  | "right"
  | "left"
  | "bottom-center"
  | "bottom-right"
  | "bottom-left";

interface LightRaysProps {
  raysOrigin?: RaysOrigin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  style?: object;
}

const DEFAULT_COLOR = "#ffffff";

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [
        parseInt(m[1], 16) / 255,
        parseInt(m[2], 16) / 255,
        parseInt(m[3], 16) / 255,
      ]
    : [1, 1, 1];
};

const getAnchorAndDir = (
  origin: RaysOrigin,
  w: number,
  h: number
): { anchor: [number, number]; dir: [number, number] } => {
  const outside = 0.2;
  switch (origin) {
    case "top-left":
      return { anchor: [0, -outside * h], dir: [0, 1] };
    case "top-right":
      return { anchor: [w, -outside * h], dir: [0, 1] };
    case "left":
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case "right":
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case "bottom-left":
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case "bottom-center":
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case "bottom-right":
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default: // "top-center"
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

const LightRays: React.FC<LightRaysProps> = ({
  raysOrigin = "top-center",
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  mouseInfluence = 0.1,
  noiseAmount = 0.0,
  distortion = 0.0,
  style,
}) => {
  const animationIdRef = useRef<number | null>(null);



  const onContextCreate = (gl: any) => {
    // Get actual GL context dimensions for full screen coverage
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    
    // Set viewport to full screen
    gl.viewport(0, 0, width, height);

    const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

    const frag = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.95 + 0.05 * sin(iTime * speed * 1.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  // Reduced ray strength since we now have 5 separate rays
  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse * 0.8;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  
  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  // Create multiple rays all starting from the same point but with different angles
  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, normalize(finalRayDir + vec2(-0.15, 0.0)), coord, 36.2214, 21.11349,
                           raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, normalize(finalRayDir + vec2(-0.075, 0.0)), coord, 22.3991, 18.0234,
                           raysSpeed);
  vec4 rays3 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 15.6789, 33.4567,
                           raysSpeed);
  vec4 rays4 = vec4(1.0) *
               rayStrength(rayPos, normalize(finalRayDir + vec2(0.075, 0.0)), coord, 44.1234, 12.3456,
                           raysSpeed);
  vec4 rays5 = vec4(1.0) *
               rayStrength(rayPos, normalize(finalRayDir + vec2(0.15, 0.0)), coord, 28.9012, 39.8765,
                           raysSpeed);

  // Make each ray more distinct by using max instead of addition
  fragColor = max(max(max(max(rays1, rays2), rays3), rays4), rays5);

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor  = color;
}`;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [width, height] },
      rayPos: { value: [0, 0] },
      rayDir: { value: [0, 1] },
      raysColor: { value: hexToRgb(raysColor) },
      raysSpeed: { value: raysSpeed },
      lightSpread: { value: lightSpread },
      rayLength: { value: rayLength },
      pulsating: { value: pulsating ? 1.0 : 0.0 },
      fadeDistance: { value: fadeDistance },
      saturation: { value: saturation },
      mousePos: { value: [0.5, 0.5] },
      mouseInfluence: { value: mouseInfluence },
      noiseAmount: { value: noiseAmount },
      distortion: { value: distortion },
    };

    const geometry = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);
    
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);

    const program = gl.createProgram();
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    gl.shaderSource(vertexShader, vert);
    gl.shaderSource(fragmentShader, frag);
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Set all uniforms
    const timeLocation = gl.getUniformLocation(program, 'iTime');
    const resolutionLocation = gl.getUniformLocation(program, 'iResolution');
    const rayPosLocation = gl.getUniformLocation(program, 'rayPos');
    const rayDirLocation = gl.getUniformLocation(program, 'rayDir');
    const colorLocation = gl.getUniformLocation(program, 'raysColor');
    const speedLocation = gl.getUniformLocation(program, 'raysSpeed');
    const spreadLocation = gl.getUniformLocation(program, 'lightSpread');
    const lengthLocation = gl.getUniformLocation(program, 'rayLength');
    const pulsatingLocation = gl.getUniformLocation(program, 'pulsating');
    const fadeLocation = gl.getUniformLocation(program, 'fadeDistance');
    const saturationLocation = gl.getUniformLocation(program, 'saturation');
    const mousePosLocation = gl.getUniformLocation(program, 'mousePos');
    const mouseInfluenceLocation = gl.getUniformLocation(program, 'mouseInfluence');
    const noiseLocation = gl.getUniformLocation(program, 'noiseAmount');
    const distortionLocation = gl.getUniformLocation(program, 'distortion');

    gl.uniform2f(resolutionLocation, width, height);
    gl.uniform3f(colorLocation, ...uniforms.raysColor.value);
    gl.uniform1f(speedLocation, uniforms.raysSpeed.value);
    gl.uniform1f(spreadLocation, uniforms.lightSpread.value);
    gl.uniform1f(lengthLocation, uniforms.rayLength.value);
    gl.uniform1f(pulsatingLocation, uniforms.pulsating.value);
    gl.uniform1f(fadeLocation, uniforms.fadeDistance.value);
    gl.uniform1f(saturationLocation, uniforms.saturation.value);
    gl.uniform2f(mousePosLocation, ...uniforms.mousePos.value);
    gl.uniform1f(mouseInfluenceLocation, uniforms.mouseInfluence.value);
    gl.uniform1f(noiseLocation, uniforms.noiseAmount.value);
    gl.uniform1f(distortionLocation, uniforms.distortion.value);

    const { anchor, dir } = getAnchorAndDir(raysOrigin, width, height);
    gl.uniform2f(rayPosLocation, anchor[0], anchor[1]);
    gl.uniform2f(rayDirLocation, dir[0], dir[1]);

    const loop = (t: number) => {
      // Update time uniform for animation
      gl.uniform1f(timeLocation, t * 0.001);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      gl.flush();
      gl.endFrameEXP();
      
      // Continue animation loop
      animationIdRef.current = requestAnimationFrame(loop);
    };

    // Start the animation loop
    animationIdRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, []);

  return (
    <View style={[styles.container, style]}>
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  glView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default LightRays; 