// frontend/src/App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import Header from './components/Header';
import ContactDrawer from './components/ContactDrawer';
import { CONFIG } from './config';

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Inject config colors
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', CONFIG.THEME.primary);
    root.style.setProperty('--color-accent', CONFIG.THEME.accent);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans relative">
        
        {/* Contact Slide-Over */}
        <ContactDrawer isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

        {/* Navigation Header with Contact Trigger */}
        <Header onContactClick={() => setIsContactOpen(true)} />
        
        {/* Page Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Product />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8 mt-auto">
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm">© {new Date().getFullYear()} RecEngine Premium. Built with passion by Abhigya.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
