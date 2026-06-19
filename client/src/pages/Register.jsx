import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom"; // ✅ Added useSearchParams
import api from "../lib/api"; // ✅ Added API import for verification
import { register, googleLogin } from "../redux/authSlice";
import {
  UserPlus,
  ArrowRight,
  Sparkles,
  Gift,
  Award,
  Percent,
  Phone,
  Mail,
  User,
  Lock,
  CheckCircle2
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // ✅ 1. URL se Table Slug nikalo
  const [searchParams] = useSearchParams();
  const tableSlug = searchParams.get('table');

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ 2. Table Verification Logic (New Addition)
  // Jaise hi page load hoga, ye check karega ki URL me table hai ya nahi
  useEffect(() => {
    if (tableSlug) {
      const verifyAndSaveTable = async () => {
        try {
          // Table verify karo
          const res = await api.get(`/tables/slug/${tableSlug}`);
          
          if (res.data.success) {
            const tableData = res.data.data;
            
            // LocalStorage me save kar lo
            localStorage.setItem('tableNumber', tableData.tableNumber);
            localStorage.setItem('tableId', tableData._id);
            localStorage.setItem('activeTable', tableData.tableNumber); 
            
            console.log("Table successfully linked:", tableData.tableNumber);
          }
        } catch (err) {
          console.error("Table verification failed on Register page:", err);
          // Agar fail ho jaye to user ko manually select karna padega baad me
        }
      };
      verifyAndSaveTable();
    }
  }, [tableSlug]);

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "contact") {
    // Sirf numbers allow karega aur copy-paste karne par bhi 10 se zyada cut kar dega
    setFormData({ 
      ...formData, 
      [name]: value.replace(/[^0-9]/g, "").slice(0, 10) 
    });
  } else {
    // Name, Email, Password ke liye aapka purana logic waise ka waisa chalega
    setFormData({ 
      ...formData, 
      [name]: value 
    });
  }
};

  const handleConfirmPasswordChange = (e) =>
    setConfirmPassword(e.target.value);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const result = await dispatch(register(formData));

    if (result.meta.requestStatus === "fulfilled") {
      // ✅ Redirect Logic
      // Agar table URL me thi, to seedha 'Home' ya 'Checkout' par bhejo
      // Agar nahi thi, to 'Login' par bhejo
      if (tableSlug) {
          // Auto login usually requires backend to return token on register
          // For now, let's send to login but user expects flow continuity.
          // Better UX: Send to login with redirect param, OR (if your backend logs in on register) go home.
          navigate('/login'); 
      } else {
          navigate('/login');
      }
    } else {
      alert("Registration failed");
    }
  };


  const handleGoogleSignIn = () => {
    dispatch(googleLogin())
      .unwrap()
      .then((payload) => {
        localStorage.setItem("accessToken", payload.accessToken);
        localStorage.setItem("role", payload.data.role);
        localStorage.setItem("user", JSON.stringify(payload.data)); 
        localStorage.removeItem("sessionToken");
        
        if (payload.data.role === 'admin') {
           navigate('/admin/dashboard', { replace: true });
        } else {
           navigate('/menu', { replace: true });
        }
      })
      .catch((err) => console.error("Google Signup Failed:", err));
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
          
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #050505; }
          ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
        `}
      </style>

      {/* 2. MAIN CONTAINER */}
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-4 lg:p-8 font-manrope relative overflow-x-hidden">
        
        {/* Background Ambient Effects */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start z-10">
          
          {/* --- LEFT COLUMN: REGISTRATION FORM --- */}
          <div className="w-full">
            <div className="bg-black/60 backdrop-blur-md border border-yellow-600/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
              
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-50"></div>

              {/* Header */}
              <div className="mb-8 text-center lg:text-left">
                <h1 className="font-cinzel text-3xl lg:text-4xl font-bold gold-gradient-text mb-2">
                  Privilege Access
                </h1>
                <p className="text-gray-400 font-light text-sm tracking-wide">
                  Create your account to unlock exclusive dining rewards.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs text-yellow-600/80 uppercase tracking-widest font-semibold ml-1">Full Name</label>
                  <div className="relative group/input">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within/input:text-yellow-500 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#0a0a0a] border border-white/10 text-yellow-50 placeholder-gray-600 text-sm rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-xs text-yellow-600/80 uppercase tracking-widest font-semibold ml-1">Email Address</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within/input:text-yellow-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#0a0a0a] border border-white/10 text-yellow-50 placeholder-gray-600 text-sm rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Contact Input */}
                <div className="space-y-1.5">
                  <label className="text-xs text-yellow-600/80 uppercase tracking-widest font-semibold ml-1">Contact Number</label>
                  <div className="relative group/input">
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within/input:text-yellow-500 transition-colors" />
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit mobile number"
                      className="w-full bg-[#0a0a0a] border border-white/10 text-yellow-50 placeholder-gray-600 text-sm rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                      placeholder="9876543210"
                      required
                    />
                  </div>
                </div>

                {/* Password Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-yellow-600/80 uppercase tracking-widest font-semibold ml-1">Password</label>
                    <div className="relative group/input">
                      <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within/input:text-yellow-500 transition-colors" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-[#0a0a0a] border border-white/10 text-yellow-50 placeholder-gray-600 text-sm rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-yellow-600/80 uppercase tracking-widest font-semibold ml-1">Confirm</label>
                    <div className="relative group/input">
                      <CheckCircle2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within/input:text-yellow-500 transition-colors" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="w-full bg-[#0a0a0a] border border-white/10 text-yellow-50 placeholder-gray-600 text-sm rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="w-4 h-4 rounded border-gray-700 bg-[#0a0a0a] text-yellow-600 focus:ring-yellow-600/50 cursor-pointer accent-yellow-600"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-400 cursor-pointer">
                    I agree to the <a href="#" className="text-yellow-500 hover:text-yellow-400 hover:underline">Terms</a> and <a href="#" className="text-yellow-500 hover:text-yellow-400 hover:underline">Privacy Policy</a>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="group relative w-full py-4 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#291d0a] font-bold rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center transition-transform active:scale-[0.98] mt-4"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out skew-y-12"></div>
                  <div className="relative flex items-center gap-2">
                    <UserPlus className="w-5 h-5 stroke-[2.5]" />
                    <span className="font-cinzel tracking-wide">Complete Registration</span>
                  </div>
                </button>

                {/* Footer Link */}
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-500">
                    Already a member?{" "}
                    <Link to="/login" className="text-yellow-500 font-semibold hover:text-yellow-400 transition-colors inline-flex items-center gap-1 group/link">
                      Sign In <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </p>
                </div>
              </form>
              <div className="my-6 flex items-center gap-4">
        <div className="h-[1px] bg-white/10 flex-1"></div>
        <span className="text-xs text-gray-500 uppercase tracking-widest">Or Join With</span>
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


            </div>
          </div>

          {/* --- RIGHT COLUMN: BENEFITS DISPLAY --- */}
          <div className="w-full space-y-6 lg:pt-4">
            
            {/* 1. New Member Benefits */}
            <div className="bg-black/40 backdrop-blur-sm border border-yellow-600/20 rounded-xl p-6 hover:border-yellow-600/40 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                <h3 className="text-lg font-cinzel font-bold text-yellow-50">New Member Benefits</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-900/20 rounded-full">
                    <Gift className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <span className="text-yellow-100 font-semibold text-sm block">20% Welcome Discount</span>
                    <p className="text-gray-500 text-xs">Instantly applied on your first order</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Loyalty Points Program */}
            <div>
              <div className="flex items-center gap-3 mb-4 px-1">
                <Award className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-cinzel font-bold text-white">Loyalty Points Program</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#0a0a0a] border border-white/5 rounded-lg p-4 hover:border-yellow-600/30 transition-all">
                  <div className="flex flex-col gap-1 mb-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wider">Earn</span>
                    <span className="text-yellow-400 font-bold text-base">1 Pt = ₹1 spend</span>
                  </div>
                  <p className="text-gray-600 text-[10px] leading-tight">Accrue points on every rupee spent</p>
                </div>
                <div className="bg-[#0a0a0a] border border-white/5 rounded-lg p-4 hover:border-yellow-600/30 transition-all">
                  <div className="flex flex-col gap-1 mb-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wider">Redeem</span>
                    <span className="text-yellow-400 font-bold text-base">100 Pt = ₹10</span>
                  </div>
                  <p className="text-gray-600 text-[10px] leading-tight">Use points for bill discounts</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-900/20 to-black border border-yellow-600/30 rounded-lg p-4">
                  <div className="flex flex-col gap-1 mb-1">
                    <span className="text-yellow-200 text-xs uppercase tracking-wider">Bonus</span>
                    <span className="text-white font-bold text-base">+50 Pts</span>
                  </div>
                  <p className="text-yellow-600/80 text-[10px] leading-tight">Instant bonus on registration</p>
                </div>
              </div>
            </div>

            {/* 3. Membership Tiers */}
            <div>
              <div className="flex items-center gap-3 mb-4 px-1">
                <Percent className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-cinzel font-bold text-white">Membership Tiers</h3>
              </div>
              <div className="space-y-3">
                {/* Bronze */}
                <div className="bg-[#0a0a0a] border-l-2 border-l-[#CD7F32] border-y border-r border-white/5 rounded-r-lg p-4 flex justify-between items-center group hover:bg-white/5 transition-colors">
                  <div>
                    <span className="text-[#CD7F32] font-cinzel font-bold text-sm block mb-1">Bronze Member</span>
                    <p className="text-gray-500 text-[10px]">5% discount on all orders</p>
                  </div>
                  <span className="text-gray-600 text-xs bg-black px-2 py-1 rounded border border-white/5">0-500 Pts</span>
                </div>
                
                {/* Silver */}
                <div className="bg-[#0a0a0a] border-l-2 border-l-[#C0C0C0] border-y border-r border-white/5 rounded-r-lg p-4 flex justify-between items-center group hover:bg-white/5 transition-colors">
                  <div>
                    <span className="text-[#C0C0C0] font-cinzel font-bold text-sm block mb-1">Silver Member</span>
                    <p className="text-gray-500 text-[10px]">10% discount + Priority support</p>
                  </div>
                  <span className="text-gray-600 text-xs bg-black px-2 py-1 rounded border border-white/5">501-2000 Pts</span>
                </div>

                {/* Gold */}
                <div className="bg-gradient-to-r from-yellow-900/10 to-transparent border-l-2 border-l-[#FFD700] border-y border-r border-yellow-600/10 rounded-r-lg p-4 flex justify-between items-center group relative overflow-hidden">
                  <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <span className="text-[#FFD700] font-cinzel font-bold text-sm block mb-1 drop-shadow-sm">Gold Member</span>
                    <p className="text-yellow-600/70 text-[10px]">15% discount + Exclusive offers</p>
                  </div>
                  <span className="relative z-10 text-yellow-500/80 text-xs bg-black/50 px-2 py-1 rounded border border-yellow-600/30">2000+ Pts</span>
                </div>
              </div>
            </div>

            {/* 4. Additional Benefits */}
            <div className="bg-[#0a0a0a]/80 border border-white/5 rounded-xl p-6">
              <h4 className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Exclusive Perks</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-400">
                {[
                  "Birthday special offers",
                  "Early access to new menu",
                  "Free delivery > ₹500",
                  "Member-only events"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-700 group-hover:bg-yellow-400 transition-colors"></div>
                    <span className="group-hover:text-gray-300 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}