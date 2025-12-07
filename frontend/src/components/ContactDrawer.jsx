// frontend/src/components/ContactDrawer.jsx
import { useEffect } from 'react';
import { FaTimes, FaLinkedin, FaEnvelope, FaGithub } from 'react-icons/fa';
import { CONFIG } from '../config';

export default function ContactDrawer({ isOpen, onClose }) {
  // Disable body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
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
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-8 h-full flex flex-col">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Let's Connect</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-8 flex-grow">
            <p className="text-gray-600 text-lg leading-relaxed">
              I am currently open to Data Science and Full Stack roles. 
              If you found this project interesting or have a problem statement I can solve, 
              feel free to reach out.
            </p>

            <div className="space-y-6 mt-8">
              
              {/* Email */}
              <a href="mailto:abhigya@example.com" className="flex items-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors group">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <FaEnvelope />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Email Me</p>
                  <p className="text-gray-900 font-semibold">abhigya@example.com</p>
                </div>
              </a>

              {/* LinkedIn */}
              <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noreferrer" className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group">
                <div className="w-12 h-12 bg-[#0077b5] text-white rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <FaLinkedin />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Connect on LinkedIn</p>
                  <p className="text-gray-900 font-semibold">Abhigya (Data Scientist)</p>
                </div>
              </a>

              {/* GitHub */}
              <a href="https://github.com/your-username" target="_blank" rel="noreferrer" className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  <FaGithub />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Check My Code</p>
                  <p className="text-gray-900 font-semibold">github.com/Abhigya</p>
                </div>
              </a>

            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-400 text-sm mt-auto pt-8 border-t">
            <p>Looking forward to building something great together.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
