// frontend/src/components/ThreeLogoScene.jsx
import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber'; // Removed useFrame import since we aren't using it for rotation anymore
import { useGLTF, Environment, Float, PerspectiveCamera, ContactShadows, Text } from '@react-three/drei';
import { CONFIG } from '../config';

/**
 * 3D Model Component
 * Loads GLB from config path or falls back to a 3D Text placeholder if load fails.
 */
function LogoModel(props) {
  const meshRef = useRef();
  const [error, setError] = useState(false);
  
  // Rotates the model - REMOVED to stop spinning
  // useFrame((state, delta) => {
  //   if (meshRef.current) {
  //     meshRef.current.rotation.y += delta * CONFIG.ANIMATION_SETTINGS.logoSpinSpeed;
  //   }
  // });

  // Try to load GLTF
  let gltf = null;
  try {
    if (!error && CONFIG.ENABLE_3D_LOGO) {
      gltf = useGLTF(CONFIG.LOGO_MODEL, true); // true = useDraco
    }
  } catch (e) {
    console.warn("Failed to load 3D model, using fallback.");
    setError(true);
  }

  // Handle Loading Error or Explicit Disable
  if (error || !gltf) {
    return (
      <group ref={meshRef}>
        {/* Fallback 3D Text */}
        <Text
          fontSize={1.5}
          color={CONFIG.THEME.primary}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
        >
          RecEngine
        </Text>
        <Text
          fontSize={0.5}
          color="white"
          position={[0, -1, 0]}
          anchorX="center"
          anchorY="middle"
        >
          AI Powered
        </Text>
      </group>
    );
  }

  // Render Loaded Model
  return (
    <primitive 
      object={gltf.scene} 
      ref={meshRef} 
      scale={2} 
      {...props} 
    />
  );
}

/**
 * Main Scene Component
 * Handles fallback to SVG/Static content if WebGL crashes or is disabled via config.
 */
export default function ThreeLogoScene() {
  if (!CONFIG.ENABLE_3D_LOGO) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        {/* Elegant SVG Fallback */}
        <svg viewBox="0 0 100 100" className="w-64 h-64 drop-shadow-2xl animate-float">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: CONFIG.THEME.primary, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: CONFIG.THEME.accent, stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <rect x="20" y="20" width="60" height="60" rx="10" fill="url(#grad1)" />
          <path d="M50 35 L65 65 L35 65 Z" fill="white" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 2]}> {/* Handle high DPI screens */}
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Floating Animation Wrapper */}
        <Suspense fallback={null}>
          <Float 
            speed={2} 
            rotationIntensity={0.1} // Reduced to 0.1 for minimal sway (jelly-like) without spinning
            floatIntensity={CONFIG.ANIMATION_SETTINGS.floatIntensity || 1.5}
          >
            <LogoModel />
          </Float>
          
          {/* Environment Reflections */}
          <Environment preset="city" />
        </Suspense>

        {/* Shadow for realism */}
        <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
      </Canvas>
    </div>
  );
}