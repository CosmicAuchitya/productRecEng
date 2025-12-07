// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CONFIG } from '../config';
import SearchBar from '../components/SearchBar';
import RecommendationGrid from '../components/RecommendationGrid';
import ThreeLogoScene from '../components/ThreeLogoScene';
import AboutSection from '../components/AboutSection';
import axios from 'axios';

export default function Home() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seedProduct, setSeedProduct] = useState(null);
  
  // Parallax Effect Logic
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]); 

  // Check URL params for shared search queries
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) fetchRecommendations(q);
    
    // Handle hash scroll for #about if loaded directly
    if (window.location.hash === '#about') {
      setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, []);

  // Helper to fetch recommendations
  const fetchRecommendations = async (query) => {
    setLoading(true);
    try {
      const res = await axios.get(`${CONFIG.API_BASE}/recommend/by_name`, {
        params: { q: query, top_n: 8 } 
      });
      setSeedProduct({
        id: res.data.seed_product_id,
        name: res.data.seed_product_name,
        matchScore: res.data.match_score
      });
      setRecommendations(res.data.recommendations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[95vh] w-full overflow-hidden flex items-center justify-center">
        
        {/* Background Image with Parallax */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: CONFIG.ANIMATION_SETTINGS.backgroundParallax ? y1 : 0 }}
        >
          <img 
            src={CONFIG.HERO_IMAGE} 
            onError={(e) => e.target.style.display = 'none'} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0" 
            style={{ background: CONFIG.THEME.bgOverlay }}
          ></div>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text & Search */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              Discover Your <br/>
              <span style={{ color: CONFIG.THEME.primary }}>Next Obsession</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-lg font-light">
              AI-driven recommendations tailored to your taste. 
              Analyze sentiment, compare prices, and find the best deals instantly.
            </p>
            
            <div className="pt-4">
              <SearchBar onSearch={fetchRecommendations} />
              <div className="mt-4 text-sm text-gray-400">
                Try searching for: 
                <button onClick={() => fetchRecommendations('iPhone Case')} className="ml-1 hover:text-white underline decoration-dotted">iPhone Case</button>,
                <button onClick={() => fetchRecommendations('Headphones')} className="ml-1 hover:text-white underline decoration-dotted">Headphones</button>
              </div>
            </div>
          </motion.div>

          {/* Right: 3D Logo Scene */}
          <div className="hidden lg:block h-[500px] w-full relative">
            <ThreeLogoScene />
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={() => document.getElementById('results').scrollIntoView({ behavior: 'smooth'})}
        >
          <span className="text-sm uppercase tracking-widest">Scroll to Explore</span>
        </motion.div>
      </div>

      {/* --- RECOMMENDATIONS SECTION --- */}
      <div id="results" className="container mx-auto px-6 py-20 min-h-[50vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: CONFIG.THEME.primary, borderTopColor: 'transparent' }}></div>
            <p className="text-gray-500 font-medium">Analyzing products...</p>
          </div>
        ) : recommendations.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-10 flex items-end justify-between border-b pb-4">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Results for</p>
                <h2 className="text-3xl font-bold text-gray-800">
                  {seedProduct?.name} <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded ml-2">Match: {seedProduct?.matchScore?.toFixed(0)}%</span>
                </h2>
              </div>
            </div>
            <RecommendationGrid recommendations={recommendations} />
          </motion.div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">Search for a product above to see AI recommendations.</p>
          </div>
        )}
      </div>

      {/* --- ABOUT SECTION --- */}
      <AboutSection />

    </div>
  );
}
