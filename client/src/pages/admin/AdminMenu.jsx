import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, X, UploadCloud, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Save button loading state
  const [editId, setEditId] = useState(null); // Agar ye set hai, to Edit Mode hai
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: null 
  });
  const [preview, setPreview] = useState(null);

  // --- FETCH MENU ---
  const fetchMenu = async () => {
    try {
      const res = await api.get('/menu'); 
      if (res.data.success) {
        setMenuItems(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFormData({ ...formData, image: file });
        setPreview(URL.createObjectURL(file)); 
    }
  };

  // ✅ NEW: Handle Edit Button Click
  const handleEdit = (item) => {
      setFormData({
          name: item.name,
          price: item.price,
          category: item.category,
          description: item.description || "",
          image: null // Reset file, purana image preview me dikhega
      });
      setPreview(item.image); // Purana image dikhao
      setEditId(item._id); // ID set karo taaki pata chale edit ho raha hai
      setIsModalOpen(true);
  };

  // ✅ NEW: Handle Close / Reset
  const handleCloseModal = () => {
      setIsModalOpen(false);
      setFormData({ name: "", price: "", category: "", description: "", image: null });
      setPreview(null);
      setEditId(null); // Reset ID
  };

  // ✅ UPDATED: Handle Submit (Create + Update logic)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("description", formData.description);
    if (formData.image) {
        data.append("image", formData.image);
    }

    try {
        let res;
        const config = { headers: { "Content-Type": "multipart/form-data" } };

        if (editId) {
            // 🔥 UPDATE API CALL (PUT)
            res = await api.put(`/menu/${editId}`, data, config);
        } else {
            // 🔥 CREATE API CALL (POST)
            res = await api.post('/menu', data, config);
        }

        if (res.data.success) {
            toast.success(editId ? "Item Updated Successfully! 🍲" : "Menu Item Added! 🍔");
            handleCloseModal();
            fetchMenu(); // List refresh
        }
    } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Operation failed");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Are you sure you want to delete this item?")) return;
      try {
          await api.delete(`/menu/${id}`);
          toast.success("Item Deleted");
          fetchMenu();
      } catch (error) {
          toast.error(error,"Delete Failed");
      }
  };

  const filteredMenu = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Menu Management</h2>
          <p className="text-gray-500 text-sm">Manage dishes, prices & availability</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all"
        >
          <Plus size={18} /> Add New Item
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#111625] p-4 rounded-xl border border-gray-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
                type="text" 
                placeholder="Search items..." 
                className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-300 focus:border-yellow-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? <p className="text-white text-center col-span-full">Loading Menu...</p> : filteredMenu.map((item) => (
          <div key={item._id} className="bg-[#111625] border border-gray-800 rounded-xl overflow-hidden group hover:border-yellow-600/40 transition-all flex flex-col">
            <div className="h-40 w-full bg-gray-900 relative">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700"><ImageIcon size={40} /></div>
              )}
              <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-yellow-500 text-[10px] font-bold px-2 py-1 rounded uppercase">
                {item.category}
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-bold truncate pr-2">{item.name}</h3>
                <span className="text-yellow-500 font-mono font-bold">₹{item.price}</span>
              </div>
              <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-1">{item.description}</p>
              
              <div className="flex gap-2 border-t border-gray-800 pt-3 mt-auto">
                <button 
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0b0f19] text-gray-400 hover:text-yellow-500 py-2 rounded text-xs font-bold transition-colors"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button 
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0b0f19] text-gray-400 hover:text-red-500 py-2 rounded text-xs font-bold transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- ADD/EDIT ITEM MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="bg-[#111625] w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <h3 className="text-xl font-bold text-white font-cinzel">
                        {editId ? "Edit Menu Item" : "Add New Item"}
                    </h3>
                    <button onClick={handleCloseModal} className="text-gray-400 hover:text-white"><X /></button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Image Upload */}
                    <div className="flex justify-center">
                        <label className="relative cursor-pointer group">
                            <div className="w-32 h-32 rounded-xl bg-[#0b0f19] border-2 border-dashed border-gray-600 flex flex-col items-center justify-center overflow-hidden hover:border-yellow-500 transition-colors">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <UploadCloud className="w-8 h-8 text-gray-500 mb-2 group-hover:text-yellow-500" />
                                        <span className="text-[10px] text-gray-500 uppercase font-bold">Upload Image</span>
                                    </>
                                )}
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Item Name</label>
                            <input 
                                name="name" 
                                value={formData.name} 
                                onChange={handleInputChange}
                                className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg p-3 text-white mt-1 focus:border-yellow-500 outline-none" 
                                placeholder="e.g. Butter Chicken"
                                required 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Price (₹)</label>
                            <input 
                                name="price" 
                                type="number"
                                value={formData.price} 
                                onChange={handleInputChange}
                                className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg p-3 text-white mt-1 focus:border-yellow-500 outline-none" 
                                placeholder="350"
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                        <select 
                            name="category" 
                            value={formData.category} 
                            onChange={handleInputChange}
                            className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg p-3 text-white mt-1 focus:border-yellow-500 outline-none"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Starters">Starters</option>
                            <option value="Main Course">Main Course</option>
                            <option value="Desserts">Desserts</option>
                            <option value="Drinks">Drinks</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleInputChange}
                            className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg p-3 text-white mt-1 focus:border-yellow-500 outline-none h-24 resize-none" 
                            placeholder="Short description..."
                        />
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3.5 rounded-lg transition-colors shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : (editId ? "Update Item" : "Save Item")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminMenu;