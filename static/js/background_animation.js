// 3D Background Animation - Empire Rod Drape Double Height Chandelier
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bg-canvas-container');
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 7);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Materials
    const rodMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.95, // Glass
        // thickness: 0.2, // Removed due to version compatibility
        ior: 1.5,
        clearcoat: 1.0,
        side: THREE.DoubleSide
    });

    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0xD4AF37, // Gold
        metalness: 0.9,
        roughness: 0.2
    });

    const lightMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00
    });

    const chandelierGroup = new THREE.Group();
    const lightMeshes = [];
    const pointLights = [];

    // Helper to create a tier of rods
    function createTier(y, radius, height, rodCount) {
        const tierGroup = new THREE.Group();

        // Frame Ring
        const ringGeo = new THREE.TorusGeometry(radius, 0.05, 8, 64);
        const ring = new THREE.Mesh(ringGeo, frameMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = y + height / 2;
        tierGroup.add(ring);

        // Rods
        const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, height, 8);

        for (let i = 0; i < rodCount; i++) {
            const angle = (i / rodCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const rod = new THREE.Mesh(rodGeo, rodMaterial);
            rod.position.set(x, y, z);

            // Random slight height variation for "Drape" effect
            rod.position.y += (Math.random() - 0.5) * 0.2;

            tierGroup.add(rod);
        }

        // Add Internal Lights
        const internalLight = new THREE.PointLight(0xffaa00, 0, 4); // Start at 0, controlled by update loop
        internalLight.position.set(0, y, 0);
        tierGroup.add(internalLight);
        pointLights.push(internalLight);

        // Add visible "bulbs" inside
        const bulbGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const bulb = new THREE.Mesh(bulbGeo, lightMaterial);
        bulb.position.set(0, y, 0);
        tierGroup.add(bulb);
        lightMeshes.push(bulb); // For flickering

        return tierGroup;
    }

    // Build Chandelier Layers (Empire Style)
    // Top Tier (Largest)
    const tier1 = createTier(1.5, 2.0, 2.5, 40);
    chandelierGroup.add(tier1);

    // Middle Tier
    const tier2 = createTier(-1.0, 1.4, 2.5, 30);
    chandelierGroup.add(tier2);

    // Bottom Tier (Smallest)
    const tier3 = createTier(-3.0, 0.8, 2.0, 20);
    chandelierGroup.add(tier3);

    // Central Rod/Chain
    const chainGeo = new THREE.CylinderGeometry(0.05, 0.05, 5, 8);
    const chain = new THREE.Mesh(chainGeo, frameMaterial);
    chain.position.y = 3;
    chandelierGroup.add(chain);

    scene.add(chandelierGroup);


    // Particles / Sparkles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 12;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xffd700,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Ambient
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);


    // Toggle Functionality
    let isMasterOn = true;
    window.toggleChandelierLights = function () {
        isMasterOn = !isMasterOn;
        return isMasterOn;
    };

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.02;

        // Rotation
        chandelierGroup.rotation.y += 0.002;

        // Blinking / Flickering Effect
        if (isMasterOn) {
            // Flicker logic: Base intensity + Random fluctuation
            const flicker = 0.8 + Math.sin(time * 5) * 0.1 + (Math.random() - 0.5) * 0.1;

            pointLights.forEach(light => {
                light.intensity = flicker;
            });

            lightMeshes.forEach(mesh => {
                // Determine visibility based on flicker threshold for "blinking" effect
                // Or just smooth glow. "Blinking like on or off" implies a harder switch.
                // Let's do a smooth pulse with random jaggedness.
                mesh.material.color.setHex(0xffaa00);
                mesh.visible = true;
            });
        } else {
            // Off state
            pointLights.forEach(light => {
                light.intensity = 0;
            });
            lightMeshes.forEach(mesh => {
                mesh.visible = false;
            });
        }

        renderer.render(scene, camera);
    }

    animate();
});
