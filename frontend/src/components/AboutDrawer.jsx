// frontend/src/components/AboutDrawer.jsx
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CONFIG } from '../config'; // Import config for images/colors

// --- SPARKLE COMPONENT ---
const Sparkles = () => {
  const bubbles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    size: Math.random() * 15 + 5 + 'px',
    color: `hsl(${Math.random() * 360}, 80%, 60%)`, 
    delay: Math.random() * 0.5,
    duration: Math.random() * 1 + 1 
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0, 1.2, 0], 
            y: -100, 
            x: Math.random() * 50 - 25 
          }}
          transition={{ 
            duration: 2, 
            delay: b.delay, 
            ease: "easeOut" 
          }}
          className="absolute rounded-full shadow-lg"
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            backgroundColor: b.color,
            boxShadow: `0 0 10px ${b.color}`
          }}
        />
      ))}
    </div>
  );
};

export default function AboutDrawer({ isOpen, onClose }) {
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setShowSparkles(true);
      const timer = setTimeout(() => setShowSparkles(false), 2500);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset';
      setShowSparkles(false);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-[100] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        className={`absolute top-0 right-0 h-full w-full max-w-2xl bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        
        {/* --- BACKGROUND LAYER (HERO STYLE) --- */}
        <div className="absolute inset-0 z-0">
            <img 
                src={CONFIG.HERO_IMAGE} 
                alt="Background" 
                className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95))' }}></div>
        </div>

        {/* Sparkles Layer */}
        {showSparkles && <Sparkles />}

        <div className="p-8 h-full flex flex-col relative z-10 overflow-y-auto custom-scrollbar">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-10 border-b border-white/10 pb-6">
            <div>
              {/* HERO STYLE TEXT */}
              <h2 className="text-5xl font-extrabold tracking-tight leading-tight text-white">
                About <br />
                <span style={{ color: CONFIG.THEME.primary }}>The Project</span>
              </h2>
              <p className="text-gray-400 mt-2 font-light tracking-wide">Engineered by Auchitya Singh</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white border border-white/10"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-12">
            
            {/* Story Section */}
            <div className="text-gray-300 leading-relaxed text-lg font-light">
              <h3 className="text-2xl font-bold text-white mb-4">Why I Built This?</h3>
              <p>
                As a Data Scientist, I didn't just want to train a model in a notebook. I wanted to build a 
                <strong className="text-white font-semibold"> complete product</strong> that solves a real user problem: <em>"Which product is actually good, beyond the star rating?"</em>
              </p>
              <p className="mt-4">
                RecEngine combines <strong style={{ color: CONFIG.THEME.primary }}>Machine Learning</strong> with <strong style={{ color: CONFIG.THEME.accent }}>Sentiment Analysis</strong> to give users a true picture of a product's quality.
              </p>
            </div>

            {/* Steps Timeline (Glassmorphism) */}
            <div className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Engineering Journey</h3>
              
              <div className="flex gap-5">
                <div className="flex-col items-center hidden sm:flex">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">1</div>
                  <div className="w-0.5 h-full bg-white/5 my-2"></div>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Data Engineering</h4>
                  <p className="text-gray-400 mt-1">Cleaned and processed raw review datasets, handling missing values and noise.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex-col items-center hidden sm:flex">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">2</div>
                  <div className="w-0.5 h-full bg-white/5 my-2"></div>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">NLP Core</h4>
                  <p className="text-gray-400 mt-1">Used TF-IDF Vectorization to convert text to math, enabling the AI to "read" product descriptions.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="flex-col items-center hidden sm:flex">
                  <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center font-bold">3</div>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Sentiment Engine</h4>
                  <p className="text-gray-400 mt-1">Applied VADER analysis to re-rank products based on actual customer emotions, not just ratings.</p>
                </div>
              </div>
            </div>

            {/* Code Sneak Peek */}
            <div className="bg-black/40 rounded-xl p-6 text-white shadow-inner border border-white/5 font-mono text-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-2 text-xs text-gray-600">logic.py</div>
              <div className="text-gray-500 mb-2"># How the magic happens</div>
              <pre className="text-green-400 overflow-x-auto custom-scrollbar">
{`def recommend(query):
  # 1. Vectorize
  vec = tfidf.transform([query])
  
  # 2. Find Neighbors
  recs = nn.kneighbors(vec)
  
  # 3. Boost by Sentiment
  if sentiment > 0.2:
      score += boost`}
              </pre>
            </div>

          </div>

          {/* Footer */}
          <div className="mt-auto pt-8 border-t border-white/10 text-center">
            <p className="text-indigo-400/80 font-medium text-sm">Ready to solve complex data problems.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
