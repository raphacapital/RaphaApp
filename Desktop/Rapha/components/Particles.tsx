import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  style?: object;
}

const defaultColors: string[] = ["#ffffff", "#ffffff", "#ffffff"];

const hexToRgb = (hex: string): [number, number, number] => {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const Particles: React.FC<ParticlesProps> = ({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  style,
}) => {
  const animationFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const onContextCreate = (gl: any) => {
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
      attribute vec3 position;
      attribute vec4 random;
      attribute vec3 color;
      
      uniform mat4 modelMatrix;
      uniform mat4 viewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uTime;
      uniform float uSpread;
      uniform float uBaseSize;
      uniform float uSizeRandomness;
      
      varying vec4 vRandom;
      varying vec3 vColor;
      
      void main() {
        vRandom = random;
        vColor = color;
        
        vec3 pos = position * uSpread;
        pos.z *= 10.0;
        
        vec4 mPos = modelMatrix * vec4(pos, 1.0);
        float t = uTime;
        mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
        mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
        mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
        
        vec4 mvPos = viewMatrix * mPos;
        gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
        gl_Position = projectionMatrix * mvPos;
      }
    `);
    gl.compileShader(vertexShader);

    // Fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `
      precision highp float;
      
      uniform float uTime;
      uniform float uAlphaParticles;
      varying vec4 vRandom;
      varying vec3 vColor;
      
      void main() {
        vec2 uv = gl_PointCoord.xy;
        float d = length(uv - vec2(0.5));
        
        if(uAlphaParticles < 0.5) {
          if(d > 0.5) {
            discard;
          }
          gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
        } else {
          float circle = smoothstep(0.5, 0.4, d) * 0.8;
          gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
        }
      }
    `);
    gl.compileShader(fragmentShader);

    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Generate particle data
    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = particleColors && particleColors.length > 0 ? particleColors : defaultColors;

    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number, len: number;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }

    // Create buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const randomBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, randomBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, randoms, gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    // Get attribute locations
    const positionLocation = gl.getAttribLocation(program, 'position');
    const randomLocation = gl.getAttribLocation(program, 'random');
    const colorLocation = gl.getAttribLocation(program, 'color');

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'uTime');
    const spreadLocation = gl.getUniformLocation(program, 'uSpread');
    const baseSizeLocation = gl.getUniformLocation(program, 'uBaseSize');
    const sizeRandomnessLocation = gl.getUniformLocation(program, 'uSizeRandomness');
    const alphaParticlesLocation = gl.getUniformLocation(program, 'uAlphaParticles');

    // Set uniforms
    gl.uniform1f(spreadLocation, particleSpread);
    gl.uniform1f(baseSizeLocation, particleBaseSize);
    gl.uniform1f(sizeRandomnessLocation, sizeRandomness);
    gl.uniform1f(alphaParticlesLocation, alphaParticles ? 1 : 0);

    // Create matrices
    const modelMatrix = new Float32Array(16);
    const viewMatrix = new Float32Array(16);
    const projectionMatrix = new Float32Array(16);

    // Simple matrix functions
    const identity = (matrix: Float32Array) => {
      matrix[0] = 1; matrix[4] = 0; matrix[8] = 0; matrix[12] = 0;
      matrix[1] = 0; matrix[5] = 1; matrix[9] = 0; matrix[13] = 0;
      matrix[2] = 0; matrix[6] = 0; matrix[10] = 1; matrix[14] = 0;
      matrix[3] = 0; matrix[7] = 0; matrix[11] = 0; matrix[15] = 1;
    };

    const perspective = (matrix: Float32Array, fov: number, aspect: number, near: number, far: number) => {
      const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
      const rangeInv = 1.0 / (near - far);
      
      matrix[0] = f / aspect; matrix[4] = 0; matrix[8] = 0; matrix[12] = 0;
      matrix[1] = 0; matrix[5] = f; matrix[9] = 0; matrix[13] = 0;
      matrix[2] = 0; matrix[6] = 0; matrix[10] = (near + far) * rangeInv; matrix[14] = near * far * rangeInv * 2;
      matrix[3] = 0; matrix[7] = 0; matrix[11] = -1; matrix[15] = 0;
    };

    const translate = (matrix: Float32Array, x: number, y: number, z: number) => {
      matrix[12] += x;
      matrix[13] += y;
      matrix[14] += z;
    };

    const rotate = (matrix: Float32Array, angle: number, x: number, y: number, z: number) => {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      const len = Math.sqrt(x * x + y * y + z * z);
      
      if (len > 0) {
        x /= len;
        y /= len;
        z /= len;
      }

      const temp = new Float32Array(16);
      temp[0] = x * x * (1 - c) + c;
      temp[1] = y * x * (1 - c) + z * s;
      temp[2] = x * z * (1 - c) - y * s;
      temp[3] = 0;
      temp[4] = x * y * (1 - c) - z * s;
      temp[5] = y * y * (1 - c) + c;
      temp[6] = y * z * (1 - c) + x * s;
      temp[7] = 0;
      temp[8] = x * z * (1 - c) + y * s;
      temp[9] = y * z * (1 - c) - x * s;
      temp[10] = z * z * (1 - c) + c;
      temp[11] = 0;
      temp[12] = 0;
      temp[13] = 0;
      temp[14] = 0;
      temp[15] = 1;

      // Multiply matrices
      const result = new Float32Array(16);
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          result[i * 4 + j] = 
            matrix[i * 4 + 0] * temp[0 * 4 + j] +
            matrix[i * 4 + 1] * temp[1 * 4 + j] +
            matrix[i * 4 + 2] * temp[2 * 4 + j] +
            matrix[i * 4 + 3] * temp[3 * 4 + j];
        }
      }
      for (let i = 0; i < 16; i++) {
        matrix[i] = result[i];
      }
    };

    // Initialize matrices
    identity(modelMatrix);
    identity(viewMatrix);
    translate(viewMatrix, 0, 0, -cameraDistance);
    perspective(projectionMatrix, 15 * Math.PI / 180, width / height, 0.1, 1000);

    // Get matrix uniform locations
    const modelMatrixLocation = gl.getUniformLocation(program, 'modelMatrix');
    const viewMatrixLocation = gl.getUniformLocation(program, 'viewMatrix');
    const projectionMatrixLocation = gl.getUniformLocation(program, 'projectionMatrix');

    // Set matrix uniforms
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

    // Animation loop
    const render = (time: number) => {
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;
      elapsedRef.current += delta * speed;

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Update time uniform
      gl.uniform1f(timeLocation, elapsedRef.current * 0.001);

      // Update model matrix for rotation and movement
      identity(modelMatrix);
      
      if (moveParticlesOnHover) {
        translate(modelMatrix, -mouseRef.current.x * particleHoverFactor, -mouseRef.current.y * particleHoverFactor, 0);
      }

      if (!disableRotation) {
        rotate(modelMatrix, Math.sin(elapsedRef.current * 0.0002) * 0.1, 1, 0, 0);
        rotate(modelMatrix, Math.cos(elapsedRef.current * 0.0005) * 0.15, 0, 1, 0);
        rotate(modelMatrix, elapsedRef.current * 0.01 * speed, 0, 0, 1);
      }

      gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

      // Set up attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, randomBuffer);
      gl.enableVertexAttribArray(randomLocation);
      gl.vertexAttribPointer(randomLocation, 4, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.enableVertexAttribArray(colorLocation);
      gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

      // Draw particles
      gl.drawArrays(gl.POINTS, 0, count);

      gl.endFrameEXP();
      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    animationFrameIdRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
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
    zIndex: 2, // Above the light rays
  },
  glView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default Particles; 