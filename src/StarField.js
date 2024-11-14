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
                    gl_PointSize = size * (300.0 / length(mvPosition.xyz)) * twinkle;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;

                void main() {
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    if (dist > 0.5) discard;
                    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
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

    animate(deltaTime) {
        if (this.stars && this.stars.material.uniforms) {
            this.stars.material.uniforms.time.value += deltaTime * 0.0005;  // Much slower time advancement
            this.stars.rotation.y += deltaTime * 0.01;
        }
    }
}