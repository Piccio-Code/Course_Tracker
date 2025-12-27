"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface IridescenceProps {
  className?: string;
  color?: [number, number, number];
  speed?: number;
  amplitude?: number;
  mouseReact?: boolean;
}

export function Iridescence({
  className,
  color = [0.3, 0.2, 0.5],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
}: IridescenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader - Iridescence effect
    const fragmentShaderSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec3 u_color;
      uniform float u_speed;
      uniform float u_amplitude;

      vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = u_color;
        return a + b * cos(6.28318 * (c * t + d));
      }

      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 5; i++) {
          value += amplitude * smoothNoise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = v_uv;
        vec2 center = uv - 0.5;
        
        float time = u_time * u_speed * 0.3;
        
        // Mouse influence
        vec2 mouseInfluence = (u_mouse - 0.5) * 0.3;
        center += mouseInfluence * u_amplitude;
        
        // Create flowing iridescent pattern
        float angle = atan(center.y, center.x);
        float radius = length(center);
        
        // Layered noise for organic movement
        float n1 = fbm(uv * 3.0 + time * 0.5);
        float n2 = fbm(uv * 5.0 - time * 0.3 + vec2(100.0));
        float n3 = fbm(uv * 7.0 + time * 0.2 + vec2(200.0));
        
        // Combine noises for iridescent effect
        float pattern = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
        pattern += sin(angle * 3.0 + time + radius * 10.0) * 0.1;
        pattern += cos(radius * 15.0 - time * 2.0) * 0.1;
        
        // Color based on pattern
        vec3 col = palette(pattern + time * 0.1);
        
        // Add shimmer
        float shimmer = sin(uv.x * 50.0 + time * 3.0) * sin(uv.y * 50.0 - time * 2.0);
        col += shimmer * 0.03;
        
        // Vignette
        float vignette = 1.0 - radius * 0.5;
        col *= vignette;
        
        // Brightness boost
        col = pow(col, vec3(0.9));
        
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    // Create shaders
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Create geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const colorLocation = gl.getUniformLocation(program, "u_color");
    const speedLocation = gl.getUniformLocation(program, "u_speed");
    const amplitudeLocation = gl.getUniformLocation(program, "u_amplitude");

    // Set static uniforms
    gl.uniform3fv(colorLocation, color);
    gl.uniform1f(speedLocation, speed);
    gl.uniform1f(amplitudeLocation, amplitude);

    // Resize handler
    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.clientWidth * dpr;
      const displayHeight = canvas.clientHeight * dpr;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl!.viewport(0, 0, canvas.width, canvas.height);
        gl!.uniform2f(resolutionLocation, canvas.width, canvas.height);
      }
    }

    // Mouse handler
    function handleMouseMove(e: MouseEvent) {
      if (!canvas || !mouseReact) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    resize();

    // Animation loop
    const startTime = performance.now();

    function render() {
      const time = (performance.now() - startTime) / 1000;
      gl!.uniform1f(timeLocation, time);
      gl!.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [color, speed, amplitude, mouseReact]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full", className)}
    />
  );
}















