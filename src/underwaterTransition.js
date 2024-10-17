// splash sound
// Sound Effect by <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=199583">UNIVERSFIELD</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=199583">Pixabay</a>
import * as THREE from 'three';
import { Water } from './three/Water';
import { TWEEN } from './three/tween.module.min'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

export class UnderwaterTransition {
    constructor(mainScene, camera, renderer, composer) {
        this.mainScene = mainScene;
        this.camera = camera;
        this.renderer = renderer;
        this.composer = composer;

        this.underwaterScene = new THREE.Scene();
        this.underwaterScene.background = new THREE.Color(0x00C2BA);

        this.setupUnderwaterEffect();
        // this.addUnderwaterElements();
        this.isUnderwater = false;

        // Add a fog to the main scene for transition effect
        this.mainScene.fog = new THREE.FogExp2(0x00C2BA, 0.0);

        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);
        this.sound = new THREE.Audio(this.listener);
        this.audioLoader = new THREE.AudioLoader();

        this.loadSplashSound();
    }

    loadSplashSound() {
        this.audioLoader.load('./assets/splash.mp3', (buffer) => {
            this.sound.setBuffer(buffer);
            this.sound.setVolume(0.5); // Adjust volume as needed
        });
    }

    setupUnderwaterEffect() {
        const underwaterEffect = {
            uniforms: {
                "tDiffuse": { value: null },
                "time": { value: 0 },
                "distort": { value: 0.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float time;
                uniform float distort;
                varying vec2 vUv;
                void main() {
                    vec2 p = vUv;
                    p.x += 0.005 * sin(time * 10.0 + p.y * 10.0) * distort;
                    p.y += 0.005 * sin(time * 15.0 + p.x * 10.0) * distort;
                    
                    vec4 color = texture2D(tDiffuse, p);
                    color.rgb = mix(color.rgb, vec3(0.0, 0.5, 1.0), distort * 0.5);
                    
                    gl_FragColor = color;
                }
            `
        };

        this.underwaterPass = new ShaderPass(underwaterEffect);
        this.composer.addPass(this.underwaterPass);
    }

    // addUnderwaterElements() {
    //     const geometry = new THREE.BoxGeometry(10, 10, 10);
    //     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    //     const cube = new THREE.Mesh(geometry, material);
    //     cube.position.set(0, 0, -50);
    //     this.underwaterScene.add(cube);

    //     // Add some fish
    //     for (let i = 0; i < 20; i++) {
    //         const fishGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    //         const fishMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    //         const fish = new THREE.Mesh(fishGeometry, fishMaterial);
    //         fish.position.set(
    //             Math.random() * 40 - 20,
    //             Math.random() * 20 - 10,
    //             Math.random() * 40 - 20
    //         );
    //         this.underwaterScene.add(fish);
    //     }
    // }

    transitionToUnderwater(callback) {
        console.log("Starting transition to underwater");
        const startY = this.camera.position.y;
        const endY = startY - 50;

        new TWEEN.Tween(this.camera.position)
            .to({ y: endY }, 3000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => {
                const progress = (startY - this.camera.position.y) / (startY - endY);
                this.underwaterPass.uniforms.distort.value = Math.max(0, progress);
                this.mainScene.fog.density = progress * 0.05;
                if (progress >= 0.075 && !this.sound.isPlaying) {
                    this.sound.play();
                }
                if (this.camera.position.y < 0) {
                    this.isUnderwater = true;
                }
                // console.log(`Camera Y: ${this.camera.position.y.toFixed(2)}, Progress: ${progress.toFixed(2)}`);
            })
            .onComplete(() => {
                console.log("Transition complete");
                this.isUnderwater = true;
                if (callback) {
                    callback();
                }
            })
            .start();
    }

    update(deltaTime) {
        this.underwaterPass.uniforms.time.value += deltaTime;
        TWEEN.update();
    }
}