import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, User, ArrowLeft } from 'lucide-react';
import api from '../lib/api';
import { useToast } from '../context/ToastContext';

const SendOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // 1. Get Data from Previous Page
  const { email, userData } = location.state || {};

  // 2. Security Check: Agar direct URL se aaya bina data ke, to wapas bhejo
  useEffect(() => {
    if (!email) {
      toast.error("Please find your account first");
      navigate('/find-account');
    }
  }, [email, navigate, toast]);

  // 3. Handle Send OTP API
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/send-otp', { email });
      
      if (res.data.success) {
        toast.success(`OTP Sent to ${email}`);
        // Navigate to Verify Page (Next Step)
        navigate('/verify-otp', { state: { email } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null; // Render nothing while redirecting

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
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-900/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className='w-full max-w-[450px] relative z-10'>
           
           {/* Card */}
           <div className='bg-black/60 backdrop-blur-xl border border-yellow-600/20 rounded-2xl p-8 shadow-2xl relative'>
              
              <div className='text-center mb-8'>
                 <h1 className="font-cinzel text-2xl font-bold gold-gradient-text mb-2">Account Found</h1>
                 <p className="text-gray-400 text-sm">We found an account associated with this email.</p>
              </div>

              {/* User Info Box */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-yellow-900/20 flex items-center justify-center border border-yellow-600/30">
                      <User className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="overflow-hidden">
                      <p className="text-white font-bold text-lg truncate">{userData?.name || "User"}</p>
                      <p className="text-gray-500 text-sm truncate">{email}</p>
                  </div>
              </div>

              {/* Action Button */}
              <button 
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="group w-full py-3.5 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 mb-4"
              >
                  {loading ? <Loader2 className="animate-spin" /> : <Mail className="w-4 h-4" />}
                  <span>{loading ? "Sending..." : "Send OTP via Email"}</span>
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>

              <button onClick={() => navigate('/login')} className="w-full py-3 text-gray-500 hover:text-white text-sm transition-colors">
                  Cancel & Return to Login
              </button>

           </div>
        </div>
      </div>
    </>
  );
};

export default SendOtp;