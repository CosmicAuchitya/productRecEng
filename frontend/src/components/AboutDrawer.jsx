// frontend/src/components/AboutDrawer.jsx
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// --- SPARKLE COMPONENT ---
const Sparkles = () => {
  // Generate random bubbles
  const bubbles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    size: Math.random() * 15 + 5 + 'px',
    color: `hsl(${Math.random() * 360}, 80%, 60%)`, // Rainbow Colors
    delay: Math.random() * 0.5,
    duration: Math.random() * 1 + 1 // 1s to 2s
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0, 1.2, 0], 
            y: -100, // Float up
            x: Math.random() * 50 - 25 // Slight wiggle
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
      // Trigger sparkles
      setShowSparkles(true);
      // Stop sparkles after 2.5s
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
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        className={`absolute top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Rainbow Sparkles Layer */}
        {showSparkles && <Sparkles />}

        <div className="p-8 h-full flex flex-col relative z-10 overflow-y-auto custom-scrollbar">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <div>
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                About The Project
              </h2>
              <p className="text-sm text-gray-500 mt-1">Built by Auchitya Singh</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-10">
            
            {/* Story Section */}
            <div className="prose prose-indigo">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Why I Built This?</h3>
              <p className="text-gray-600 leading-relaxed">
                As a Data Scientist, I didn't just want to train a model in a notebook. I wanted to build a 
                <strong> complete product</strong> that solves a real user problem: <em>"Which product is actually good, beyond the star rating?"</em>
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                RecEngine combines <strong>Machine Learning</strong> with <strong>Sentiment Analysis</strong> to give users a true picture of a product's quality.
              </p>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 uppercase tracking-widest text-xs">Engineering Journey</h3>
              
              <div className="flex gap-4">
                <div className="flex-col items-center hidden sm:flex">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                  <div className="w-0.5 h-full bg-indigo-100 my-1"></div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Data Engineering</h4>
                  <p className="text-sm text-gray-600">Cleaned and processed raw review datasets, handling missing values and noise.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-col items-center hidden sm:flex">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">2</div>
                  <div className="w-0.5 h-full bg-purple-100 my-1"></div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">NLP Core</h4>
                  <p className="text-sm text-gray-600">Used TF-IDF Vectorization to convert text to math, enabling the AI to "read" product descriptions.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-col items-center hidden sm:flex">
                  <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Sentiment Engine</h4>
                  <p className="text-sm text-gray-600">Applied VADER analysis to re-rank products based on actual customer emotions, not just ratings.</p>
                </div>
              </div>
            </div>

            {/* Code Sneak Peek */}
            <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 text-xs text-gray-500 font-mono">logic.py</div>
              <pre className="font-mono text-xs text-green-400 overflow-x-auto">
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
          <div className="mt-12 pt-6 border-t text-center">
            <p className="text-indigo-600 font-medium">Ready to solve complex data problems.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
