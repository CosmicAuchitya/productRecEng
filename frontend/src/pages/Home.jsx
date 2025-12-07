// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { CONFIG } from '../config';
import SearchBar from '../components/SearchBar';
import RecommendationGrid from '../components/RecommendationGrid';
import ThreeLogoScene from '../components/ThreeLogoScene';
import axios from 'axios';

// NOTE: AboutSection removed from here

export default function Home() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seedProduct, setSeedProduct] = useState(null);
  
  const location = useLocation();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]); 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    
    if (q) {
      fetchRecommendations(q);
    } else {
      setRecommendations([]);
      setSeedProduct(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.search]);

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
      
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[100vh] w-full overflow-hidden flex items-center justify-center">
        
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
          <div className="absolute inset-0" style={{ background: CONFIG.THEME.bgOverlay }}></div>
        </motion.div>

        <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
              <SearchBar onSearch={(q) => window.location.href = `/?q=${encodeURIComponent(q)}`} />
              <div className="mt-4 text-sm text-gray-400">
                Try searching for: 
                <span className="text-white ml-1">iPhone Case, Headphones</span>
              </div>
            </div>
          </motion.div>

          <div className="hidden lg:block h-[500px] w-full relative">
            <ThreeLogoScene />
          </div>
        </div>
      </div>

      {/* --- RECOMMENDATIONS SECTION --- */}
      {recommendations.length > 0 && (
        <div id="results" className="container mx-auto px-6 py-20 min-h-[50vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: CONFIG.THEME.primary, borderTopColor: 'transparent' }}></div>
              <p className="text-gray-500 font-medium">Analyzing products...</p>
            </div>
          ) : (
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
          )}
        </div>
      )}

    </div>
  );
}
