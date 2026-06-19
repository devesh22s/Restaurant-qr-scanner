import React, { useEffect, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ id, message, type = 'info', duration = 3000, onClose }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    // Animation poori hone ke liye 300ms wait karenge
    setTimeout(() => {
      onClose(id);
    }, 300);
  }, [id, onClose]);

  useEffect(() => {
    // Mount hote hi animation trigger karne ke liye
    requestAnimationFrame(() => {
      setIsMounted(true);
    });

    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  // Premium Theme Configuration
  const config = {
    success: { 
      icon: <CheckCircle className="w-5 h-5 text-green-400" />, 
      border: 'border-green-500/30', 
      glow: 'shadow-[0_0_15px_rgba(74,222,128,0.15)]', 
      bar: 'bg-green-500' 
    },
    error: { 
      icon: <AlertCircle className="w-5 h-5 text-red-400" />, 
      border: 'border-red-500/30', 
      glow: 'shadow-[0_0_15px_rgba(248,113,113,0.15)]', 
      bar: 'bg-red-500' 
    },
    warning: { 
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />, 
      border: 'border-yellow-500/30', 
      glow: 'shadow-[0_0_15px_rgba(250,204,21,0.15)]', 
      bar: 'bg-yellow-500' 
    },
    info: { 
      icon: <Info className="w-5 h-5 text-blue-400" />, 
      border: 'border-blue-500/30', 
      glow: 'shadow-[0_0_15px_rgba(96,165,250,0.15)]', 
      bar: 'bg-blue-500' 
    },
  };

  const { icon, border, glow, bar } = config[type] || config.info;

  return (
    <div
      className={`
        relative overflow-hidden
        bg-[#0a0a0a]/90 backdrop-blur-xl
        border ${border} ${glow}
        rounded-xl p-4 mb-3
        flex items-start gap-3 w-80
        transition-all duration-300 ease-out transform
        ${!isMounted ? 'opacity-0 translate-y-8 scale-95' : ''}
        ${isExiting ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}
      `}
    >
      <div className="shrink-0 mt-0.5 drop-shadow-md">
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-manrope font-semibold text-white tracking-wide">
          {message}
        </p>
      </div>

      <button
        onClick={handleClose}
        className="shrink-0 text-gray-500 hover:text-white transition-colors p-1 bg-white/5 rounded-md hover:bg-white/10"
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Animated Time Progress Bar */}
      {duration > 0 && (
        <div 
          className={`absolute bottom-0 left-0 h-[3px] ${bar}`}
          style={{ 
            animation: `shrinkBar ${duration}ms linear forwards` 
          }}
        />
      )}

      {/* CSS for Progress Bar Animation */}
      <style>{`
        @keyframes shrinkBar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;