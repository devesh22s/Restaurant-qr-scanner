import React from 'react';
import { Mail, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function FindYourAccount() {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Manrope:wght@300;400;500;600&display=swap');
          
          .font-cinzel { font-family: 'Cinzel', serif; }
          .font-manrope { font-family: 'Manrope', sans-serif; }
          
          .gold-gradient-text {
            background: linear-gradient(to bottom, #FDE68A, #D4AF37, #92400E);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}
      </style>

      {/* Main Container */}
      <div className='min-h-screen bg-[#020202] flex justify-center items-center p-4 relative overflow-hidden font-manrope'>
        
        {/* Ambient Background Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>

        <div className='w-full max-w-[450px] relative z-10'>
             
             {/* Decorative Top Icon */}
             <div className="flex justify-center -mb-8 relative z-20">
                 <div className="bg-[#020202] p-2 rounded-full border border-yellow-800/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-700 via-yellow-500 to-yellow-800 flex items-center justify-center shadow-inner">
                       <Search className="w-7 h-7 text-[#1a0f00]" />
                    </div>
                 </div>
              </div>

            {/* Card Container */}
            <div className='bg-black/60 backdrop-blur-xl border border-yellow-600/20 rounded-2xl p-8 pt-12 shadow-2xl relative overflow-hidden'>
                
                {/* Top Border Accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-60"></div>

                {/* Heading */}
                <div className='text-center mb-8'>
                    <h1 className="font-cinzel text-2xl font-bold gold-gradient-text tracking-wide mb-3">
                      Find Your Account
                    </h1>
                    <p className="text-gray-400 text-sm font-light leading-relaxed">
                        Please enter your email address to search for your account details.
                    </p>
                </div>

                {/* Form */}
                <form className='space-y-6'>
                    <div className='space-y-1.5'>
                        <label htmlFor="email" className="text-xs text-yellow-600/80 uppercase tracking-widest font-semibold ml-1">
                          Email Address
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full bg-[#0a0a0a] border border-white/10 text-yellow-50 placeholder-gray-600 text-sm rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all shadow-inner"
                                placeholder="example@gmail.com"
                            />
                        </div>
                    </div>

                    <button 
                        className="group relative w-full py-3.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#291d0a] font-bold rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center transition-transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                         {/* Button Shine Effect */}
                         <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out skew-y-12"></div>
                         
                         <div className="relative flex items-center gap-2">
                             <Search className="w-4 h-4 stroke-[2.5]" />
                             <span className="font-cinzel tracking-wide text-sm font-bold">Search Account</span>
                         </div>
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center border-t border-white/5 pt-6">
                    <Link to="/login" className="text-sm text-gray-500 hover:text-yellow-500 transition-colors inline-flex items-center gap-2 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}

export default FindYourAccount;