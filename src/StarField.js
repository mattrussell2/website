import * as THREE from 'three';

export class StarField {
    constructor(scene, count = 5000) {
        // Create vertices for points
        const vertices = [];
        const sizes = [];
        const colors = [];

        for (let i = 0; i < count; i++) {
            // Create stars in a large sphere around the scene
            const radius = 500;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            const x = radius * Math.sin(phi) * Math.cos(theta);
            let y = Math.abs(radius * Math.sin(phi) * Math.sin(theta));
            if (y < 15) y += 15;  // Keep stars above the horizon
            const z = radius * Math.cos(phi);

            vertices.push(x, y, z);
            sizes.push(Math.random() * 2 + 1); // Slightly larger stars

            // Randomize star colors
            const color = new THREE.Color();
            color.setHSL(Math.random(), 0.2, 0.8);
            colors.push(color.r, color.g, color.b);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;

                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    float twinkle = sin(time * 0.1 + position.x * 0.05) * 0.5 + 0.7;  // Much slower twinkle, less dramatic
                    gl_PointSize = max(2.5, size * (300.0 / length(mvPosition.xyz)) * twinkle);   // never sub-pixel: sub-pixel dots shimmer as the dome drifts
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;

                void main() {
                    vec2 c = gl_PointCoord - vec2(0.5);
                    float d = length(c) * 2.0;
                    if (d > 1.0) discard;
                    float alpha = pow(1.0 - d, 1.8);   // bright core, soft falloff
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.stars = new THREE.Points(geometry, material);
        this.stars.layers.set(1);
        scene.add(this.stars);
    }

    animate(dt) {
        // dt is seconds. The twinkle term is effectively static (as in the original);
        // the dome drifts very slowly.
        this.stars.material.uniforms.time.value += dt * 0.02;
        this.stars.rotation.y += dt * 0.0006;
    }
}