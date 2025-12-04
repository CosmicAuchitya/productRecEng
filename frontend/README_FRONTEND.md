Premium Frontend - Product Recommender

A high-performance React application featuring 3D visuals (React-Three-Fiber), smooth animations (Framer Motion), and a configuration-driven design.

🚀 Quick Start

Install Dependencies:

npm install


Run Development Server:

npm run dev


Access at http://localhost:5173

🎨 Visual Customization

You don't need to touch the code logic to change the look and feel.
Open src/config.js to edit:

Images: Change HERO_IMAGE and PLACEHOLDER_IMAGE paths.

Colors: Edit THEME.primary (Main color) and THEME.accent.

3D Logo: * Set ENABLE_3D_LOGO to false to use a simple CSS fallback if you don't have a model.

Change LOGO_MODEL to point to your .glb file.

Adjust ANIMATION_SETTINGS.logoSpinSpeed to change rotation speed.

📁 Asset Management

Place your static files in public/assets/.
See public/assets/README.txt for specific file requirements.

🔨 Build for Production

npm run build


This generates a static dist/ folder ready for deployment (Netlify, Vercel, Docker, etc.).