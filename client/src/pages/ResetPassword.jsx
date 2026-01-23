import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { KeyRound, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // 1. Get Email from previous page
  const { email } = location.state || {};

  // 2. States
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 3. Security Check
  useEffect(() => {
    if (!email) {
      toast.error("Invalid session. Please start again.");
      navigate('/find-account');
    }
  }, [email, navigate, toast]);

  // 4. Handle Submit
  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
        return toast.error("Passwords do not match!");
    }
    if (otp.length < 6) {
        return toast.error("Please enter a valid 6-digit OTP");
    }

    setLoading(true);
    try {
        // ✅ API Call: OTP + Password sath me bhej rahe hain
        const res = await api.post('/auth/reset-password', {
            email,
            otp,
            newPassword
        });

        if (res.data.success) {
            toast.success("Password Reset Successful! Login now.");
            navigate('/login');
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
        setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Manrope:wght@300;400;500;600&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-manrope { font-family: 'Manrope', sans-serif; }
        .gold-gradient-text { background: linear-gradient(to bottom, #FDE68A, #D4AF37, #92400E); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>

      <div className='min-h-screen bg-[#020202] flex justify-center items-center p-4 relative overflow-hidden font-manrope'>
        
        {/* Background Effects */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className='w-full max-w-[450px] relative z-10'>
           
           {/* Card */}
           <div className='bg-black/60 backdrop-blur-xl border border-yellow-600/20 rounded-2xl p-8 shadow-2xl relative'>
              
              <div className='text-center mb-8'>
                 <h1 className="font-cinzel text-2xl font-bold gold-gradient-text mb-2">Secure Account</h1>
                 <p className="text-gray-400 text-sm">Enter the OTP sent to <span className="text-yellow-500">{email}</span> and set a new password.</p>
              </div>

              <form onSubmit={handleReset} className="space-y-5">
                  
                  {/* OTP Input */}
                  <div className="space-y-1.5">
                      <label className="text-xs text-yellow-600/80 uppercase tracking-widest font-semibold ml-1">Enter OTP</label>
                      <div className="relative group">
                          <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                          <input 
                              type="text" 
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              maxLength={6}
                              placeholder="6-digit OTP"
                              className="w-full bg-[#0a0a0a] border border-white/10 text-yellow-50 text-sm rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:border-yellow-500/50 tracking-widest transition-all"
                              required
                          />
                      </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                      <label className="text-xs text-yellow-600/80 uppercase tracking-widest font-semibold ml-1">New Password</label>
                      <div className="relative group">
                          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                          <input 
                              type={showPassword ? "text" : "password"} 
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter new password"
                              className="w-full bg-[#0a0a0a] border border-white/10 text-yellow-50 text-sm rounded-lg pl-12 pr-12 py-3.5 focus:outline-none focus:border-yellow-500/50 transition-all"
                              required
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-500 hover:text-white">
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                      </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                      <label className="text-xs text-yellow-600/80 uppercase tracking-widest font-semibold ml-1">Confirm Password</label>
                      <div className="relative group">
                          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" />
                          <input 
                              type="password" 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm new password"
                              className="w-full bg-[#0a0a0a] border border-white/10 text-yellow-50 text-sm rounded-lg pl-12 pr-4 py-3.5 focus:outline-none focus:border-yellow-500/50 transition-all"
                              required
                          />
                      </div>
                  </div>

                  <button 
                      type="submit"
                      disabled={loading}
                      className="group w-full py-3.5 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#291d0a] font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 mt-4"
                  >
                      {loading ? <Loader2 className="animate-spin" /> : <span>Reset Password</span>}
                      {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </button>

              </form>

              <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">Didn't receive code? <button onClick={() => navigate(-1)} className="text-yellow-500 hover:underline">Resend</button></p>
              </div>

           </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;