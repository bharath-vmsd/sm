import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // If you later add complex models
import { RectAreaLight } from './jsm/lights/RectAreaLight.js'; // New import
import { RectAreaLightUniformsLib } from './jsm/lights/RectAreaLightUniformsLib.js'; // Required for RectAreaLight

let scene, camera, renderer, controls;
let logoGroup; // To hold the logo shapes

// Store Dimensions
const PILLAR_WIDTH = 1; // 1 foot
const GLASS_SECTION_WIDTH = 8.5; // 8 feet
const STORE_DEPTH = 25; // 25 feet
const INSIDE_HEIGHT = 8; // 9 feet
const WALL_THICKNESS = 0.5; // Half a foot for walls/pillars
const SIGNAGE_WIDTH = 19; // 19 feet
const SIGNAGE_HEIGHT = 4; // 4 feet
const SIGNAGE_Y_OFFSET = INSIDE_HEIGHT; // Signage starts after 8ft height
const SIGNAGE_DEPTH = 0.2; // Thickness of the signage board itself
const BORDER_THICKNESS = 2/12; // 2 inches for the lit border
const SIGNAGE_Z_OFFSET = WALL_THICKNESS / 2 + 0.1; // Offset signage forward to clear pillars

// Material Definitions
const pillarMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8, metalness: 0.1 }); // Dark grey
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xcccccc,
    transmission: 0.9,
    roughness: 0.1,
    thickness: 0.1,
    transparent: true,
    envMapIntensity: 0.8 // For reflections
});
const innerWallMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.7 }); // Light grey/white for inside
const innerFloorMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.9 }); // Light grey for floor
const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.7 }); // Slightly darker white

// Signage Text/Logo Materials
const litFrontMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 1.5 // Makes it glow strongly
});
const embossedSideMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000, // Opaque black
    roughness: 0.5,
    metalness: 0
});

// Paths to assets
const FONT_PATH = 'https://unpkg.com/three/examples/fonts/helvetiker_regular.typeface.json';
const SIGNAGE_TEXTURE_PATH = 'assets/dark_panel_texture.jpg'; // Optional: for the ribbed background

// Initialize the scene
init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222); // Dark background

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(10, 8, 25); // Looking at the storefront from a distance

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Correct color management
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Better HDR look
    renderer.toneMappingExposure = 0.8; // Adjust exposure
    document.body.appendChild(renderer.domElement);

    RectAreaLightUniformsLib.init(); // Initialize RectAreaLightUniformsLib

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 6, 0); // Look at the center of the sign
    controls.enableDamping = true; // Smooth camera movement
    controls.minPolarAngle = Math.PI / 2; // Disables orbiting below the horizon
    controls.maxPolarAngle = Math.PI / 2; // Disables orbiting above the horizon

    // Lighting
    // Ambient light for general scene illumination
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // Directional light from above/front for shadows and highlights
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(10, 20, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    scene.add(dirLight);

    // Point lights inside the store for illumination
    const storeLight1 = new THREE.PointLight(0xffffee, 1.5, 30); // Warm light
    storeLight1.position.set(-5, INSIDE_HEIGHT - 1, -STORE_DEPTH / 2 + 5);
    scene.add(storeLight1);

    const storeLight2 = new THREE.PointLight(0xffffee, 1.5, 30);
    storeLight2.position.set(5, INSIDE_HEIGHT - 1, -STORE_DEPTH / 2 + 5);
    scene.add(storeLight2);

    const storeLight3 = new THREE.PointLight(0xffffee, 1.5, 30);
    storeLight3.position.set(-5, INSIDE_HEIGHT - 1, -STORE_DEPTH / 2 + 15);
    scene.add(storeLight3);

    const storeLight4 = new THREE.PointLight(0xffffee, 1.5, 30);
    storeLight4.position.set(5, INSIDE_HEIGHT - 1, -STORE_DEPTH / 2 + 15);
    scene.add(storeLight4);


    // Ground plane outside
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05; // Slightly below the floor
    ground.receiveShadow = true;
    scene.add(ground);

    // Build the store elements
    createStorefront();
    createSignage();
    createInterior();

    // Handle window resizing
    window.addEventListener('resize', onWindowResize, false);
}

function createStorefront() {
    const totalFrontageWidth = (PILLAR_WIDTH * 3) + (GLASS_SECTION_WIDTH * 2); // 3 * 1 + 2 * 8 = 3 + 16 = 19 feet

    // Calculate start X position for first pillar
    let currentX = -totalFrontageWidth / 2 + PILLAR_WIDTH / 2;

    // Front Pillars and Glass Sections
    for (let i = 0; i < 3; i++) {
        // Pillar
        const pillarGeo = new THREE.BoxGeometry(PILLAR_WIDTH, INSIDE_HEIGHT + WALL_THICKNESS, WALL_THICKNESS);
        const pillar = new THREE.Mesh(pillarGeo, pillarMaterial);
        pillar.position.set(currentX, INSIDE_HEIGHT / 2, 0); // Front face at Z=0
        pillar.castShadow = true;
        pillar.receiveShadow = true;
        scene.add(pillar);
        currentX += PILLAR_WIDTH / 2 + .2; // Move to edge of pillar

        if (i < 2) { // Add glass section after first two pillars
            currentX += GLASS_SECTION_WIDTH / 2;
            const glassGeo = new THREE.BoxGeometry(GLASS_SECTION_WIDTH, INSIDE_HEIGHT, 0.1); // Thin glass
            const glass = new THREE.Mesh(glassGeo, glassMaterial);
            glass.position.set(currentX, INSIDE_HEIGHT / 2, 0); // Front face at Z=0
            glass.receiveShadow = true; // Glass can receive shadows
            scene.add(glass);
            currentX += GLASS_SECTION_WIDTH / 2; // Move to edge of glass
        }
    }
}

function createInterior() {
    const totalFrontageWidth = (PILLAR_WIDTH * 3) + (GLASS_SECTION_WIDTH * 2 -1); // 19 feet

    // Floor (inside)
    const floorGeo = new THREE.BoxGeometry(totalFrontageWidth, WALL_THICKNESS, STORE_DEPTH);
    const floor = new THREE.Mesh(floorGeo, innerFloorMaterial);
    floor.position.set(0, -WALL_THICKNESS / 2, -STORE_DEPTH / 2); // Base at Y=0, extends back
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling (inside)
    const ceilingGeo = new THREE.BoxGeometry(totalFrontageWidth, WALL_THICKNESS, STORE_DEPTH);
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMaterial);
    ceiling.position.set(0, INSIDE_HEIGHT + WALL_THICKNESS / 2, -STORE_DEPTH / 2);
    ceiling.receiveShadow = true;
    scene.add(ceiling);

    // Back Wall
    const backWallGeo = new THREE.BoxGeometry(totalFrontageWidth, INSIDE_HEIGHT + WALL_THICKNESS, WALL_THICKNESS);
    const backWall = new THREE.Mesh(backWallGeo, innerWallMaterial);
    backWall.position.set(0, INSIDE_HEIGHT / 2, -STORE_DEPTH - WALL_THICKNESS / 2);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left Side Wall (outside the store width, aligned with first pillar's outer edge)
    const leftWallGeo = new THREE.BoxGeometry(WALL_THICKNESS, INSIDE_HEIGHT + WALL_THICKNESS, STORE_DEPTH + WALL_THICKNESS);
    const leftWall = new THREE.Mesh(leftWallGeo, pillarMaterial); // Use pillar material for outside look
    leftWall.position.set(-totalFrontageWidth / 2 - WALL_THICKNESS / 2, INSIDE_HEIGHT / 2, -STORE_DEPTH / 2);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right Side Wall
    const rightWallGeo = new THREE.BoxGeometry(WALL_THICKNESS, INSIDE_HEIGHT + WALL_THICKNESS, STORE_DEPTH + WALL_THICKNESS);
    const rightWall = new THREE.Mesh(rightWallGeo, pillarMaterial);
    rightWall.position.set(totalFrontageWidth / 2, INSIDE_HEIGHT / 2, -STORE_DEPTH / 2);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    scene.add(rightWall);
}

function createSignage() {
    const loader = new FontLoader();

    // Signage Board Background
    const signageBoardGeo = new THREE.BoxGeometry(SIGNAGE_WIDTH, SIGNAGE_HEIGHT, SIGNAGE_DEPTH);
    let signageBoardMaterial;

    // Load texture for the signage background if path is provided
    if (SIGNAGE_TEXTURE_PATH) {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(SIGNAGE_TEXTURE_PATH, function(texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(SIGNAGE_WIDTH / 2, SIGNAGE_HEIGHT / 2); // Adjust repeat based on board size
            signageBoardMaterial = new THREE.MeshStandardMaterial({
                map: texture,
                color: 0x444444, // Base color if texture fails or for darker areas
                roughness: 0.9
            });
            const signageBoard = new THREE.Mesh(signageBoardGeo, signageBoardMaterial);
            signageBoard.position.set(0, SIGNAGE_Y_OFFSET + SIGNAGE_HEIGHT / 2, SIGNAGE_Z_OFFSET + SIGNAGE_DEPTH / 2);
            signageBoard.castShadow = true;
            signageBoard.receiveShadow = true;
            scene.add(signageBoard);

            // Create the lit white border
            const borderMaterial = litFrontMaterial; // Reuse the lit material

            // Top border
            const topBorderGeo = new THREE.BoxGeometry(SIGNAGE_WIDTH + 2 * BORDER_THICKNESS, BORDER_THICKNESS, SIGNAGE_DEPTH + 0.1);
            const topBorder = new THREE.Mesh(topBorderGeo, borderMaterial);
            topBorder.position.set(0, SIGNAGE_Y_OFFSET + SIGNAGE_HEIGHT + BORDER_THICKNESS / 2, SIGNAGE_Z_OFFSET + SIGNAGE_DEPTH / 2 + 0.05);
            scene.add(topBorder);

            // Bottom border
            const bottomBorderGeo = new THREE.BoxGeometry(SIGNAGE_WIDTH + 2 * BORDER_THICKNESS, BORDER_THICKNESS, SIGNAGE_DEPTH + 0.1);
            const bottomBorder = new THREE.Mesh(bottomBorderGeo, borderMaterial);
            bottomBorder.position.set(0, SIGNAGE_Y_OFFSET - BORDER_THICKNESS / 2, SIGNAGE_Z_OFFSET + SIGNAGE_DEPTH / 2 + 0.05);
            scene.add(bottomBorder);

            // Left border
            const leftBorderGeo = new THREE.BoxGeometry(BORDER_THICKNESS, SIGNAGE_HEIGHT, SIGNAGE_DEPTH + 0.1);
            const leftBorder = new THREE.Mesh(leftBorderGeo, borderMaterial);
            leftBorder.position.set(-SIGNAGE_WIDTH / 2 - BORDER_THICKNESS / 2, SIGNAGE_Y_OFFSET + SIGNAGE_HEIGHT / 2, SIGNAGE_Z_OFFSET + SIGNAGE_DEPTH / 2 + 0.05);
            scene.add(leftBorder);

            // Right border
            const rightBorderGeo = new THREE.BoxGeometry(BORDER_THICKNESS, SIGNAGE_HEIGHT, SIGNAGE_DEPTH + 0.1);
            const rightBorder = new THREE.Mesh(rightBorderGeo, borderMaterial);
            rightBorder.position.set(SIGNAGE_WIDTH / 2 + BORDER_THICKNESS / 2, SIGNAGE_Y_OFFSET + SIGNAGE_HEIGHT / 2, SIGNAGE_Z_OFFSET + SIGNAGE_DEPTH / 2 + 0.05);
            scene.add(rightBorder);
        }, undefined, function(err) {
            console.error('An error occurred loading the signage texture:', err);
            // Fallback to solid color if texture fails
            signageBoardMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
            const signageBoard = new THREE.Mesh(signageBoardGeo, signageBoardMaterial);
            signageBoard.position.set(0, SIGNAGE_Y_OFFSET + SIGNAGE_HEIGHT / 2, SIGNAGE_Z_OFFSET + SIGNAGE_DEPTH / 2);
            signageBoard.castShadow = true;
            signageBoard.receiveShadow = true;
            scene.add(signageBoard);

            // Create the lit white border
            const borderMaterial = litFrontMaterial; // Reuse the lit material

            // Top border
            const topBorderGeo = new THREE.BoxGeometry(SIGNAGE_WIDTH + 2 * BORDER_THICKNESS, BORDER_THICKNESS, SIGNAGE_DEPTH + 0.1);
            const topBorder = new THREE.Mesh(topBorderGeo, borderMaterial);
            topBorder.position.set(0, SIGNAGE_Y_OFFSET + SIGNAGE_HEIGHT + BORDER_THICKNESS / 2, SIGNAGE_Z_OFFSET + SIGNAGE_DEPTH / 2 + 0.05);
            scene.add(topBorder);

            // Bottom border
            const bottomBorderGeo = new THREE.BoxGeometry(SIGNAGE_WIDTH + 2 * BORDER_THICKNESS, BORDER_THICKNESS, SIGNAGE_DEPTH + 0.1);
            const bottomBorder = new THREE.Mesh(bottomBorderGeo, borderMaterial);
            bottomBorder.position.set(0, SIGNAGE_Y_OFFSET - BORDER_THICKNESS / 2, SIGNAGE_Z_OFFSET + SIGNAGE_DEPTH / 2 + 0.05);
            scene.add(bottomBorder);

            // Left border
            const leftBorderGeo = new THREE.BoxGeometry(BORDER_THICKNESS, SIGNAGE_HEIGHT, SIGNAGE_DEPTH + 0.1);
            const leftBorder = new THREE.Mesh(leftBorderGeo, borderMaterial);
            leftBorder.position.set(-SIGNAGE_WIDTH / 2 - BORDER_THICKNESS / 2, SIGNAGE_Y_OFFSET + SIGNAGE_HEIGHT / 2, SIGNAGE_Z_OFFSET + SIGNAGE_DEPTH / 2 + 0.05);
            scene.add(leftBorder);

            // Right border
            const rightBorderGeo = new THREE.BoxGeometry(BORDER_THICKNESS, SIGNAGE_HEIGHT, SIGNAGE_DEPTH + 0.1);
            const rightBorder = new THREE.Mesh(rightBorderGeo, borderMaterial);
            rightBorder.position.set(SIGNAGE_WIDTH / 2 + BORDER_THICKNESS / 2, SIGNAGE_Y_OFFSET + SIGNAGE_HEIGHT / 2, SIGNAGE_Z_OFFSET + SIGNAGE_DEPTH / 2 + 0.05);
            scene.add(rightBorder);
        });
    } else {
        signageBoardMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
        const signageBoard = new THREE.Mesh(signageBoardGeo, signageBoardMaterial);
        signageBoard.position.set(0, SIGNAGE_Y_OFFSET + SIGNAGE_HEIGHT / 2, SIGNAGE_Z_OFFSET + SIGNAGE_DEPTH / 2);
        signageBoard.castShadow = true;
        signageBoard.receiveShadow = true;
        scene.add(signageBoard);

        // Create the lit white border
        const borderMaterial = litFrontMaterial; // Reuse the lit material

        // Top border
        const topBorderGeo = new THREE.BoxGeometry(SIGNAGE_WIDTH + 2 * BORDER_THICKNESS, BORDER_THICKNESS, SIGNAGE_DEPTH + 0.1);
        const topBorder = new THREE.Mesh(topBorderGeo, borderMaterial);
        topBorder.position.set(0, SIGNAGE_Y_OFFSET + SIGNAGE_HEIGHT + BORDER_THICKNESS / 2, SIGNAGE_DEPTH / 2 + 0.05);
        scene.add(topBorder);

        // Bottom border
        const bottomBorderGeo = new THREE.BoxGeometry(SIGNAGE_WIDTH + 2 * BORDER_THICKNESS, BORDER_THICKNESS, SIGNAGE_DEPTH + 0.1);
        const bottomBorder = new THREE.Mesh(bottomBorderGeo, borderMaterial);
        bottomBorder.position.set(0, SIGNAGE_Y_OFFSET - BORDER_THICKNESS / 2, SIGNAGE_DEPTH / 2 + 0.05);
        scene.add(bottomBorder);

        // Left border
        const leftBorderGeo = new THREE.BoxGeometry(BORDER_THICKNESS, SIGNAGE_HEIGHT, SIGNAGE_DEPTH + 0.1);
        const leftBorder = new THREE.Mesh(leftBorderGeo, borderMaterial);
        leftBorder.position.set(-SIGNAGE_WIDTH / 2 - BORDER_THICKNESS / 2, SIGNAGE_Y_OFFSET + SIGNAGE_HEIGHT / 2, SIGNAGE_DEPTH / 2 + 0.05);
        scene.add(leftBorder);

        // Right border
        const rightBorderGeo = new THREE.BoxGeometry(BORDER_THICKNESS, SIGNAGE_HEIGHT, SIGNAGE_DEPTH + 0.1);
        const rightBorder = new THREE.Mesh(rightBorderGeo, borderMaterial);
        rightBorder.position.set(SIGNAGE_WIDTH / 2 + BORDER_THICKNESS / 2, SIGNAGE_Y_OFFSET + SIGNAGE_HEIGHT / 2, SIGNAGE_DEPTH / 2 + 0.05);
        scene.add(rightBorder);
    }


    loader.load(FONT_PATH, function (font) {
        const signageContentGroup = new THREE.Group();

        // --- Specsmakers Text ---
        const textOptions = {
            font: font,
            size: 1, // Font size for "specsmakers"
            height: 0.05, // Emboss depth
            curveSegments: 12,
            bevelEnabled: false
        };
        const textGeo = new TextGeometry('specsmakers', textOptions);
        const textMesh = new THREE.Mesh(textGeo, [litFrontMaterial, embossedSideMaterial]);
        textGeo.computeBoundingBox();
        const textWidth = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x;

        // --- Logo Shapes ---
        logoGroup = new THREE.Group();

        const logoSize = 1; // Size of each square/circle
        const logoEmbossDepth = 0.05;

        // Create a base ExtrudeGeometry settings for shapes
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
        squareShape1.lineTo(-logoSize / 2, logoSize / 2); // Close path
        const squareGeo1 = new THREE.ExtrudeGeometry(squareShape1, extrudeSettings);
        const squareMesh1 = new THREE.Mesh(squareGeo1, [litFrontMaterial, embossedSideMaterial]);
        squareMesh1.position.set(-logoSize / 2 - 0.1, logoSize / 2 + 0.1, 0);
        logoGroup.add(squareMesh1);

        // Circle 1 (top-right)
        const circleShape1 = new THREE.Shape();
        circleShape1.absarc(0, 0, logoSize / 2, 0, Math.PI * 2, false);
        const circleGeo1 = new THREE.ExtrudeGeometry(circleShape1, extrudeSettings);
        const circleMesh1 = new THREE.Mesh(circleGeo1, [litFrontMaterial, embossedSideMaterial]);
        circleMesh1.position.set(logoSize / 2 + 0.1, logoSize / 2 + 0.1, 0);
        logoGroup.add(circleMesh1);

        // Circle 2 (bottom-left)
        const circleShape2 = new THREE.Shape();
        circleShape2.absarc(0, 0, logoSize / 2, 0, Math.PI * 2, false);
        const circleGeo2 = new THREE.ExtrudeGeometry(circleShape2, extrudeSettings);
        const circleMesh2 = new THREE.Mesh(circleGeo2, [litFrontMaterial, embossedSideMaterial]);
        circleMesh2.position.set(-logoSize / 2 - 0.1, -logoSize / 2 - 0.1, 0);
        logoGroup.add(circleMesh2);

        // Square 2 (bottom-right)
        const squareShape2 = new THREE.Shape();
        squareShape2.moveTo(-logoSize / 2, logoSize / 2);
        squareShape2.lineTo(logoSize / 2, logoSize / 2);
        squareShape2.lineTo(logoSize / 2, -logoSize / 2);
        squareShape2.lineTo(-logoSize / 2, -logoSize / 2);
        squareShape2.lineTo(-logoSize / 2, logoSize / 2); // Close path
        const squareGeo2 = new THREE.ExtrudeGeometry(squareShape2, extrudeSettings);
        const squareMesh2 = new THREE.Mesh(squareGeo2, [litFrontMaterial, embossedSideMaterial]);
        squareMesh2.position.set(logoSize / 2 + 0.1, -logoSize / 2 - 0.1, 0);
        logoGroup.add(squareMesh2);

        logoGroup.scale.set(0.8, 0.8, 0.8); // Scale down the logo slightly
        logoGroup.position.x = -textWidth / 2 + 1; // Position logo to the left of the text, moved 1 unit right

        textMesh.position.x = textWidth/2 - 6; // Position text to the right of the logo, moved 1 unit left
        textMesh.position.y = -0.40; // Move text 9 inches (0.75 feet) down

        signageContentGroup.add(logoGroup);
        signageContentGroup.add(textMesh);

        // Center the whole group on the sign
        signageContentGroup.position.set(0, SIGNAGE_Y_OFFSET + SIGNAGE_HEIGHT / 2, SIGNAGE_Z_OFFSET + SIGNAGE_DEPTH + 0.1);
        signageContentGroup.castShadow = true;
        scene.add(signageContentGroup);

        // Add RectAreaLight for the logo and text
        const rectLight = new THREE.RectAreaLight(0xffffff, 5, SIGNAGE_WIDTH * 0.9, SIGNAGE_HEIGHT * 0.9); // Color, Intensity, Width, Height
        rectLight.position.set(0, SIGNAGE_Y_OFFSET + SIGNAGE_HEIGHT / 2, SIGNAGE_Z_OFFSET + SIGNAGE_DEPTH + 0.2); // Slightly in front of the text
        rectLight.lookAt(0, SIGNAGE_Y_OFFSET + SIGNAGE_HEIGHT / 2, SIGNAGE_Z_OFFSET + SIGNAGE_DEPTH + 0.1); // Look at the text
        scene.add(rectLight);


    },
    // Optional: progress callback
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // Optional: error callback
    function (err) {
        console.error('An error happened loading the font:', err);
        // Fallback or show error message
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Only required if enableDamping is true
    renderer.render(scene, camera);
}

// After init() and animate() calls
document.addEventListener('DOMContentLoaded', () => {
    const dragHint = document.getElementById('drag-hint');
    let hasInteracted = false;

    const hideHint = () => {
        if (!hasInteracted) {
            dragHint.classList.add('hidden');
            hasInteracted = true;
            // Optional: Remove the hint from DOM after transition
            dragHint.addEventListener('transitionend', () => {
                dragHint.remove();
            }, { once: true });
        }
    };

    // Listen for OrbitControls interaction
    controls.addEventListener('start', hideHint);
    // For touch devices, also listen for touchstart on the renderer
    renderer.domElement.addEventListener('touchstart', hideHint, { once: true });
});