import React from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  UtensilsCrossed,
  UserPlus,
  LogIn,
  User,
  Sparkles,
  ChevronRight,
  Star,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { session } from "../redux/guestSlice";

const Welcome = () => {
  console.log(useParams);
  console.log(useSearchParams);

  const [searchParams] = useSearchParams();
  const getqrSlug = searchParams.get("qr");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleContinueAsGuest = () => {
    dispatch(session({ deviceId: "dppstt", qrSlug: getqrSlug }));
    localStorage.setItem("guestMode", "true");
    navigate("/");
  };

  return (
    <>
      {/* 1. EMBEDDING LUXURY FONTS */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Manrope:wght@300;400;500;600&display=swap');
          
          .font-cinzel { font-family: 'Cinzel', serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-manrope { font-family: 'Manrope', sans-serif; }
          
          .gold-gradient-text {
            background: linear-gradient(to bottom, #FDE68A, #D4AF37, #92400E);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          .gold-border-gradient {
            border: 1px solid transparent;
            background: linear-gradient(#050505, #050505) padding-box,
                        linear-gradient(135deg, rgba(212, 175, 55, 0.4), rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.4)) border-box;
          }
        `}
      </style>

      {/* 2. MAIN CONTAINER */}
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-4 relative overflow-hidden font-manrope selection:bg-yellow-500/30">
        {/* Ambient Background Lights */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-yellow-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>

        {/* 3. THE CARD */}
        <div className="relative w-full max-w-md z-10">
          {/* Decorative Top Ornament */}
          <div className="flex justify-center -mb-6 relative z-20">
            <div className="bg-[#020202] p-3 rounded-full border border-yellow-800/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-700 via-yellow-500 to-yellow-800 flex items-center justify-center shadow-inner">
                <UtensilsCrossed className="w-8 h-8 text-[#1a0f00]" />
              </div>
            </div>
          </div>

          <div className="gold-border-gradient rounded-2xl shadow-2xl backdrop-blur-sm bg-black/60 pt-10 pb-8 px-8">
            {/* Header Text */}
            <div className="text-center mb-10 space-y-2">
              <h1 className="font-cinzel text-4xl font-bold gold-gradient-text tracking-wider drop-shadow-sm">
                SavoryBites
              </h1>
              <div className="flex items-center justify-center gap-2 opacity-60 mb-2">
                <div className="h-[1px] w-8 bg-yellow-700"></div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-yellow-500">
                  Est. 2024
                </span>
                <div className="h-[1px] w-8 bg-yellow-700"></div>
              </div>
              <p className="font-playfair text-lg text-gray-300 italic">
                "Where taste meets luxury."
              </p>
            </div>

            {/* ACTION BUTTONS (Enhanced) */}
            <div className="space-y-4 mb-10">
              {/* PRIMARY: REGISTER */}
              <Link
                to="/register"
                className="group relative w-full py-4 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] rounded-sm shadow-[0_5px_15px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center transition-transform active:scale-[0.98]"
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out skew-y-12"></div>

                <div className="relative flex items-center gap-3 text-[#291d0a]">
                  <UserPlus className="w-5 h-5 stroke-[2.5]" />
                  <span className="font-cinzel font-bold tracking-wide text-base">
                    Register Now
                  </span>
                </div>
              </Link>

              {/* SECONDARY: LOGIN */}
              <Link
                to="/login"
                className="group relative w-full py-4 bg-transparent border border-[#BF953F]/40 rounded-sm flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-[#BF953F] hover:bg-[#BF953F]/10"
              >
                <div className="relative flex items-center gap-3 text-[#e2cf9d] group-hover:text-[#FCF6BA] transition-colors">
                  <LogIn className="w-5 h-5 group-hover:drop-shadow-[0_0_5px_rgba(252,246,186,0.5)]" />
                  <span className="font-manrope font-semibold tracking-wider text-sm uppercase">
                    Member Login
                  </span>
                </div>
                {/* Arrow hint on hover */}
                <ChevronRight className="absolute right-4 w-4 h-4 text-[#BF953F] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </Link>

              {/* TERTIARY: GUEST */}
              <button
                onClick={handleContinueAsGuest}
                className="w-full py-2 text-gray-200 hover:text-white transition duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] rounded-md border
border-[#C9A33A] bg-gradient-to-b from-black via-[#0A0A0A] to-[#111] 
hover:border-[#FFD776] 
shadow-[0_0_8px_rgba(255,215,0,0.35),inset_0_0_10px_rgba(255,215,0,0.15)]
hover:shadow-[0_0_12px_rgba(255,215,0,0.5),inset_0_0_12px_rgba(255,215,0,0.25)] 
hover:bg-gradient-to-b hover:from-[#0A0A0A] hover:via-black hover:to-[#0A0A0A]"
              >
                <User className="w-3.5 h-3.5 group-hover:text-yellow-500 transition-colors" />
                <span className="border-b border-transparent group-hover:border-yellow-500/50 pb-0.5">
                  Continue as Guest
                </span>
              </button>
            </div>

            {/* FOOTER: BENEFITS */}
            <div className="relative mt-6 pt-6 border-t border-white/5">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#050505] px-3 text-yellow-600">
                <Star className="w-5 h-5 fill-yellow-900/40" />
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                {[
                  "Loyalty Rewards",
                  "Priority Booking",
                  "Chef Specials",
                  "Order History",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-yellow-500/70" />
                    <span className="text-xs text-gray-400 font-manrope font-light">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
