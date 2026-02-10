import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, googleLogin } from "../redux/authSlice";
import {
  UtensilsCrossed,
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  Check
} from "lucide-react";
export default function Login() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // ✅ 1. Auto-Redirect (Based on LocalStorage for instant check)
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const token = localStorage.getItem("accessToken");

    if (token && storedRole) {
      if (storedRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ 2. Handle Login Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData))
      .unwrap()
      .then((payload) => {
        // NOTE: payload structure is likely { success: true, data: {name, email...}, accessToken: "..." }
        
        console.log("Login Payload:", payload); // Debugging ke liye

        // --- FIX STARTS HERE ---
        // Humein manually bhi save karna chahiye taaki navigation ke turant baad data mile
        
        // 1. Save Token
        localStorage.setItem("accessToken", payload.accessToken);
        
        // 2. Save Role
        localStorage.setItem("role", payload.data.role);
        
        // 3. ✅ Save Full User Object (Ye line missing thi)
        localStorage.setItem("user", JSON.stringify(payload.data)); 
        
        // 4. Clear Guest Session
        localStorage.removeItem("sessionToken"); 

        // 5. Redirect based on role inside payload (Redux state update ka wait mat karo)
        if (payload.data.role === 'admin') {
           navigate('/admin/dashboard', { replace: true });
        } else {
           navigate('/menu', { replace: true });
        }
        // --- FIX ENDS HERE ---
      })
      .catch((err) => {
        console.error("Login Failed:", err);
      });
  };


  // ✅3. Google Handler
  const handleGoogleSignIn = () => {
    dispatch(googleLogin())
      .unwrap()
      .then((payload) => {
        // Manual Save & Redirect Logic
        localStorage.setItem("accessToken", payload.accessToken);
        localStorage.setItem("role", payload.data.role);
        localStorage.setItem("user", JSON.stringify(payload.data)); 
        localStorage.removeItem("sessionToken");

        // Redirect based on table or admin
        if (payload.data.role === 'admin') {
           navigate('/admin/dashboard', { replace: true });
        } else {
           navigate('/menu', { replace: true });
        }
      })
      .catch((err) => console.error("Google Login Failed:", err));
  };
  return (
    <>
      {/* 1. LUXURY FONTS & STYLES */}
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

      {/* 2. MAIN CONTAINER */}
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-4 relative overflow-hidden font-manrope">
        
        {/* Background Ambient Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-900/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>

        {/* 3. LOGIN CARD */}
        <div className="relative w-full max-w-md z-10">
          
          {/* Top Decorative Icon */}
          <div className="flex justify-center -mb-8 relative z-20">
             <div className="bg-[#020202] p-2 rounded-full border border-yellow-800/30 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-700 via-yellow-500 to-yellow-800 flex items-center justify-center shadow-inner">
                   <UtensilsCrossed className="w-7 h-7 text-[#1a0f00]" />
                </div>
             </div>
          </div>

          <div className="bg-black/60 backdrop-blur-xl border border-yellow-600/20 rounded-2xl p-8 pt-12 shadow-2xl relative overflow-hidden">
            
            {/* Top Border Accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-60"></div>

            {/* HEADINGS */}
            <div className="text-center mb-8">
              <h2 className="font-cinzel text-3xl font-bold gold-gradient-text tracking-wide mb-1">
                SavoryBites
              </h2>
              <p className="text-xs text-yellow-600/70 uppercase tracking-[0.3em] mb-6">
                Restaurant Management
              </p>
              
              <div className="space-y-1">
                <h1 className="text-xl text-gray-100 font-semibold">Welcome Back</h1>
                <p className="text-sm text-gray-500 font-light">
                  Sign in to access your privileges
                </p>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-900/10 border border-red-500/20 flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <span className="text-red-500 font-bold text-xs">!</span>
                </div>
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            {/* FORM */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs text-yellow-600/80 uppercase tracking-widest font-semibold ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#0a0a0a] border border-white/10 text-yellow-50 placeholder-gray-600 text-sm rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all shadow-inner"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs text-yellow-600/80 uppercase tracking-widest font-semibold ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-[#0a0a0a] border border-white/10 text-yellow-50 placeholder-gray-600 text-sm rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all shadow-inner"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-4 h-4 border border-gray-600 rounded bg-[#0a0a0a] peer-checked:bg-yellow-600 peer-checked:border-yellow-600 transition-all"></div>
                    <Check className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 left-0.5 transition-opacity" />
                  </div>
                  <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                </label>
                
                <Link to= "/recovery" className="text-yellow-600 hover:text-yellow-500 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-3.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#291d0a] font-bold rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center transition-transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out skew-y-12"></div>
                
                <div className="relative flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="font-cinzel tracking-wide">Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span className="font-cinzel tracking-wide">Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>


            <div className="my-6 flex items-center gap-4">
               <div className="h-[1px] bg-white/10 flex-1"></div>
               <span className="text-xs text-gray-500 uppercase tracking-widest">Or Continue With</span>
               <div className="h-[1px] bg-white/10 flex-1"></div>
            </div>

            <button 
               type="button"
               onClick={handleGoogleSignIn}
               className="w-full flex items-center justify-center gap-3 py-3.5 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] group"
            >
               <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
               </svg>
               <span className="font-manrope">Google</span>
            </button>



            {/* SIGNUP LINK */}
            <div className="mt-8 text-center border-t border-white/5 pt-6">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="text-yellow-500 font-semibold hover:text-yellow-400 transition-colors inline-flex items-center gap-1 group/link"
                >
                  Register Now <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}