import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { RectAreaLight } from './jsm/lights/RectAreaLight.js';

export class SignageBuilder {
    constructor(scene) {
        this.scene = scene;
        this.SIGNAGE_WIDTH = 19;
        this.SIGNAGE_HEIGHT = 4;
        this.SIGNAGE_Y_OFFSET = 8; // INSIDE_HEIGHT from StorefrontBuilder
        this.SIGNAGE_DEPTH = 0.2;
        this.BORDER_THICKNESS = 2 / 12;
        this.SIGNAGE_Z_OFFSET = 0.5 / 2 + 0.1; // WALL_THICKNESS / 2 + 0.1

        this.FONT_PATH = 'https://unpkg.com/three/examples/fonts/helvetiker_regular.typeface.json';
        this.SIGNAGE_TEXTURE_PATH = 'assets/dark_panel_texture.jpg';

        this.litFrontMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 1.5
        });
        this.embossedSideMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8, metalness: 0.1 }); // pillarMaterial
    }

    build() {
        this.createSignageBoard();
    }

    createSignageBoard() {
        const loader = new FontLoader();
        const signageBoardGeo = new THREE.BoxGeometry(this.SIGNAGE_WIDTH, this.SIGNAGE_HEIGHT, this.SIGNAGE_DEPTH);
        let signageBoardMaterial;

        if (this.SIGNAGE_TEXTURE_PATH) {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(this.SIGNAGE_TEXTURE_PATH, (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(this.SIGNAGE_WIDTH / 2, this.SIGNAGE_HEIGHT / 2);
                signageBoardMaterial = new THREE.MeshStandardMaterial({
                    map: texture,
                    color: 0x444444,
                    roughness: 0.9
                });
                this._addSignageElements(signageBoardGeo, signageBoardMaterial, loader);
            }, undefined, (err) => {
                console.error('An error occurred loading the signage texture:', err);
                signageBoardMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
                this._addSignageElements(signageBoardGeo, signageBoardMaterial, loader);
            });
        } else {
            signageBoardMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
            this._addSignageElements(signageBoardGeo, signageBoardMaterial, loader);
        }
    }

    _addSignageElements(signageBoardGeo, signageBoardMaterial, loader) {
        const signageBoard = new THREE.Mesh(signageBoardGeo, signageBoardMaterial);
        signageBoard.position.set(0, this.SIGNAGE_Y_OFFSET + this.SIGNAGE_HEIGHT / 2, this.SIGNAGE_Z_OFFSET + this.SIGNAGE_DEPTH / 2);
        signageBoard.castShadow = true;
        signageBoard.receiveShadow = true;
        this.scene.add(signageBoard);

        const borderMaterial = this.litFrontMaterial;

        // Top border
        const topBorderGeo = new THREE.BoxGeometry(this.SIGNAGE_WIDTH + 2 * this.BORDER_THICKNESS, this.BORDER_THICKNESS, this.SIGNAGE_DEPTH + 0.1);
        const topBorder = new THREE.Mesh(topBorderGeo, borderMaterial);
        topBorder.position.set(0, this.SIGNAGE_Y_OFFSET + this.SIGNAGE_HEIGHT + this.BORDER_THICKNESS / 2, this.SIGNAGE_Z_OFFSET + this.SIGNAGE_DEPTH / 2 + 0.05);
        this.scene.add(topBorder);

        // Bottom border
        const bottomBorderGeo = new THREE.BoxGeometry(this.SIGNAGE_WIDTH + 2 * this.BORDER_THICKNESS, this.BORDER_THICKNESS, this.SIGNAGE_DEPTH + 0.1);
        const bottomBorder = new THREE.Mesh(bottomBorderGeo, borderMaterial);
        bottomBorder.position.set(0, this.SIGNAGE_Y_OFFSET - this.BORDER_THICKNESS / 2, this.SIGNAGE_Z_OFFSET + this.SIGNAGE_DEPTH / 2 + 0.05);
        this.scene.add(bottomBorder);

        // Left border
        const leftBorderGeo = new THREE.BoxGeometry(this.BORDER_THICKNESS, this.SIGNAGE_HEIGHT, this.SIGNAGE_DEPTH + 0.1);
        const leftBorder = new THREE.Mesh(leftBorderGeo, borderMaterial);
        leftBorder.position.set(-this.SIGNAGE_WIDTH / 2 - this.BORDER_THICKNESS / 2, this.SIGNAGE_Y_OFFSET + this.SIGNAGE_HEIGHT / 2, this.SIGNAGE_Z_OFFSET + this.SIGNAGE_DEPTH / 2 + 0.05);
        this.scene.add(leftBorder);

        // Right border
        const rightBorderGeo = new THREE.BoxGeometry(this.BORDER_THICKNESS, this.SIGNAGE_HEIGHT, this.SIGNAGE_DEPTH + 0.1);
        const rightBorder = new THREE.Mesh(rightBorderGeo, borderMaterial);
        rightBorder.position.set(this.SIGNAGE_WIDTH / 2 + this.BORDER_THICKNESS / 2, this.SIGNAGE_Y_OFFSET + this.SIGNAGE_HEIGHT / 2, this.SIGNAGE_Z_OFFSET + this.SIGNAGE_DEPTH / 2 + 0.05);
        this.scene.add(rightBorder);

        loader.load(this.FONT_PATH, (font) => {
            const signageContentGroup = new THREE.Group();

            // --- Specsmakers Text ---
            const textOptions = {
                font: font,
                size: 1,
                height: 0.05,
                curveSegments: 12,
                bevelEnabled: false
            };
            const textGeo = new TextGeometry('specsmakers', textOptions);
            const textMesh = new THREE.Mesh(textGeo, [this.litFrontMaterial, this.embossedSideMaterial]);
            textGeo.computeBoundingBox();
            const textWidth = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x;

            // --- Logo Shapes ---
            const logoGroup = new THREE.Group();
            const logoSize = 1;
            const logoEmbossDepth = 0.05;
            const extrudeSettings = {
                steps: 1,
                depth: logoEmbossDepth,
                bevelEnabled: false
            };

            // Square 1 (top-left)
            const squareShape1 = new THREE.Shape();
            squareShape1.moveTo(-logoSize / 2, logoSize / 2);
            squareShape1.lineTo(logoSize / 2, logoSize / 2);
            squareShape1.lineTo(logoSize / 2, -logoSize / 2);
            squareShape1.lineTo(-logoSize / 2, -logoSize / 2);
            squareShape1.lineTo(-logoSize / 2, logoSize / 2);
            const squareGeo1 = new THREE.ExtrudeGeometry(squareShape1, extrudeSettings);
            const squareMesh1 = new THREE.Mesh(squareGeo1, [this.litFrontMaterial, this.embossedSideMaterial]);
            squareMesh1.position.set(-logoSize / 2 - 0.1, logoSize / 2 + 0.1, 0);
            logoGroup.add(squareMesh1);

            // Circle 1 (top-right)
            const circleShape1 = new THREE.Shape();
            circleShape1.absarc(0, 0, logoSize / 2, 0, Math.PI * 2, false);
            const circleGeo1 = new THREE.ExtrudeGeometry(circleShape1, extrudeSettings);
            const circleMesh1 = new THREE.Mesh(circleGeo1, [this.litFrontMaterial, this.embossedSideMaterial]);
            circleMesh1.position.set(logoSize / 2 + 0.1, logoSize / 2 + 0.1, 0);
            logoGroup.add(circleMesh1);

            // Circle 2 (bottom-left)
            const circleShape2 = new THREE.Shape();
            circleShape2.absarc(0, 0, logoSize / 2, 0, Math.PI * 2, false);
            const circleGeo2 = new THREE.ExtrudeGeometry(circleShape2, extrudeSettings);
            const circleMesh2 = new THREE.Mesh(circleGeo2, [this.litFrontMaterial, this.embossedSideMaterial]);
            circleMesh2.position.set(-logoSize / 2 - 0.1, -logoSize / 2 - 0.1, 0);
            logoGroup.add(circleMesh2);

            // Square 2 (bottom-right)
            const squareShape2 = new THREE.Shape();
            squareShape2.moveTo(-logoSize / 2, logoSize / 2);
            squareShape2.lineTo(logoSize / 2, logoSize / 2);
            squareShape2.lineTo(logoSize / 2, -logoSize / 2);
            squareShape2.lineTo(-logoSize / 2, -logoSize / 2);
            squareShape2.lineTo(-logoSize / 2, logoSize / 2);
            const squareGeo2 = new THREE.ExtrudeGeometry(squareShape2, extrudeSettings);
            const squareMesh2 = new THREE.Mesh(squareGeo2, [this.litFrontMaterial, this.embossedSideMaterial]);
            squareMesh2.position.set(logoSize / 2 + 0.1, -logoSize / 2 - 0.1, 0);
            logoGroup.add(squareMesh2);

            logoGroup.scale.set(0.8, 0.8, 0.8);
            logoGroup.position.x = -textWidth / 2 + 1;

            textMesh.position.x = textWidth / 2 - 6;
            textMesh.position.y = -0.40;

            signageContentGroup.add(logoGroup);
            signageContentGroup.add(textMesh);

            signageContentGroup.position.set(0, this.SIGNAGE_Y_OFFSET + this.SIGNAGE_HEIGHT / 2, this.SIGNAGE_Z_OFFSET + this.SIGNAGE_DEPTH + 0.1);
            signageContentGroup.castShadow = true;
            this.scene.add(signageContentGroup);

            const rectLight = new RectAreaLight(0xffffff, 5, this.SIGNAGE_WIDTH * 0.9, this.SIGNAGE_HEIGHT * 0.9);
            rectLight.position.set(0, this.SIGNAGE_Y_OFFSET + this.SIGNAGE_HEIGHT / 2, this.SIGNAGE_Z_OFFSET + this.SIGNAGE_DEPTH + 0.2);
            rectLight.lookAt(0, this.SIGNAGE_Y_OFFSET + this.SIGNAGE_HEIGHT / 2, this.SIGNAGE_Z_OFFSET + this.SIGNAGE_DEPTH + 0.1);
            this.scene.add(rectLight);
        }, (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        }, (err) => {
            console.error('An error happened loading the font:', err);
        });
    }
}
