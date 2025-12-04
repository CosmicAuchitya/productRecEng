// frontend/src/config.js
/**
 * CENTRAL CONFIGURATION FILE
 * Edit this file to change the visual appearance and behavior of the frontend.
 */

export const CONFIG = {
  // --- VISUAL ASSETS ---
  // Place your images in frontend/public/assets/
  HERO_IMAGE: '/assets/hero.jpg',       // Background for home page (1920x1080 recommended)
  LOGO_MODEL: '/assets/logo.glb',       // 3D Model file (GLB format recommended)
  PLACEHOLDER_IMAGE: '/assets/placeholder.jpg', // Fallback for missing product images

  // --- THEME COLORS ---
  THEME: {
    primary: '#0ea5a4',      // Main brand color (Teal)
    accent: '#7c3aed',       // Accent color (Purple) for buttons/highlights
    bgOverlay: 'rgba(15, 23, 42, 0.65)', // Dark overlay on hero image to make text readable
    textLight: '#ffffff',    // Text color on dark backgrounds
  },

  // --- 3D SCENE SETTINGS ---
  ENABLE_3D_LOGO: true, // Set to false to force SVG fallback even if WebGL is available
  ANIMATION_SETTINGS: {
    logoSpinSpeed: 0.5,       // Speed of rotation
    backgroundParallax: true, // Enable scroll parallax effect on hero
    floatIntensity: 1.5,      // Intensity of the floating animation
  },

  // --- API CONNECTION ---
  FRONTEND_PORT: 5173,
  // FIX: Changed VITE_API_BASE to VITE_API_URL to match your Vercel Config
  API_BASE: import.meta.env.VITE_API_URL || 'http://localhost:8000',
};

export default CONFIG;
