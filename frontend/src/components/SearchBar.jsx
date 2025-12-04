// frontend/src/components/SearchBar.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CONFIG } from '../config';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    axios.get(`${CONFIG.API_BASE}/meta/products`)
      .then(res => setCatalog(res.data))
      .catch(err => console.error("Failed to load catalog", err));
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      const filtered = catalog
        .filter(p => p.product_name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6);
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [query, catalog]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!query) return;
    
    if (onSearch) {
      onSearch(query);
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = `/?q=${encodeURIComponent(query)}`;
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-xl z-50" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative group">
        {/* FIX: Added border-2, border-gray-300 and removed transparency so it is visible on any background */}
        <input
          type="text"
          className="w-full pl-6 pr-14 py-4 rounded-full border-2 border-indigo-200 shadow-2xl bg-white text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-indigo-300 focus:outline-none transition-all text-lg"
          placeholder="Search product (e.g. iPhone)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button 
          type="submit"
          className="absolute right-2 top-2 bottom-2 aspect-square rounded-full flex items-center justify-center text-white transition-transform active:scale-95 shadow-md hover:bg-indigo-700"
          style={{ backgroundColor: CONFIG.THEME.primary }}
        >
          <FaSearch size={20} />
        </button>
      </form>
      
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute w-full bg-white mt-2 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          {suggestions.map(s => (
            <div
              key={s.product_id}
              className="px-6 py-3 hover:bg-indigo-50 cursor-pointer border-b last:border-0 border-gray-100 transition-colors flex items-center justify-between group"
              onClick={() => navigate(`/product/${s.product_id}`)}
            >
              <span className="truncate text-gray-800 font-medium">{s.product_name}</span>
              <span className="text-xs text-indigo-500 font-bold opacity-0 group-hover:opacity-100">Select</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}