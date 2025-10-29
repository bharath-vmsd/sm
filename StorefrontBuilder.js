import * as THREE from 'three';

export class StorefrontBuilder {
    constructor(scene) {
        this.scene = scene;
        this.PILLAR_WIDTH = 1;
        this.GLASS_SECTION_WIDTH = 8.5;
        this.STORE_DEPTH = 25;
        this.INSIDE_HEIGHT = 8;
        this.WALL_THICKNESS = 0.5;

        this.pillarMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8, metalness: 0.1 });
        this.glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xcccccc,
            transmission: 0.9,
            roughness: 0.1,
            thickness: 0.1,
            transparent: true,
            envMapIntensity: 0.8
        });
        this.innerWallMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.7 });
        this.innerFloorMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.9 });
        this.ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.7 });

        this.totalFrontageWidth = (this.PILLAR_WIDTH * 3) + (this.GLASS_SECTION_WIDTH * 2);
    }

    build() {
        this.createFrontPillarsAndGlass();
        this.createInteriorElements();
        this.addInteriorLights();
    }

    createFrontPillarsAndGlass() {
        let currentX = -this.totalFrontageWidth / 2 + this.PILLAR_WIDTH / 2;

        for (let i = 0; i < 3; i++) {
            const pillarGeo = new THREE.BoxGeometry(this.PILLAR_WIDTH, this.INSIDE_HEIGHT + this.WALL_THICKNESS, this.WALL_THICKNESS);
            const pillar = new THREE.Mesh(pillarGeo, this.pillarMaterial);
            pillar.position.set(currentX, this.INSIDE_HEIGHT / 2, 0);
            pillar.castShadow = true;
            pillar.receiveShadow = true;
            this.scene.add(pillar);
            currentX += this.PILLAR_WIDTH / 2 + .2;

            if (i < 2) {
                currentX += this.GLASS_SECTION_WIDTH / 2;
                const glassGeo = new THREE.BoxGeometry(this.GLASS_SECTION_WIDTH, this.INSIDE_HEIGHT, 0.1);
                const glass = new THREE.Mesh(glassGeo, this.glassMaterial);
                glass.position.set(currentX, this.INSIDE_HEIGHT / 2, 0);
                glass.receiveShadow = true;
                this.scene.add(glass);
                currentX += this.GLASS_SECTION_WIDTH / 2;
            }
        }
    }

    createInteriorElements() {
        // Floor (inside)
        const floorGeo = new THREE.BoxGeometry(this.totalFrontageWidth, this.WALL_THICKNESS, this.STORE_DEPTH);
        const floor = new THREE.Mesh(floorGeo, this.innerFloorMaterial);
        floor.position.set(0, -this.WALL_THICKNESS / 2, -this.STORE_DEPTH / 2);
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Ceiling (inside)
        const ceilingGeo = new THREE.BoxGeometry(this.totalFrontageWidth, this.WALL_THICKNESS, this.STORE_DEPTH);
        const ceiling = new THREE.Mesh(ceilingGeo, this.ceilingMaterial);
        ceiling.position.set(0, this.INSIDE_HEIGHT + this.WALL_THICKNESS / 2, -this.STORE_DEPTH / 2);
        ceiling.receiveShadow = true;
        this.scene.add(ceiling);

        // Back Wall
        const backWallGeo = new THREE.BoxGeometry(this.totalFrontageWidth, this.INSIDE_HEIGHT + this.WALL_THICKNESS, this.WALL_THICKNESS);
        const backWall = new THREE.Mesh(backWallGeo, this.innerWallMaterial);
        backWall.position.set(0, this.INSIDE_HEIGHT / 2, -this.STORE_DEPTH - this.WALL_THICKNESS / 2);
        backWall.castShadow = true;
        backWall.receiveShadow = true;
        this.scene.add(backWall);

        // Left Side Wall
        const leftWallGeo = new THREE.BoxGeometry(this.WALL_THICKNESS, this.INSIDE_HEIGHT + this.WALL_THICKNESS, this.STORE_DEPTH + this.WALL_THICKNESS);
        const leftWall = new THREE.Mesh(leftWallGeo, this.pillarMaterial);
        leftWall.position.set(-this.totalFrontageWidth / 2 - this.WALL_THICKNESS / 2, this.INSIDE_HEIGHT / 2, -this.STORE_DEPTH / 2);
        leftWall.castShadow = true;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);

        // Right Side Wall
        const rightWallGeo = new THREE.BoxGeometry(this.WALL_THICKNESS, this.INSIDE_HEIGHT + this.WALL_THICKNESS, this.STORE_DEPTH + this.WALL_THICKNESS);
        const rightWall = new THREE.Mesh(rightWallGeo, this.pillarMaterial);
        rightWall.position.set(this.totalFrontageWidth / 2, this.INSIDE_HEIGHT / 2, -this.STORE_DEPTH / 2);
        rightWall.castShadow = true;
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);
    }

    addInteriorLights() {
        const storeLight1 = new THREE.PointLight(0xffffee, 1.5, 30);
        storeLight1.position.set(-5, this.INSIDE_HEIGHT - 1, -this.STORE_DEPTH / 2 + 5);
        this.scene.add(storeLight1);

        const storeLight2 = new THREE.PointLight(0xffffee, 1.5, 30);
        storeLight2.position.set(5, this.INSIDE_HEIGHT - 1, -this.STORE_DEPTH / 2 + 5);
        this.scene.add(storeLight2);

        const storeLight3 = new THREE.PointLight(0xffffee, 1.5, 30);
        storeLight3.position.set(-5, this.INSIDE_HEIGHT - 1, -this.STORE_DEPTH / 2 + 15);
        this.scene.add(storeLight3);

        const storeLight4 = new THREE.PointLight(0xffffee, 1.5, 30);
        storeLight4.position.set(5, this.INSIDE_HEIGHT - 1, -this.STORE_DEPTH / 2 + 15);
        this.scene.add(storeLight4);
    }
}
