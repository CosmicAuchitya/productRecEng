// frontend/src/components/AboutSection.jsx
import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        
        {/* --- Part 1: About Me --- */}
        <div className="max-w-4xl mx-auto mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-indigo-600 font-bold tracking-widest uppercase text-sm">The Developer</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-6">Hi, I'm Auchitya Singh.</h2>
            <div className="text-lg text-gray-600 leading-relaxed space-y-4">
              <p>
                I am an aspiring <strong>Data Scientist</strong> with a relentless drive to solve real-world problems through data. 
                Unlike the average fresher, I don't just build models; I build <strong>products</strong>.
              </p>
              <p>
                This project represents my commitment to the craft. I believe that data is only as powerful as the story it tells and the value it delivers to the user. 
                I am ready to bring this same energy, technical depth, and "figure-it-out" attitude to a professional team where I can contribute, learn, and grow.
              </p>
            </div>
          </motion.div>
        </div>

        {/* --- Part 2: About This Project (The Journey) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border-t border-gray-100 pt-20">
          
          <div>
            <span className="text-indigo-600 font-bold tracking-widest uppercase text-sm">Behind The Scenes</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-6">How I Built "RecEngine"</h2>
            <p className="text-gray-600 mb-6">
              I wanted to move beyond basic tutorials and build an end-to-end system that mimics a real-world production environment. Here is the engineering journey behind this platform:
            </p>
            
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">1</div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Data Engineering</h4>
                  <p className="text-gray-600 text-sm">Raw data is never clean. I processed thousands of messy review records, handled missing values, and standardized text data to ensure the ML model receives quality input.</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">2</div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">The NLP Brain (TF-IDF & Cosine Similarity)</h4>
                  <p className="text-gray-600 text-sm">To make the system "understand" products, I converted textual descriptions into mathematical vectors using TF-IDF. This allows the engine to mathematically calculate similarity between a search query and thousands of products instantly.</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">3</div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Sentiment Intelligence</h4>
                  <p className="text-gray-600 text-sm">A 5-star rating can be misleading. I implemented VADER Sentiment Analysis to parse actual user reviews, re-ranking products based on true customer emotions rather than just raw clicks.</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">4</div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Full Stack Integration</h4>
                  <p className="text-gray-600 text-sm">Finally, I wrapped this logic in a high-performance Python (FastAPI) backend and connected it to a modern React frontend with 3D visuals, ensuring the user experience is as smooth as the algorithm behind it.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual/Image for Project Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl transform rotate-3 opacity-20"></div>
            <div className="relative bg-gray-900 rounded-2xl p-8 shadow-2xl text-white">
              <pre className="font-mono text-sm overflow-x-auto text-green-400">
{`# The Logic in a Nutshell

def recommend(user_query):
    # 1. Understand Query
    vector = tfidf.transform([user_query])
    
    # 2. Find Neighbors
    similar_products = nn_model.kneighbors(vector)
    
    # 3. Apply Sentiment Boost
    for product in similar_products:
        if product.sentiment > 0.2:
            product.score += 0.05  # Boost
        elif product.sentiment < -0.05:
            product.score -= 0.05  # Penalize
            
    return sort_by_score(similar_products)

# Delivering Value, not just code.`}
              </pre>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
