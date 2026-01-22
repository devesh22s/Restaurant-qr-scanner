import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Gift, Users, Calendar, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  
  // --- FORM DATA AS PER SCHEMA ---
  const [formData, setFormData] = useState({
    code: '', 
    discountType: 'percentage', 
    discountValue: '', 
    maxDiscount: '', // For Percentage only
    minOrderAmount: '', 
    usageLimit: '', 
    validFrom: '', 
    validTo: '', 
    isFirstOrder: false, // New Field
    description: ''
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get('/coupons/all'); 
      if(res.data.success) setCoupons(res.data.coupons);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons/create', formData);
      toast.success("Coupon Created Successfully!");
      fetchCoupons(); 
      // Reset Form
      setFormData({ 
        code: '', discountType: 'percentage', discountValue: '', 
        maxDiscount: '', minOrderAmount: '', usageLimit: '', 
        validFrom: '', validTo: '', isFirstOrder: false, description: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create");
    }
  };

 const handleDelete = async (id) => {
    if(!window.confirm("Delete this coupon?")) return;
    try {
        await api.delete(`/coupons/${id}`);
        toast.success("Deleted!");
        fetchCoupons();
    } catch (error) { 
       
        toast.error(error.response?.data?.message || "Delete failed"); 
    }
};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* LEFT: Coupon List */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold text-white">Active Coupons</h2>
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="bg-[#111625] border border-gray-800 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 group hover:border-yellow-600/30 transition-all relative">
               
               {/* Validity Badge */}
               {new Date() > new Date(coupon.validTo) && (
                   <span className="absolute top-2 right-2 text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded uppercase font-bold">Expired</span>
               )}

               <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 bg-yellow-900/20 rounded-full flex items-center justify-center text-yellow-500 shrink-0">
                     <Gift />
                  </div>
                  <div>
                     <h4 className="text-xl font-bold text-white tracking-wider">{coupon.code}</h4>
                     <p className="text-sm text-gray-400">
                       {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT OFF`}
                       {coupon.maxDiscount && <span className="text-xs text-gray-500"> (Max ₹{coupon.maxDiscount})</span>}
                     </p>
                     <p className="text-[10px] text-gray-600 mt-1">{coupon.description}</p>
                  </div>
               </div>
               
               <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                     <Users size={14}/> <span>{coupon.usedCount} / {coupon.usageLimit || '∞'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                     <Calendar size={14}/> <span>{new Date(coupon.validTo).toLocaleDateString()}</span>
                  </div>
                  <button onClick={() => handleDelete(coupon._id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors mt-1">
                    <Trash2 size={16} />
                  </button>
               </div>
            </div>
          ))}
          {coupons.length === 0 && !loading && <p className="text-gray-500">No active coupons.</p>}
        </div>
      </div>

      {/* RIGHT: Create Form */}
      <div>
        <div className="bg-[#111625] border border-gray-800 rounded-xl p-6 sticky top-24">
          <h3 className="text-lg font-bold text-white mb-4">Create New Coupon</h3>
          <form onSubmit={handleCreate} className="space-y-4">
             
             {/* Code & Type */}
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold">Code</label>
                    <input 
                      className="w-full bg-[#0b0f19] border border-gray-700 rounded p-2.5 text-white uppercase focus:border-yellow-500 outline-none text-sm" 
                      placeholder="WELCOME20"
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      required
                    />
                </div>
                <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold">Type</label>
                    <select 
                      className="w-full bg-[#0b0f19] border border-gray-700 rounded p-2.5 text-white text-sm focus:border-yellow-500 outline-none"
                      value={formData.discountType}
                      onChange={e => setFormData({...formData, discountType: e.target.value})}
                    >
                       <option value="percentage">Percent (%)</option>
                       <option value="fixedAmount">Flat (₹)</option>
                    </select>
                </div>
             </div>

             {/* Values */}
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold">Value</label>
                    <input 
                      type="number"
                      className="w-full bg-[#0b0f19] border border-gray-700 rounded p-2.5 text-white text-sm focus:border-yellow-500 outline-none"
                      placeholder="20"
                      value={formData.discountValue}
                      onChange={e => setFormData({...formData, discountValue: e.target.value})}
                      required
                    />
                </div>
                {/* Max Discount (Only for Percentage) */}
                {formData.discountType === 'percentage' && (
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Max Disc (₹)</label>
                        <input 
                        type="number"
                        className="w-full bg-[#0b0f19] border border-gray-700 rounded p-2.5 text-white text-sm focus:border-yellow-500 outline-none"
                        placeholder="100"
                        value={formData.maxDiscount}
                        onChange={e => setFormData({...formData, maxDiscount: e.target.value})}
                        />
                    </div>
                )}
             </div>

             {/* Dates */}
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold">Valid From</label>
                    <input 
                      type="date"
                      className="w-full bg-[#0b0f19] border border-gray-700 rounded p-2.5 text-white text-sm focus:border-yellow-500 outline-none"
                      value={formData.validFrom}
                      onChange={e => setFormData({...formData, validFrom: e.target.value})}
                      required
                    />
                </div>
                <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold">Valid To</label>
                    <input 
                      type="date"
                      className="w-full bg-[#0b0f19] border border-gray-700 rounded p-2.5 text-white text-sm focus:border-yellow-500 outline-none"
                      value={formData.validTo}
                      onChange={e => setFormData({...formData, validTo: e.target.value})}
                      required
                    />
                </div>
             </div>

             {/* Limits */}
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold">Min Order (₹)</label>
                    <input 
                      type="number"
                      className="w-full bg-[#0b0f19] border border-gray-700 rounded p-2.5 text-white text-sm focus:border-yellow-500 outline-none"
                      placeholder="500"
                      value={formData.minOrderAmount}
                      onChange={e => setFormData({...formData, minOrderAmount: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold">Total Uses</label>
                    <input 
                      type="number"
                      className="w-full bg-[#0b0f19] border border-gray-700 rounded p-2.5 text-white text-sm focus:border-yellow-500 outline-none"
                      placeholder="e.g. 50"
                      value={formData.usageLimit}
                      onChange={e => setFormData({...formData, usageLimit: e.target.value})}
                    />
                </div>
             </div>

             {/* Checkbox: First Order Only */}
             <div className="flex items-center gap-3 bg-[#0b0f19] p-3 rounded border border-gray-700">
                <input 
                    type="checkbox" 
                    id="firstOrder"
                    checked={formData.isFirstOrder}
                    onChange={e => setFormData({...formData, isFirstOrder: e.target.checked})}
                    className="w-4 h-4 accent-yellow-500 cursor-pointer"
                />
                <label htmlFor="firstOrder" className="text-xs text-gray-300 cursor-pointer select-none">
                    Valid for First Order Only?
                </label>
             </div>

             <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold">Description</label>
                <textarea 
                  className="w-full bg-[#0b0f19] border border-gray-700 rounded p-2.5 text-white text-sm h-16 resize-none focus:border-yellow-500 outline-none"
                  placeholder="Terms & conditions..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
             </div>

             <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">
               Create Coupon
             </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default AdminCoupons;