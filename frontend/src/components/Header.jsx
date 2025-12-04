// frontend/src/components/Header.jsx
import { Link } from 'react-router-dom';
import { CONFIG } from '../config';
import { FaCube } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-6">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          {/* Logo Icon */}
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110"
            style={{ backgroundColor: CONFIG.THEME.primary }}
          >
            <FaCube className="text-xl" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
            Rec<span style={{ color: CONFIG.THEME.primary }}>Engine</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex space-x-8 text-white/90 font-medium text-sm uppercase tracking-widest">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  );
}