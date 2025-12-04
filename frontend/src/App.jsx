import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import Header from './components/Header';
import { CONFIG } from './config';

function App() {
  // Inject config colors as CSS variables for Tailwind to pick up
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', CONFIG.THEME.primary);
    root.style.setProperty('--color-accent', CONFIG.THEME.accent);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans">
        {/* Navigation Header */}
        <Header />
        
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
            <p className="text-sm">© {new Date().getFullYear()} RecEngine Premium. Powered by AI.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;