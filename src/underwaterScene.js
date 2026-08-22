import * as THREE from 'three';

/*
 * Everything that makes the underwater scene feel like water rather than a flat color:
 *   - a depth gradient (bright teal near the surface, deep navy below)
 *   - the rippling underside of the surface overhead
 *   - soft light shafts angling down from the surface
 *   - slow-drifting particles
 * Call update(dt) every frame while underwater.
 */
/* Soft round dot used for the particles. */
function makeDotTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 32;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.6)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 32);
    const t = new THREE.CanvasTexture(c);
    return t;
}

export class UnderwaterEnvironment {
    constructor(scene, camera, waterNormals) {
        this.scene = scene;
        this.camera = camera;
        this.time = 0;

        this.surfaceColor = new THREE.Color(0x0b9d96);
        this.deepColor    = new THREE.Color(0x02111f);

        scene.background = this.deepColor.clone();
        scene.fog = new THREE.FogExp2(0x064c5c, 0.006);

        this.group = new THREE.Group();
        scene.add(this.group);

        this.buildGradient();
        this.buildSurface(waterNormals);
        this.buildLightShafts();
        this.buildParticles();
    }

    /* Big inverted sphere with a vertical gradient; follows the camera so it never clips. */
    buildGradient() {
        const geo = new THREE.SphereGeometry(600, 32, 24);
        const mat = new THREE.ShaderMaterial({
            side: THREE.BackSide,
            depthWrite: false,
            fog: false,
            uniforms: {
                top:    { value: this.surfaceColor },
                bottom: { value: this.deepColor },
            },
            vertexShader: `
                varying float vY;
                void main() {
                    vY = normalize(position).y;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }`,
            fragmentShader: `
                uniform vec3 top; uniform vec3 bottom;
                varying float vY;
                void main() {
                    float t = smoothstep(-0.35, 0.75, vY);
                    t = pow(t, 1.8);
                    gl_FragColor = vec4(mix(bottom, top, t), 1.0);
                }`,
        });
        this.gradient = new THREE.Mesh(geo, mat);
        this.group.add(this.gradient);
    }

    /* Underside of the water, seen from below. Two scrolling normal-map layers give it motion. */
    buildSurface(waterNormals) {
        const geo = new THREE.PlaneGeometry(2000, 2000, 1, 1);
        this.surfaceMat = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            fog: false,
            uniforms: {
                tNormal: { value: waterNormals },
                time:    { value: 0 },
                tint:    { value: new THREE.Color(0x9ff5ee) },
            },
            vertexShader: `
                varying vec2 vUv; varying vec3 vWorld;
                void main() {
                    vUv = uv;
                    vec4 wp = modelMatrix * vec4(position, 1.0);
                    vWorld = wp.xyz;
                    gl_Position = projectionMatrix * viewMatrix * wp;
                }`,
            fragmentShader: `
                uniform sampler2D tNormal; uniform float time; uniform vec3 tint;
                varying vec2 vUv; varying vec3 vWorld;
                void main() {
                    vec2 uv = vUv * 28.0;
                    vec3 n1 = texture2D(tNormal, uv + vec2(time * 0.015, time * 0.010)).rgb;
                    vec3 n2 = texture2D(tNormal, uv * 0.6 - vec2(time * 0.012, time * 0.018)).rgb;
                    float ripple = (n1.b + n2.b) * 0.5;           // blue channel ~ "up-ness"
                    float sparkle = pow(max(0.0, (n1.r + n2.g) * 0.5), 6.0) * 2.0;
                    float d = length(vWorld.xz - cameraPosition.xz);
                    float fade = 1.0 - smoothstep(150.0, 600.0, d);
                    float a = (0.14 * ripple + 0.7 * sparkle) * fade;
                    gl_FragColor = vec4(tint, a);
                }`,
        });
        this.surface = new THREE.Mesh(geo, this.surfaceMat);
        this.surface.rotation.x = Math.PI / 2;
        this.surface.position.y = 0;
        this.group.add(this.surface);
    }

    /* Tall, slightly tilted additive quads fading from the surface downward. */
    buildLightShafts() {
        this.shafts = [];
        const geo = new THREE.PlaneGeometry(1, 1);
        const count = 14;
        for (let i = 0; i < count; i++) {
            const mat = new THREE.ShaderMaterial({
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide,
                fog: false,
                uniforms: { opacity: { value: 0.0 }, color: { value: new THREE.Color(0x7fe9e0) } },
                vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
                fragmentShader: `
                    uniform float opacity; uniform vec3 color; varying vec2 vUv;
                    void main(){
                        float x = 1.0 - abs(vUv.x - 0.5) * 2.0;       // soft horizontal edges
                        float y = pow(vUv.y, 2.2);                    // bright at the top, fades down
                        gl_FragColor = vec4(color, opacity * x * x * y);
                    }`,
            });
            const m = new THREE.Mesh(geo, mat);
            const width = 6 + Math.random() * 18;
            const height = 220 + Math.random() * 120;
            m.scale.set(width, height, 1);
            m.position.set((Math.random() - 0.5) * 500, -height / 2 + 2, -40 - Math.random() * 260);
            m.rotation.z = (Math.random() - 0.5) * 0.35;
            m.rotation.y = (Math.random() - 0.5) * 0.8;
            m.userData = { base: 0.10 + Math.random() * 0.18, phase: Math.random() * Math.PI * 2, speed: 0.25 + Math.random() * 0.4 };
            this.group.add(m);
            this.shafts.push(m);
        }
    }

    /* Marine snow / bubbles drifting slowly upward. */
    buildParticles() {
        const n = 700;
        const pos = new Float32Array(n * 3);
        const spd = new Float32Array(n);
        for (let i = 0; i < n; i++) {
            pos[i*3]   = (Math.random() - 0.5) * 500;
            pos[i*3+1] = -Math.random() * 250;
            pos[i*3+2] = (Math.random() - 0.5) * 500;
            spd[i] = 1.5 + Math.random() * 4;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        this.particleSpeed = spd;
        const mat = new THREE.PointsMaterial({
            color: 0xbff7f2, size: 1.0, sizeAttenuation: true, map: makeDotTexture(),
            transparent: true, opacity: 0.5, depthWrite: false, alphaTest: 0.05,
        });
        this.particles = new THREE.Points(geo, mat);
        this.group.add(this.particles);
    }

    update(dt) {
        this.time += dt;
        this.surfaceMat.uniforms.time.value = this.time;
        this.gradient.position.copy(this.camera.position);

        for (const s of this.shafts) {
            const u = s.userData;
            s.material.uniforms.opacity.value = u.base * (0.7 + 0.3 * Math.sin(this.time * u.speed + u.phase));
        }

        const p = this.particles.geometry.attributes.position;
        for (let i = 0; i < p.count; i++) {
            let y = p.getY(i) + this.particleSpeed[i] * dt;
            let x = p.getX(i) + Math.sin(this.time * 0.4 + i) * 0.02;
            if (y > 0) { y = -250; }
            p.setXY(i, x, y);
        }
        p.needsUpdate = true;
    }
}
