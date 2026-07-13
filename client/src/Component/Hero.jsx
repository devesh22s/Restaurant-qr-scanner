import React from 'react';
import {
  UtensilsCrossed,
  ArrowRight,
  Star,
  Clock,
  Award,
  Sparkles,
  ChefHat,
} from 'lucide-react';

const Hero = ({ activeTable }) => {
  return (
    <>
      {/* GLOBAL THEME STYLES & ADVANCED ANIMATIONS */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Manrope:wght@300;400;500;600&display=swap');
          
          .font-cinzel { font-family: 'Cinzel', serif; }
          .font-manrope { font-family: 'Manrope', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          
          .gold-text-gradient { 
            background: linear-gradient(to right, #FDE68A 0%, #D4AF37 50%, #B38728 100%); 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent; 
          }

          .text-glow {
            text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
          }
          
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes pulse-ring {
            0% { transform: scale(0.95); opacity: 0.5; }
            50% { transform: scale(1.05); opacity: 0.2; }
            100% { transform: scale(0.95); opacity: 0.5; }
          }

          .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
          .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite 2s; }
          .animate-spin-slow { animation: spin-slow 20s linear infinite; }
          .animate-spin-slow-reverse { animation: spin-slow 25s linear infinite reverse; }
          .animate-pulse-ring { animation: pulse-ring 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        `}
      </style>

      {/* Main Container: Deep Cinematic Black */}
      <div className="relative overflow-hidden bg-[#000000] border-b border-yellow-600/10 font-manrope min-h-screen lg:min-h-0 flex items-center">
        {/* Abstract Ambient Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-yellow-600/10 to-transparent rounded-full blur-[120px] animate-pulse"></div>
          <div
            className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-yellow-900/10 rounded-full blur-[100px]"
            style={{ animation: 'pulse-ring 8s infinite' }}
          ></div>
          {/* Subtle Leather/Noise Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20 mix-blend-overlay"></div>
          {/* Vignette Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-80"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32 z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* LEFT COLUMN: TEXT CONTENT */}
            <div className="text-center lg:text-left space-y-8 relative z-20">
              {/* Dynamic Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-black/40 border border-yellow-600/30 rounded-full backdrop-blur-xl shadow-[0_0_20px_rgba(212,175,55,0.1)] group hover:bg-yellow-900/20 hover:border-yellow-500/50 transition-all duration-500 cursor-default">
                {activeTable ? (
                  <>
                    <ChefHat className="w-4 h-4 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                    <span className="text-xs font-bold text-yellow-100 tracking-[0.2em] uppercase">
                      Welcome to Table {activeTable}
                    </span>
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                    <span className="text-xs font-bold text-yellow-100 tracking-[0.2em] uppercase">
                      Rated 4.8/5 by 5000+ Patrons
                    </span>
                  </>
                )}
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] tracking-tight">
                <span className="font-playfair italic font-light text-gray-300 text-3xl md:text-4xl lg:text-5xl block mb-2">
                  {activeTable ? 'Your Journey Begins' : 'Experience'}
                </span>
                <span className="block font-cinzel font-bold gold-text-gradient text-glow">
                  Culinary
                </span>
                <span className="block font-cinzel text-white/95 mt-2">
                  Mastery
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light tracking-wide">
                Immerse yourself in a symphony of flavors. We craft exceptional
                vegetarian cuisine where ancient recipes meet modern artistry to
                create an unforgettable dining legacy.
              </p>

              {/* Features List */}
              <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center lg:justify-start pt-2">
                {[
                  { icon: Clock, text: 'Swift Service' },
                  { icon: Award, text: 'Award Winning' },
                  { icon: UtensilsCrossed, text: 'Pure Vegetarian' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-gray-300 group"
                  >
                    <div className="p-2 rounded-full bg-yellow-900/10 border border-yellow-600/20 group-hover:border-yellow-500/50 group-hover:bg-yellow-900/30 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300">
                      <item.icon className="w-4 h-4 text-yellow-500" />
                    </div>
                    <span className="text-xs uppercase tracking-widest font-semibold text-gray-400 group-hover:text-yellow-100 transition-colors">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-6">
                <button
                  onClick={() => {
                    const menuSection = document.getElementById('menu-section');
                    if (menuSection) {
                      menuSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden flex items-center justify-center gap-3 transition-transform active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <div className="absolute inset-0 bg-yellow-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                  <span className="relative font-cinzel tracking-widest uppercase text-sm">
                    Explore Menu
                  </span>
                  <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: ADVANCED VISUALS */}
            <div className="relative hidden lg:flex h-[600px] items-center justify-center perspective-[1000px]">
              {/* Glowing Ambient Core */}
              <div className="absolute w-[300px] h-[300px] bg-yellow-600/20 rounded-full blur-[80px] animate-pulse-ring"></div>

              {/* Concentric Rotating Rings */}
              <div className="absolute w-[450px] h-[450px] rounded-full border border-yellow-600/20 animate-spin-slow"></div>
              <div className="absolute w-[350px] h-[350px] rounded-full border border-dashed border-yellow-500/30 animate-spin-slow-reverse"></div>
              <div className="absolute w-[250px] h-[250px] rounded-full border-t-2 border-l-2 border-yellow-400/40 animate-spin-slow shadow-[0_0_30px_rgba(212,175,55,0.1)]"></div>

              {/* Center Element */}
              <div className="relative z-10 w-[180px] h-[180px] bg-black/80 backdrop-blur-xl border border-yellow-500/30 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                <UtensilsCrossed className="w-20 h-20 text-yellow-500 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
              </div>

              {/* Floating Glass Card 1 (Top Right) */}
              <div className="absolute top-20 right-0 animate-float-slow z-20">
                <div className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-900 flex items-center justify-center p-0.5">
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-cinzel font-bold text-sm">
                      Chef's Signature
                    </p>
                    <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-1">
                      Discover Perfection
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Glass Card 2 (Bottom Left) */}
              <div className="absolute bottom-32 left-0 animate-float-delayed z-20">
                <div className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center overflow-hidden`}
                      >
                        <img
                          src={`https://i.pravatar.cc/100?img=${i + 12}`}
                          alt="User"
                          className="w-full h-full object-cover opacity-80"
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-white font-cinzel font-bold text-sm">
                      Top Rated
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block z-10">
          <div className="flex flex-col items-center gap-2 text-yellow-600/50">
            <span className="text-[9px] uppercase tracking-[0.4em] font-bold">
              Scroll
            </span>
            <div className="w-5 h-8 border border-yellow-600/30 rounded-full flex justify-center p-1 relative overflow-hidden">
              <div className="w-1 h-2 bg-yellow-500 rounded-full absolute top-1 animate-[float-slow_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
