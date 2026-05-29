"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Adaptive shader: low-quality path for mobile/low-end devices
function buildFragmentShader(quality: "high" | "medium" | "low") {
  const nsteps = quality === "high" ? 300 : quality === "medium" ? 180 : 100;
  const step = quality === "low" ? 0.1 : 0.06;
  // On low quality, disable expensive relativistic effects
  const useDoppler = quality !== "low";
  const useLorentz = quality !== "low";
  const useBeaming = quality !== "low";

  return `
#define STEP ${step.toFixed(4)}
#define NSTEPS ${nsteps}
#define PI 3.141592653589793238462643383279
#define DEG_TO_RAD (PI/180.0)
#define ROT_Z(a) mat3(cos(a), -sin(a), 0.0, sin(a), cos(a), 0.0, 0.0, 0.0, 1.0)

uniform float time;
uniform vec2 resolution;
uniform vec3 cam_pos;
uniform vec3 cam_dir;
uniform vec3 cam_up;
uniform float fov;
uniform vec3 cam_vel;

const float MIN_TEMPERATURE = 1000.0;
const float TEMPERATURE_RANGE = 39000.0;

uniform bool accretion_disk;
uniform bool use_disk_texture;
const float DISK_IN = 2.0;
const float DISK_WIDTH = 4.0;

uniform sampler2D bg_texture;
uniform sampler2D star_texture;
uniform sampler2D disk_texture;

vec2 square_frame(vec2 screen_size){
  vec2 position = 2.0 * (gl_FragCoord.xy / screen_size.xy) - 1.0;
  return position;
}

vec2 to_spherical(vec3 cartesian_coord){
  vec2 uv = vec2(atan(cartesian_coord.z,cartesian_coord.x), asin(cartesian_coord.y));
  uv *= vec2(1.0/(2.0*PI), 1.0/PI);
  uv += 0.5;
  return uv;
}

${useLorentz ? `
vec3 lorentz_transform_velocity(vec3 u, vec3 v){
  float speed = length(v);
  if (speed > 0.0){
    float gamma = 1.0/sqrt(1.0-dot(v,v));
    float denominator = 1.0 - dot(v,u);
    vec3 new_u = (u/gamma - v + (gamma/(gamma+1.0)) * dot(u,v)*v)/denominator;
    return new_u;
  }
  return u;
}` : ``}

vec3 temp_to_color(float temp_kelvin){
  vec3 color;
  temp_kelvin = clamp(temp_kelvin, 1000.0, 40000.0) / 100.0;
  if (temp_kelvin <= 66.0){
    color.r = 255.0;
    color.g = temp_kelvin;
    color.g = 99.4708025861 * log(color.g) - 161.1195681661;
    if (color.g < 0.0) color.g = 0.0;
    if (color.g > 255.0) color.g = 255.0;
  } else {
    color.r = temp_kelvin - 60.0;
    if (color.r < 0.0) color.r = 0.0;
    color.r = 329.698727446 * pow(color.r, -0.1332047592);
    if (color.r < 0.0) color.r = 0.0;
    if (color.r > 255.0) color.r = 255.0;
    color.g = temp_kelvin - 60.0;
    if (color.g < 0.0) color.g = 0.0;
    color.g = 288.1221695283 * pow(color.g, -0.0755148492);
    if (color.g > 255.0) color.g = 255.0;
  }
  if (temp_kelvin >= 66.0){
    color.b = 255.0;
  } else if (temp_kelvin <= 19.0){
    color.b = 0.0;
  } else {
    color.b = temp_kelvin - 10.0;
    color.b = 138.5177312231 * log(color.b) - 305.0447927307;
    if (color.b < 0.0) color.b = 0.0;
    if (color.b > 255.0) color.b = 255.0;
  }
  color /= 255.0;
  return color;
}

void main() {
  float uvfov = tan(fov / 2.0 * DEG_TO_RAD);
  vec2 uv = square_frame(resolution);
  uv *= vec2(resolution.x/resolution.y, 1.0);
  vec3 forward = normalize(cam_dir);
  vec3 up = normalize(cam_up);
  vec3 nright = normalize(cross(forward, up));
  up = cross(nright, forward);

  vec3 pixel_pos = cam_pos + forward + nright*uv.x*uvfov + up*uv.y*uvfov;
  vec3 ray_dir = normalize(pixel_pos - cam_pos);

  ${useLorentz ? `ray_dir = lorentz_transform_velocity(ray_dir, cam_vel);` : ``}

  vec4 color = vec4(0.0,0.0,0.0,1.0);
  vec3 point = cam_pos;
  vec3 velocity = ray_dir;
  vec3 c = cross(point,velocity);
  float h2 = dot(c,c);

  float ray_gamma = 1.0/sqrt(1.0-dot(cam_vel,cam_vel));
  float ray_doppler_factor = ray_gamma * (1.0 + dot(ray_dir, -cam_vel));
  float ray_intensity = 1.0;
  ${useBeaming ? `ray_intensity /= pow(ray_doppler_factor, 3.0);` : ``}

  vec3 oldpoint;
  float distance_val = length(point);

  for (int i=0; i<NSTEPS; i++){
    oldpoint = point;
    point += velocity * STEP;
    vec3 accel = -1.5 * h2 * point / pow(dot(point,point),2.5);
    velocity += accel * STEP;
    distance_val = length(point);

    bool horizon_mask = distance_val < 1.0 && length(oldpoint) > 1.0;
    if (horizon_mask) {
      color += vec4(0.0,0.0,0.0,1.0);
      break;
    }

    if (accretion_disk){
      if (oldpoint.y * point.y < 0.0){
        float lambda = -oldpoint.y/velocity.y;
        vec3 intersection = oldpoint + lambda*velocity;
        float r = length(intersection);
        if (DISK_IN <= r && r <= DISK_IN+DISK_WIDTH){
          float phi = atan(intersection.x, intersection.z);
          vec3 disk_velocity = vec3(-intersection.x, 0.0, intersection.z)/sqrt(2.0*(r-1.0))/(r*r);
          phi -= time;
          phi = mod(phi, PI*2.0);
          float disk_gamma = 1.0/sqrt(1.0-dot(disk_velocity, disk_velocity));
          float disk_doppler_factor = disk_gamma*(1.0+dot(ray_dir/distance_val, disk_velocity));

          if (use_disk_texture){
            vec2 tex_coord = vec2(mod(phi,2.0*PI)/(2.0*PI),1.0-(r-DISK_IN)/(DISK_WIDTH));
            vec4 disk_color = texture2D(disk_texture, tex_coord) ${useDoppler ? `/ (ray_doppler_factor * disk_doppler_factor)` : ``};
            float disk_alpha = clamp(dot(disk_color.rgb,disk_color.rgb)/4.5,0.0,1.0);
            ${useBeaming ? `disk_alpha /= pow(disk_doppler_factor,3.0);` : ``}
            color += vec4(disk_color.rgb, 1.0)*disk_alpha;
          } else {
            float disk_temperature = 10000.0*(pow(r/DISK_IN, -3.0/4.0));
            ${useDoppler ? `disk_temperature /= ray_doppler_factor*disk_doppler_factor;` : ``}
            vec3 disk_color = temp_to_color(disk_temperature);
            float disk_alpha = clamp(dot(disk_color,disk_color)/3.0,0.0,1.0);
            ${useBeaming ? `disk_alpha /= pow(disk_doppler_factor,3.0);` : ``}
            color += vec4(disk_color, 1.0)*disk_alpha;
          }
        }
      }
    }
  }

  if (distance_val > 1.0){
    ray_dir = normalize(point - oldpoint);
    vec2 tex_coord = to_spherical(ray_dir * ROT_Z(45.0 * DEG_TO_RAD));
    vec4 star_color = texture2D(star_texture, tex_coord);
    if (star_color.g > 0.0){
      float star_temperature = (MIN_TEMPERATURE + TEMPERATURE_RANGE*star_color.r);
      float star_velocity = star_color.b - 0.5;
      float star_doppler_factor = sqrt((1.0+star_velocity)/(1.0-star_velocity));
      ${useDoppler ? `star_temperature /= ray_doppler_factor*star_doppler_factor;` : ``}
      color += vec4(temp_to_color(star_temperature),1.0) * star_color.g;
    }
    color += texture2D(bg_texture, tex_coord) * 0.25;
  }

  color = color / (1.0 + color);
  color = pow(color, vec4(1.0 / 2.2));
  gl_FragColor = vec4(color.rgb * ray_intensity, 1.0);
}
`;
}

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

function BlackHoleShader({ quality }: { quality: "high" | "medium" | "low" }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  // Resolution captured once; updated only on window resize
  const resolutionRef = useRef(
    typeof window !== "undefined"
      ? new THREE.Vector2(window.innerWidth, window.innerHeight)
      : new THREE.Vector2(1000, 1000)
  );

  // Build fragment shader once per quality tier (memoized)
  const fragmentShader = useMemo(() => buildFragmentShader(quality), [quality]);

  const uniforms = useMemo(
    () => ({
      time: { value: 0.0 },
      resolution: { value: resolutionRef.current },
      accretion_disk: { value: true },
      use_disk_texture: { value: true },
      lorentz_transform: { value: quality !== "low" },
      doppler_shift: { value: quality !== "low" },
      beaming: { value: quality === "high" },
      cam_pos: { value: new THREE.Vector3(0, 0.5, -12.0) },
      cam_vel: { value: new THREE.Vector3(0, 0, 0) },
      cam_dir: { value: new THREE.Vector3(0, -0.05, 1.0).normalize() },
      cam_up: { value: new THREE.Vector3(0, 1, 0) },
      fov: { value: 60.0 },
      bg_texture: { value: null },
      star_texture: { value: null },
      disk_texture: { value: null },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    // Use WebP texture if available (with PNG fallback)
    loader.load("/textures/milkyway.jpg", (t) => {
      t.magFilter = THREE.LinearFilter;
      t.minFilter = THREE.LinearFilter;
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      if (materialRef.current) materialRef.current.uniforms.bg_texture.value = t;
    });

    loader.load("/textures/star_noise.png", (t) => {
      t.magFilter = THREE.LinearFilter;
      t.minFilter = THREE.LinearFilter;
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      if (materialRef.current) materialRef.current.uniforms.star_texture.value = t;
    });

    // Use WebP if supported, fallback to PNG
    const diskSrc = "/textures/accretion_disk.webp";
    loader.load(diskSrc, (t) => {
      t.magFilter = THREE.LinearFilter;
      t.minFilter = THREE.LinearFilter;
      t.wrapS = THREE.ClampToEdgeWrapping;
      t.wrapT = THREE.ClampToEdgeWrapping;
      if (materialRef.current) materialRef.current.uniforms.disk_texture.value = t;
    });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#gargantua",
        start: "top bottom",
        end: "center center",
        scrub: 2.5,
        onUpdate: (self) => {
          if (materialRef.current) {
            const z = gsap.utils.interpolate(-15.0, -8.0, self.progress);
            const y = gsap.utils.interpolate(4.0, 0.5, self.progress);
            materialRef.current.uniforms.cam_pos.value.set(0, y, z);
            const dirY = gsap.utils.interpolate(-0.25, -0.05, self.progress);
            materialRef.current.uniforms.cam_dir.value.set(0, dirY, 1).normalize();
          }
        },
      });
    });

    // Resolution update: only on resize, NOT every frame
    const handleResize = () => {
      resolutionRef.current.set(window.innerWidth, window.innerHeight);
      if (materialRef.current) {
        materialRef.current.uniforms.resolution.value.set(
          window.innerWidth,
          window.innerHeight
        );
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      // Only update time — resolution is handled by the resize listener
      materialRef.current.uniforms.time.value = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function InteractiveBlackHole() {
  const quality = useDevicePerformance();
  // Reduced DPR on lower-end devices
  const dpr: [number, number] =
    quality === "high" ? [1, 1.5] : quality === "medium" ? [1, 1] : [0.75, 1];

  return (
    <div className="absolute inset-0 z-0 bg-black pointer-events-none">
      <Canvas orthographic camera={{ manual: true }} dpr={dpr} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <BlackHoleShader quality={quality} />
      </Canvas>
    </div>
  );
}
