// frontend/src/components/Header.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { CONFIG } from '../config';
import { FaCube } from 'react-icons/fa';

export default function Header({ onContactClick, onAboutClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/'); 
    } else {
      navigate('/');
    }
  };
  
  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-6">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="/" onClick={handleHomeClick} className="flex items-center space-x-2 group cursor-pointer">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110"
            style={{ backgroundColor: CONFIG.THEME.primary }}
          >
            <FaCube className="text-xl" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
            Rec<span style={{ color: CONFIG.THEME.primary }}>Engine</span>
          </span>
        </a>
        
        <nav className="hidden md:flex space-x-8 text-white/90 font-medium text-sm uppercase tracking-widest">
          <button onClick={handleHomeClick} className="hover:text-white transition-colors cursor-pointer uppercase tracking-widest">Home</button>
          
          {/* Now triggers the Drawer instead of Scroll */}
          <button onClick={onAboutClick} className="hover:text-white transition-colors cursor-pointer uppercase tracking-widest">About Project</button>
          
          <button onClick={onContactClick} className="hover:text-white transition-colors uppercase tracking-widest">Contact</button>
        </nav>
      </div>
    </header>
  );
}
