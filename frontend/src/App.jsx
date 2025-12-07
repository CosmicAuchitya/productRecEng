// frontend/src/App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import Header from './components/Header';
import ContactDrawer from './components/ContactDrawer';
import AboutDrawer from './components/AboutDrawer'; // <-- NEW
import { CONFIG } from './config';

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false); // <-- NEW STATE

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', CONFIG.THEME.primary);
    root.style.setProperty('--color-accent', CONFIG.THEME.accent);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans relative">
        
        {/* Drawers */}
        <ContactDrawer isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        <AboutDrawer isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

        {/* Header needs both handlers now */}
        <Header 
          onContactClick={() => setIsContactOpen(true)} 
          onAboutClick={() => setIsAboutOpen(true)} 
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Product />} />
          </Routes>
        </main>

        <footer className="bg-slate-900 text-slate-400 py-8 mt-auto">
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm">© {new Date().getFullYear()} RecEngine Premium. Built by Auchitya Singh.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
