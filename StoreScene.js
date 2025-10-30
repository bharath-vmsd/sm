import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from './jsm/lights/RectAreaLightUniformsLib.js';
import TWEEN from '../jsm/libs/tween.esm.js';

export class StoreScene {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID '${containerId}' not found.`);
            return;
        }

        this.scene = new THREE.Scene();
        this.worldGroup = new THREE.Group(); // Top-level group for all scene elements
        this.scene.add(this.worldGroup);
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.init();
    }

    init() {
        this.scene.background = new THREE.Color(0x222222);

        this.camera.position.set(5, 8, 15);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.8;
        this.container.appendChild(this.renderer.domElement);

        RectAreaLightUniformsLib.init();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 6, 0);
        this.controls.enableDamping = true;
        this.controls.enableZoom = false;
        this.controls.minPolarAngle = Math.PI / 2;
        this.controls.maxPolarAngle = Math.PI / 2;

        this.addLighting();
        this.addGroundPlane();

        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize.bind(this), false);

        this.animate();
    }

    addLighting() {
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(10, 20, 15);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 50;
        dirLight.shadow.camera.left = -20;
        dirLight.shadow.camera.right = 20;
        dirLight.shadow.camera.top = 20;
        dirLight.shadow.camera.bottom = -20;
        this.scene.add(dirLight);
    }

    addGroundPlane() {
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.05;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    rotateWorld() {
        const currentRotation = { y: this.worldGroup.rotation.y };
        const targetRotation = { y: this.worldGroup.rotation.y + Math.PI / 2 }; // Rotate by 90 degrees

        new TWEEN.Tween(currentRotation)
            .to(targetRotation, 1000) // Animate over 1000 milliseconds (1 second)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                this.worldGroup.rotation.y = currentRotation.y;
            })
            .start();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        TWEEN.update(); // Update TWEEN animations
        this.renderer.render(this.scene, this.camera);
    }

    getScene() {
        return this.scene;
    }

    getWorldGroup() {
        return this.worldGroup;
    }
}