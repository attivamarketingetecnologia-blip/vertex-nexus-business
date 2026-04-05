// VERTEX NEXUS - Three.js 3D Model Specifications
// Complete implementation guide for holographic energy being

class VertexNexusModel {
  constructor(options = {}) {
    this.options = {
      container: options.container || document.body,
      quality: options.quality || 'high', // 'high', 'medium', 'low'
      interactive: options.interactive || true,
      scale: options.scale || 1.0,
      ...options
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.nexus = null;
    this.particles = null;
    this.clock = new THREE.Clock();
    
    this.state = {
      mode: 'idle', // 'idle', 'active', 'speaking', 'processing'
      emotion: 'neutral', // 'neutral', 'happy', 'focused', 'alert'
      brightness: 1.0
    };
  }

  // Initialize Three.js scene
  async init() {
    // Create scene with dark background
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a1a);
    
    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);
    
    // Add directional light for highlights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
    
    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.options.container.clientWidth / this.options.container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.5, 3);
    
    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: this.options.quality === 'high',
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(
      this.options.container.clientWidth,
      this.options.container.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.options.container.appendChild(this.renderer.domElement);
    
    // Create Nexus character
    await this.createNexus();
    
    // Create particle system
    this.createParticles();
    
    // Create aura effect
    this.createAura();
    
    // Start animation loop
    this.animate();
    
    // Add interactivity if enabled
    if (this.options.interactive) {
      this.setupInteractivity();
    }
  }

  // Create the main Nexus character
  async createNexus() {
    const group = new THREE.Group();
    
    // Create humanoid energy form
    const bodyGeometry = this.createBodyGeometry();
    const bodyMaterial = this.createBodyMaterial();
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);
    
    // Create core energy line
    const coreGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.8, 8);
    const coreMaterial = this.createCoreMaterial();
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.y = 0.9;
    group.add(core);
    
    // Create eye points
    const eyeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      emissive: 0x0ea5e9,
      emissiveIntensity: 2.0
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 1.6, 0.2);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 1.6, 0.2);
    group.add(rightEye);
    
    // Store references for animation
    this.nexus = {
      group,
      body,
      core,
      eyes: { left: leftEye, right: rightEye },
      materials: {
        body: bodyMaterial,
        core: coreMaterial,
        eyes: eyeMaterial
      }
    };
    
    this.scene.add(group);
  }

  // Create custom body geometry (humanoid energy form)
  createBodyGeometry() {
    // Simplified humanoid shape using multiple spheres and capsules
    const group = new THREE.Group();
    
    // Torso (ellipsoid)
    const torsoGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    torsoGeometry.scale(1, 1.5, 0.8);
    const torso = new THREE.Mesh(torsoGeometry);
    torso.position.y = 0.9;
    group.add(torso);
    
    // Head (sphere)
    const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const head = new THREE.Mesh(headGeometry);
    head.position.y = 1.6;
    group.add(head);
    
    // Arms (capsules)
    const armGeometry = new THREE.CapsuleGeometry(0.1, 0.7, 8, 16);
    
    const leftArm = new THREE.Mesh(armGeometry);
    leftArm.position.set(-0.5, 1.0, 0);
    leftArm.rotation.z = Math.PI / 6;
    group.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry);
    rightArm.position.set(0.5, 1.0, 0);
    rightArm.rotation.z = -Math.PI / 6;
    group.add(rightArm);
    
    // Legs (capsules)
    const legGeometry = new THREE.CapsuleGeometry(0.15, 0.8, 8, 16);
    
    const leftLeg = new THREE.Mesh(legGeometry);
    leftLeg.position.set(-0.2, 0.4, 0);
    group.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry);
    rightLeg.position.set(0.2, 0.4, 0);
    group.add(rightLeg);
    
    // Merge geometries for performance
    const mergedGeometry = new THREE.BufferGeometry();
    const geometries = [];
    
    group.traverse((child) => {
      if (child.isMesh) {
        geometries.push(child.geometry);
      }
    });
    
    // In a real implementation, we would merge geometries here
    // For now, return the first geometry as placeholder
    return torsoGeometry;
  }

  // Create custom body material (energy field)
  createBodyMaterial() {
    return new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      transmission: 0.8,
      thickness: 0.5,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
  }

  // Create core energy material with custom shader
  createCoreMaterial() {
    const vertexShader = `
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    
    const fragmentShader = `
      uniform float time;
      uniform vec3 color;
      uniform float intensity;
      
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        // Create pulsing energy effect
        float pulse = sin(time * 2.0) * 0.1 + 0.9;
        float verticalWave = sin(vPosition.y * 5.0 + time * 3.0) * 0.2;
        
        // Core glow
        float coreGlow = 1.0 - abs(vPosition.y - 0.5) * 0.5;
        coreGlow = pow(coreGlow, 3.0);
        
        // Combine effects
        float finalIntensity = coreGlow * pulse * (1.0 + verticalWave) * intensity;
        
        // Output color with glow
        vec3 finalColor = color * finalIntensity;
        gl_FragColor = vec4(finalColor, finalIntensity * 0.8);
      }
    `;
    
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x0ea5e9) },
        intensity: { value: 1.0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }

  // Create particle system
  createParticles() {
    const particleCount = this.options.quality === 'high' ? 500 : 
                         this.options.quality === 'medium' ? 250 : 100;
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const teal = new THREE.Color(0x06d6a0);
    const amber = new THREE.Color(0xf59e0b);
    
    for (let i = 0; i < particleCount; i++) {
      // Random position around character
      const radius = 1.0 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.cos(phi) * radius;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
      
      // Random color (teal or amber)
      const color = Math.random() > 0.7 ? amber : teal;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Random size
      sizes[i] = Math.random() * 0.05 + 0.02;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
    
    // Store original positions for animation
    this.particleData = {
      positions: positions.slice(),
      speeds: new Float32Array(particleCount).map(() => Math.random() * 0.5 + 0.5),
      offsets: new Float32Array(particleCount).map(() => Math.random() * Math.PI * 2)
    };
  }

  // Create aura effect
  createAura() {
    const geometry = new THREE.SphereGeometry(1.2, 32, 32);
    
    const vertexShader = `
      uniform float time;
      uniform float expansion;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        
        // Pulsing expansion
        float pulse = sin(time) * 0.1 + 1.0;
        vec3 expandedPosition = position * pulse * expansion;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(expandedPosition, 1.0);
      }
    `;
    
    const fragmentShader = `
      uniform vec3 color;
      uniform float opacity;
      uniform float time;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        // Radial gradient
        float distance = length(vPosition);
        float gradient = 1.0 - smoothstep(0.0, 1.2, distance);
        
        // Subtle noise
        float noise = sin(vPosition.x * 10.0 + time) * 
                     sin(vPosition.y * 8.0 + time * 1.3) * 
                     sin(vPosition.z * 12.0 + time * 0.7) * 0.1 + 0.9;
        
        // Final alpha
        float alpha = gradient * noise * opacity;
        
        gl_FragColor = vec4(color, alpha);
      }
    `;
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x0ea5e9) },
        opacity: { value: 0.3 },
        expansion: { value: 1.0 }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    
    this.aura = new THREE.Mesh(geometry, material);
    this.aura.position.y = 0.9;
    this.scene.add(this.aura);
  }

  // Animation loop
  animate() {
    requestAnimationFrame(() => this.animate());
    
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();
    
    // Update materials
    if (this.nexus.materials.core.uniforms) {
      this.nexus.materials.core.uniforms.time.value = time;
    }
    
    if (this.aura.material.uniforms) {
      this.aura.material.uniforms.time.value = time;
    }
    
    // Animate particles
    this.animateParticles(time);
    
    // Animate floating motion
    this.animateFloating(time);
    
    // Animate based on state
    this.updateStateAnimation(time);
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  // Animate particle system
  animateParticles(time) {
    if (!this.particles || !this.particleData) return;
    
    const positions = this.particles.geometry.attributes.position.array;
    const originalPositions = this.particleData.positions;
    const speeds = this.particleData.speeds;
    const offsets = this.particleData.offsets;
    
    for (let i = 0; i < positions.length / 3; i++) {
      const idx = i * 3;
      const speed = speeds[i];
      const offset = offsets[i];
      
      // Orbital motion with slight randomness
      const angle = time * speed + offset;
      const radius = 1.0 + Math.sin(time * 0.5 + offset) * 0.2;
      
      positions[idx] = originalPositions[idx] + Math.cos(angle) * radius * 0.1;
      positions[idx + 1] = originalPositions[idx + 1] + Math.sin(angle * 1.3) * radius * 0.1;
      positions[idx + 2] = originalPositions[idx + 2] + Math.sin(angle * 0.7) * radius * 0.1;
    }
    
    this.particles.geometry.attributes.position.needsUpdate = true;
  }

  // Animate floating motion
  animateFloating(time) {
    if (!this.nexus) return;
    
    // Gentle up/down motion
    const floatAmount = Math.sin(time * 0.5) * 0.05;
    this.nexus.group.position.y = floatAmount;
    
    // Subtle rotation
    this.nexus.group.rotation.y = Math.sin(time * 0.1) * 0.1;
  }

  // Update animation based on current state
  updateStateAnimation(time) {
    if (!this.nexus || !this.aura) return;
    
    switch (this.state.mode) {
      case 'idle':
        this.nexus.materials.core.uniforms.intensity.value = 1.0;
        this.aura.material.uniforms.expansion.value = 1.0;
        break;
        
      case 'active':
        this.nexus.materials.core.uniforms.intensity.value = 1.5 + Math.sin(time * 5) * 0.2;
        this.aura.material.uniforms.expansion.value = 1.2;
        break;
        
      case 'speaking':
        const eyePulse = Math.sin(time * 6) * 0.5 + 1.0;
        this.nexus.eyes.left.scale.setScalar(eyePulse);
        this.nexus.eyes.right.scale.setScalar(eyePulse);
        this.aura.material.uniforms.expansion.value = 1.1 + Math.sin(time * 3) * 0.1;
        break;
        
      case 'processing':
        this.nexus.materials.core.uniforms.intensity.value = 2.0 + Math.sin(time * 8) * 0.5;
        this.aura.material.uniforms.expansion.value = 1.3;
        break;
    }
  }

  // Set character state
  setState(mode, emotion = 'neutral') {
    this.state.mode = mode;
    this.state.emotion = emotion;
    
    // Update visual parameters based on emotion
    switch (emotion) {
      case 'happy':
        this.nexus.materials.core.uniforms.color.value.setHex(0x0ea5e9);
        break;
      case 'focused':
        this.nexus.materials.core.uniforms.color.value.setHex