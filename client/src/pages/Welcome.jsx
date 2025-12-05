import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, UserPlus, LogIn, User, Sparkles } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();

  const handleContinueAsGuest = () => {
    // You can add guest logic here, for now just navigate to homepage
    // or set a guest flag in localStorage
    localStorage.setItem('guestMode', 'true');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-12">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-800 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-md mx-auto">
        {/* Logo and Branding Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-800/50 border border-gray-700/50 flex items-center justify-center shadow-lg">
              <UtensilsCrossed className="w-12 h-12 text-gray-200" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-3">SavoryBites</h1>
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Restaurant Management</p>
          <p className="text-base text-gray-300 max-w-xs mx-auto">
            Experience fine dining with our curated menu and exceptional service
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <Link
            to="/register"
            className="w-full py-3.5 px-6 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 flex items-center justify-center gap-3 text-base shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            <span>Register</span>
          </Link>

          <Link
            to="/login"
            className="w-full py-3.5 px-6 bg-gray-900/50 border border-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900/70 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-all duration-200 flex items-center justify-center gap-3 text-base"
          >
            <LogIn className="w-5 h-5" />
            <span>Login</span>
          </Link>

          <button
            onClick={handleContinueAsGuest}
            className="w-full py-3.5 px-6 bg-gray-900/30 border border-gray-800/50 text-gray-300 font-semibold rounded-lg hover:bg-gray-900/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition-all duration-200 flex items-center justify-center gap-3 text-base"
          >
            <User className="w-5 h-5" />
            <span>Continue as Guest</span>
          </button>
        </div>

        {/* Benefits Section */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-100">Why Join Us?</h3>
          </div>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
              Earn loyalty points on every order
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
              Exclusive member discounts and offers
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
              Priority support and faster service
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
              Track your order history and preferences
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
