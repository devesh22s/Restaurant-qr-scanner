import React from 'react';
import { UtensilsCrossed, ArrowRight, Star, Clock, Award, MousePointer2 } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

const Hero = ({activeTable}) => {
  // const navigate = useNavigate();

  return (
    <>
      {/* GLOBAL THEME STYLES */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Manrope:wght@300;400;500;600&display=swap');
          
          .font-cinzel { font-family: 'Cinzel', serif; }
          .font-manrope { font-family: 'Manrope', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          
          .gold-text-gradient { 
            background: linear-gradient(to right, #FDE68A, #D4AF37, #FDE68A); 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent; 
          }
          
          .gold-border-glow {
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.1);
          }
        `}
      </style>

      {/* Main Container: Deep Black with Gold Accents */}
      <div className="relative overflow-hidden bg-[#020202] border-b border-yellow-600/20 font-manrope">
        
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-yellow-900/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-30 mix-blend-overlay"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[500px] lg:min-h-[600px]">
          
            {/* LEFT COLUMN: TEXT CONTENT */}
            <div className="text-center lg:text-left space-y-6 lg:space-y-8">
              
              {/* Rating Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-900/20 border border-yellow-600/30 rounded-full backdrop-blur-md shadow-[0_0_10px_rgba(212,175,55,0.1)] group hover:border-yellow-500/50 transition-colors">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                <span className="text-xs font-semibold text-yellow-100 tracking-wide uppercase">Rated 4.8/5 by 5000+ Connoisseurs</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1]">
                <span className="font-playfair italic font-light text-gray-300">Experience</span>
                <span className="block mt-2 font-cinzel font-bold gold-text-gradient drop-shadow-sm">
                  Authentic Vegetarian
                </span>
                <span className="block mt-1 font-cinzel text-white/90">Cuisine</span>
              </h1>

              {/* Subheading */}
              <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Discover a symphony of flavors with our masterfully crafted vegetarian menu. 
                Fresh harvests, heirloom recipes, and modern culinary artistry unite to create an 
                unforgettable dining journey.
              </p>

              {/* Features List */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
                <div className="flex items-center gap-2 text-gray-300 group">
                  <div className="p-1.5 rounded-full bg-yellow-900/20 border border-yellow-600/20 group-hover:border-yellow-500/50 transition-colors">
                    <Clock className="w-4 h-4 text-yellow-500" />
                  </div>
                  <span className="text-sm tracking-wide">Swift Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 group">
                  <div className="p-1.5 rounded-full bg-yellow-900/20 border border-yellow-600/20 group-hover:border-yellow-500/50 transition-colors">
                    <Award className="w-4 h-4 text-yellow-500" />
                  </div>
                  <span className="text-sm tracking-wide">Premium Quality</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 group">
                  <div className="p-1.5 rounded-full bg-yellow-900/20 border border-yellow-600/20 group-hover:border-yellow-500/50 transition-colors">
                    <UtensilsCrossed className="w-4 h-4 text-yellow-500" />
                  </div>
                  <span className="text-sm tracking-wide">100% Vegetarian</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-8">
                <button
                  onClick={() => {
                    const menuSection = document.getElementById('menu-section');
                    if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#291d0a] font-bold rounded-sm shadow-[0_5px_15px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out skew-y-12"></div>
                  <span className="relative font-cinzel tracking-wide">Explore Menu</span>
                  <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </button>
                
                {activeTable ? (
                  // Agar QR Scan ho chuka hai (Table Active hai)
                  <button
                    className="px-8 py-4 bg-green-900/20 border border-green-500/40 text-green-100 font-semibold rounded-sm cursor-default flex items-center gap-2 font-cinzel tracking-wide shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Dining at Table {activeTable}
                  </button>
                ) : (
                  // Agar QR Scan NAHI hua (Normal User)
                  <button
                    onClick={() => console.log('Reserve table logic')}
                    className="px-8 py-4 bg-transparent border border-yellow-600/40 text-yellow-100 font-semibold rounded-sm hover:bg-yellow-900/20 hover:border-yellow-500/60 transition-all duration-300 font-cinzel tracking-wide"
                  >
                    Reserve a Table
                  </button>
                )}
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-8 pt-10 border-t border-white/10 mt-2">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-white font-cinzel">50K+</div>
                  <div className="text-[10px] text-yellow-600 uppercase tracking-[0.2em] mt-1 font-bold">Patrons</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-white font-cinzel">3</div>
                  <div className="text-[10px] text-yellow-600 uppercase tracking-[0.2em] mt-1 font-bold">Locations</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-white font-cinzel">49+</div>
                  <div className="text-[10px] text-yellow-600 uppercase tracking-[0.2em] mt-1 font-bold">Signature Dishes</div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: VISUALS */}
            <div className="relative hidden lg:block h-full perspective-[1000px]">
              <div className="relative h-full flex items-center justify-center transform hover:rotate-y-2 transition-transform duration-500">
              
                <div className="w-full space-y-6 relative">
                  {/* Floating Cards Container */}
                  <div className="flex gap-6 animate-float relative z-10">
                    
                    {/* Card 1 */}
                    <div className="flex-1 bg-[#0a0a0a]/80 backdrop-blur-md rounded-lg p-6 border border-yellow-600/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] hover:border-yellow-500/50 transition-all duration-500 group">
                      <div className="w-full h-48 bg-gradient-to-br from-yellow-900/10 to-black rounded border border-white/5 mb-4 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-10"></div>
                        <UtensilsCrossed className="w-16 h-16 text-yellow-600/40 group-hover:text-yellow-500/60 transition-colors duration-500" />
                      </div>
                      <div className="h-3 bg-white/10 rounded w-3/4 mb-3"></div>
                      <div className="h-2 bg-white/5 rounded w-1/2"></div>
                    </div>
                    
                    {/* Card 2 */}
                    <div className="flex-1 bg-[#0a0a0a]/80 backdrop-blur-md rounded-lg p-6 border border-yellow-600/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] hover:border-yellow-500/50 transition-all duration-500 mt-12 group" style={{ animationDelay: '0.5s' }}>
                      <div className="w-full h-48 bg-gradient-to-br from-yellow-800/10 to-black rounded border border-white/5 mb-4 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-10"></div>
                        <UtensilsCrossed className="w-16 h-16 text-yellow-700/40 group-hover:text-yellow-500/60 transition-colors duration-500" />
                      </div>
                      <div className="h-3 bg-white/10 rounded w-3/4 mb-3"></div>
                      <div className="h-2 bg-white/5 rounded w-1/2"></div>
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-6 py-3 rounded-sm shadow-[0_0_30px_rgba(234,179,8,0.4)] border border-yellow-300 animate-bounce-slow z-20">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                        <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-black rounded-full animate-ping opacity-75"></div>
                      </div>
                      <span className="text-sm font-bold font-cinzel whitespace-nowrap tracking-wide">Complimentary Delivery more than ₹500</span>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block z-10">
          <div className="flex flex-col items-center gap-3 text-yellow-600/60 animate-bounce">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold">Scroll Down</span>
            <div className="w-5 h-9 border border-yellow-600/40 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-yellow-500 rounded-full animate-scroll-down"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;