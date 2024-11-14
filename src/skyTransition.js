import * as THREE from 'three';
import { TWEEN } from './three/tween.module.min';
export class SkyTransition {
    constructor(scene, camera, renderer, controls) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
        this.isSky = false;

        // Set up audio
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);
        this.sound = new THREE.Audio(this.listener);
        this.audioLoader = new THREE.AudioLoader();

        this.loadRocketSound();
    }

    loadRocketSound() {
        this.audioLoader.load('./assets/rocket.mp3', (buffer) => {
            this.sound.setBuffer(buffer);
            this.sound.setVolume(0.5);
        });
    }

    transitionToSky(callback) {
        console.log("Starting transition to sky");
        const startY = this.camera.position.y;
        const endY = startY + 500;
        
        this.controls.target = new THREE.Vector3(0, 0, 0);
        const startTarget = this.controls.target;
        const endTarget = new THREE.Vector3(0, endY + 50, 0);

        // Tween both position and target
        new TWEEN.Tween({
            y: startY,
            targetY: startTarget.y
        })
        .to({
            y: endY,
            targetY: endTarget.y
        }, 5000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onStart(() => {
            this.sound.play();
        })
        .onUpdate((obj) => {
            this.camera.position.y = obj.y;
            this.controls.target.y = obj.targetY;
            this.controls.update();
            
            if (this.camera.position.y > 100) {
                this.isSky = true;
            }
        })
        .onComplete(() => {
            console.log("Transition complete");
            this.isSky = true;
            this.sound.stop();
            if (callback) callback();
        })
        .start();
    }

    transitionToHome(callback) {
        const startY = this.camera.position.y;
        const endY = 20;
        
        const startTarget = this.controls.target;
        const endTarget = new THREE.Vector3(0, 0, 0);
        
        new TWEEN.Tween({
            y: startY,
            targetY: startTarget.y
        })
        .to({
            y: endY,
            targetY: endTarget.y
        }, 5000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onStart(() => {
            this.sound.play();
        })
        .onUpdate((obj) => {
            this.camera.position.y = obj.y;
            this.controls.target.y = obj.targetY;
            this.controls.update();
            
            if (this.camera.position.y < 100) {
                this.isSky = false;
            }
        })
        .onComplete(() => {
            console.log("Transition complete");
            this.isSky = false;
            this.sound.stop();
            if (callback) callback();
        })
        .start();
    }
}