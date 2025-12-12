import React from 'react';
import { UtensilsCrossed, MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube, Star } from 'lucide-react';

const Footer = () => {
  return (
    <>
      {/* THEME STYLES */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Manrope:wght@300;400;500;600&display=swap');
          .font-cinzel { font-family: 'Cinzel', serif; }
          .font-manrope { font-family: 'Manrope', sans-serif; }
          .gold-text-gradient { background: linear-gradient(to right, #FDE68A, #D4AF37, #FDE68A); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        `}
      </style>

      <footer className="bg-[#020202] border-t border-yellow-600/30 mt-auto font-manrope relative overflow-hidden">
        
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>

        {/* Advertisement Section */}
        <div className="relative bg-gradient-to-r from-[#050505] via-[#0a0a0a] to-[#050505] border-b border-yellow-600/10 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Special Offer */}
              <div className="group bg-black/40 backdrop-blur-sm border border-yellow-600/20 rounded-lg p-6 text-center hover:border-yellow-500/50 hover:bg-yellow-900/5 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Star className="w-12 h-12 text-yellow-500" />
                </div>
                <div className="text-4xl font-cinzel font-bold text-yellow-500 mb-2 drop-shadow-sm group-hover:scale-105 transition-transform">20% OFF</div>
                <p className="text-gray-300 text-sm font-medium tracking-wide">On your first signature dining experience</p>
                <div className="mt-3 inline-block px-3 py-1 bg-yellow-900/20 border border-yellow-600/30 rounded text-[10px] text-yellow-400 uppercase tracking-widest font-bold">
                  Code: FIRST20
                </div>
              </div>

              {/* Free Delivery */}
              <div className="group bg-black/40 backdrop-blur-sm border border-yellow-600/20 rounded-lg p-6 text-center hover:border-yellow-500/50 hover:bg-yellow-900/5 transition-all duration-300">
                <div className="text-4xl font-cinzel font-bold text-yellow-500 mb-2 drop-shadow-sm group-hover:scale-105 transition-transform">FREE</div>
                <p className="text-gray-300 text-sm font-medium tracking-wide">Complimentary delivery on orders above ₹500</p>
                <p className="text-gray-500 text-xs mt-2 uppercase tracking-wider">Valid for all locations</p>
              </div>

              {/* Loyalty Program */}
              <div className="group bg-black/40 backdrop-blur-sm border border-yellow-600/20 rounded-lg p-6 text-center hover:border-yellow-500/50 hover:bg-yellow-900/5 transition-all duration-300">
                <div className="text-4xl font-cinzel font-bold text-yellow-500 mb-2 drop-shadow-sm group-hover:scale-105 transition-transform">EARN</div>
                <p className="text-gray-300 text-sm font-medium tracking-wide">Accumulate royalty points on every order</p>
                <p className="text-yellow-600/80 text-xs mt-2 uppercase tracking-wider font-bold cursor-pointer group-hover:text-yellow-500 transition-colors">Join the Elite Club &rarr;</p>
              </div>

            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 to-black border border-yellow-600/40 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-yellow-500 transition-colors duration-300">
                  <UtensilsCrossed className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-cinzel font-bold gold-text-gradient">SavoryBites</h3>
                  <p className="text-[9px] text-yellow-600/70 uppercase tracking-[0.25em] font-medium">Est. 2015</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                Serving exquisite vegetarian cuisine with an unwavering commitment to quality, freshness, and exceptional hospitality.
              </p>
              <div className="flex gap-4 pt-2">
                <a href="#" className="w-9 h-9 rounded-full border border-gray-700 bg-gray-900/50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-yellow-500 hover:border-yellow-500 transition-all duration-300">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full border border-gray-700 bg-gray-900/50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-yellow-500 hover:border-yellow-500 transition-all duration-300">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full border border-gray-700 bg-gray-900/50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-yellow-500 hover:border-yellow-500 transition-all duration-300">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full border border-gray-700 bg-gray-900/50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-yellow-500 hover:border-yellow-500 transition-all duration-300">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-yellow-100 font-cinzel font-bold mb-6 text-lg relative inline-block">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-yellow-600/50"></span>
              </h4>
              <ul className="space-y-3">
                {['About Us', 'Our Menu', 'Reservations', 'Events & Catering', 'Gift Cards', 'Careers'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-yellow-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Branch Locations */}
            <div>
              <h4 className="text-yellow-100 font-cinzel font-bold mb-6 text-lg relative inline-block">
                Our Branches
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-yellow-600/50"></span>
              </h4>
              <ul className="space-y-5">
                {[
                  { city: 'Mumbai - Bandra', address: '123 Hill Road, Bandra West', pin: 'Mumbai - 400050' },
                  { city: 'Delhi - Connaught Place', address: '45 Block A, Connaught Place', pin: 'New Delhi - 110001' },
                  { city: 'Bangalore - Koramangala', address: '78 5th Block, Koramangala', pin: 'Bangalore - 560095' }
                ].map((branch, idx) => (
                  <li key={idx}>
                    <div className="flex items-start gap-3 group">
                      <MapPin className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0 group-hover:text-yellow-400 transition-colors" />
                      <div>
                        <p className="text-yellow-50 text-sm font-semibold">{branch.city}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{branch.address}</p>
                        <p className="text-gray-500 text-[10px] uppercase tracking-wider">{branch.pin}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-yellow-100 font-cinzel font-bold mb-6 text-lg relative inline-block">
                Contact Us
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-yellow-600/50"></span>
              </h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 group">
                  <div className="p-2 rounded bg-yellow-900/10 border border-yellow-600/20 group-hover:border-yellow-500/50 transition-colors">
                    <Phone className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider">Call Us</p>
                    <a href="tel:+919876543210" className="text-gray-200 text-sm hover:text-yellow-400 transition-colors font-medium">
                      +91 98765 43210
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="p-2 rounded bg-yellow-900/10 border border-yellow-600/20 group-hover:border-yellow-500/50 transition-colors">
                    <Mail className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider">Email Us</p>
                    <a href="mailto:info@savorybites.com" className="text-gray-200 text-sm hover:text-yellow-400 transition-colors font-medium">
                      info@savorybites.com
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="p-2 rounded bg-yellow-900/10 border border-yellow-600/20 group-hover:border-yellow-500/50 transition-colors">
                    <Clock className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider">Opening Hours</p>
                    <p className="text-gray-200 text-sm font-medium">Mon - Sun: 11:00 AM - 11:00 PM</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5 mt-16 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-xs text-center md:text-left tracking-wide">
                © 2024 SavoryBites. All rights reserved.
              </p>
              <div className="flex gap-8 text-xs">
                <a href="#" className="text-gray-500 hover:text-yellow-500 transition-colors uppercase tracking-wider">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-500 hover:text-yellow-500 transition-colors uppercase tracking-wider">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-500 hover:text-yellow-500 transition-colors uppercase tracking-wider">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;