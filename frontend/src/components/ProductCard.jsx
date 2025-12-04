import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CONFIG } from '../config';
import { FaStar } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  
  const sentScore = product.avg_sentiment || 0;
  
  // Determine badge style
  let badgeClass = "bg-gray-100 text-gray-600";
  let badgeLabel = "Neutral";
  
  if (sentScore >= 0.2) {
    badgeClass = "bg-green-100 text-green-700 border-green-200";
    badgeLabel = "Positive";
  } else if (sentScore <= -0.05) {
    badgeClass = "bg-red-50 text-red-600 border-red-100";
    badgeLabel = "Negative";
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full overflow-hidden group cursor-pointer"
      onClick={() => navigate(`/product/${product.product_id}`)}
    >
      {/* Image Area */}
      <div className="relative h-56 p-6 bg-white flex items-center justify-center overflow-hidden">
        <img 
          loading="lazy"
          src={product.img_link || CONFIG.PLACEHOLDER_IMAGE} 
          alt={product.product_name} 
          className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          onError={(e) => e.target.src = CONFIG.PLACEHOLDER_IMAGE}
        />
        
        {/* Sentiment Badge */}
        <div className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full border ${badgeClass}`}>
          {badgeLabel}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 line-clamp-1">
          {product.category || 'General'}
        </div>
        
        <h3 className="font-bold text-gray-800 leading-snug mb-2 line-clamp-2 min-h-[2.5rem]" title={product.product_name}>
          {product.product_name}
        </h3>
        
        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900">₹{product.discounted_price}</div>
            <div className="flex items-center mt-1">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-xs text-gray-500 ml-1 font-medium">{product.rating || 0}</span>
            </div>
          </div>
          
          <button 
            className="px-4 py-2 rounded-lg text-sm font-bold text-white opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            style={{ backgroundColor: CONFIG.THEME.primary }}
          >
            View
          </button>
        </div>
      </div>
    </motion.div>
  );
}