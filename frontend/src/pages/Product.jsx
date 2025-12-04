// frontend/src/pages/Product.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CONFIG } from '../config';
import axios from 'axios';
import RecommendationGrid from '../components/RecommendationGrid';
import SentimentChart from '../components/SentimentChart';
import { FaStar, FaAmazon, FaCheckCircle, FaExclamationCircle, FaMinusCircle, FaSyncAlt } from 'react-icons/fa';

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Live Price States
  const [livePrice, setLivePrice] = useState(null);
  const [checkingPrice, setCheckingPrice] = useState(false);
  const [priceStatus, setPriceStatus] = useState(''); // 'live' or 'cached'

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      setLivePrice(null); // Reset live price on new product
      try {
        const [prodRes, recRes] = await Promise.all([
          axios.get(`${CONFIG.API_BASE}/product/${id}`),
          axios.get(`${CONFIG.API_BASE}/recommend/by_id`, { params: { product_id: id, top_n: 4 } })
        ]);
        setProduct(prodRes.data);
        setRecs(recRes.data.recommendations);
      } catch (err) {
        console.error("Failed to fetch product data", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const checkLivePrice = async () => {
    setCheckingPrice(true);
    try {
      const res = await axios.get(`${CONFIG.API_BASE}/product/live_price/${id}`);
      setLivePrice(res.data.price);
      setPriceStatus(res.data.status);
    } catch (err) {
      alert("Could not connect to Amazon right now. Showing last known price.");
    } finally {
      setCheckingPrice(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2" style={{ borderColor: CONFIG.THEME.primary }}></div>
    </div>
  );

  if (!product) return <div className="text-center py-20">Product not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* Product Hero Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Image Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-2xl bg-gray-50 p-8 flex items-center justify-center h-[500px] border border-gray-100"
            >
              <img 
                src={product.img_link || CONFIG.PLACEHOLDER_IMAGE} 
                alt={product.product_name}
                className="max-h-full max-w-full object-contain mix-blend-multiply filter drop-shadow-xl"
                onError={(e) => e.target.src = CONFIG.PLACEHOLDER_IMAGE}
              />
            </motion.div>

            {/* Info Container */}
            <div className="flex flex-col justify-center space-y-6">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{product.category}</span>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {product.product_name}
              </h1>

              <div className="flex items-start space-x-6">
                 {/* Live Price Logic */}
                 <div className="flex flex-col">
                    <div className="flex items-center">
                        <span className="text-4xl font-light text-gray-900">
                          ₹{livePrice || product.discounted_price}
                        </span>
                        {priceStatus === 'live' && (
                            <span className="ml-3 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full animate-pulse">
                                ● LIVE
                            </span>
                        )}
                    </div>
                    
                    {!livePrice && (
                        <button 
                            onClick={checkLivePrice}
                            disabled={checkingPrice}
                            className="flex items-center text-sm text-indigo-600 font-medium mt-2 hover:text-indigo-800 transition-colors"
                        >
                            <FaSyncAlt className={`mr-2 ${checkingPrice ? 'animate-spin' : ''}`} />
                            {checkingPrice ? "Checking Amazon..." : "Check Live Price"}
                        </button>
                    )}
                </div>

                <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full border border-yellow-100 h-fit mt-1">
                  <FaStar className="text-yellow-400 text-xl mr-2" />
                  <span className="text-2xl font-bold text-gray-800">{product.rating}</span>
                  <span className="text-gray-400 text-sm ml-1">/ 5</span>
                </div>
              </div>

              {/* Sentiment Summary */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mt-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">AI Sentiment Analysis</h3>
                <div className="flex flex-wrap items-center gap-8">
                  <SentimentChart positive={product.percent_positive} negative={product.percent_negative} />
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <FaCheckCircle className="text-green-500 mr-2" />
                      <span className="font-medium">{product.percent_positive.toFixed(1)}% Positive</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaExclamationCircle className="text-red-500 mr-2" />
                      <span className="font-medium">{product.percent_negative.toFixed(1)}% Negative</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaMinusCircle className="text-gray-400 mr-2" />
                      <span className="font-medium">{(100 - product.percent_positive - product.percent_negative).toFixed(1)}% Neutral</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6">
                <a 
                  href={product.product_link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-[#FF9900] hover:bg-[#ffad33] text-white font-bold rounded-lg transition-transform transform hover:scale-105 shadow-lg"
                >
                  <FaAmazon className="mr-2 text-2xl" />
                  Buy Now on Amazon
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Highlights */}
      {product.reviews_sample && product.reviews_sample.length > 0 && (
        <div className="container mx-auto px-6 py-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Verified Review Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews_sample.map((review, idx) => (
              <div key={idx} className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm text-gray-600 text-sm italic">
                "{review.substring(0, 200)}{review.length > 200 ? '...' : ''}"
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      <div className="container mx-auto px-6 py-12 border-t">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Similar Items You Might Like</h3>
        <RecommendationGrid recommendations={recs} />
      </div>

    </div>
  );
}