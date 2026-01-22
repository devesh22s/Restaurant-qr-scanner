import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Plus, X, Trash2, Download, Users } from 'lucide-react'; 
import { useToast } from '../../context/ToastContext';

const AdminTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({ tableNumber: "", capacity: "" });

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tables'); 
      if (res.data.success) {
        setTables(res.data.data);
      }
    } catch (err) { 
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // --- HANDLE CREATE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tables', formData);
      if (res.data.success) {
        toast.success(`Table ${formData.tableNumber} Created!`);
        setIsModalOpen(false);
        setFormData({ tableNumber: "", capacity: "" });
        fetchTables();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create table");
    }
  };

  // --- HANDLE DELETE ---
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this table?")) return;
    try {
        // Backend route for delete needed: router.delete('/:id', ...)
        await api.delete(`/tables/${id}`); 
        toast.success("Table Deleted");
        fetchTables();
    } catch (error) {
        toast.error(error, "Failed to delete table");
    }
  };

  // --- DOWNLOAD QR ---
  const downloadQR = (url, tableNum) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `Table-${tableNum}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-white">Table Management</h2>
            <p className="text-gray-500 text-sm">Manage tables & download QR codes</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add Table
        </button>
      </div>

      {loading && <p className="text-yellow-500">Loading tables...</p>}

      {!loading && tables.length === 0 && (
          <div className="text-center py-20 text-gray-500 bg-[#111625] rounded-xl border border-gray-800 border-dashed">
              <p>No tables found. Add one to generate QR Code.</p>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div key={table._id} className="bg-[#111625] border border-gray-800 rounded-xl p-6 relative group hover:border-yellow-600/50 transition-all text-center">
            
            {/* Status Badge */}
            {/* Logic: If table.isOccupied is true (Backend feature) OR just isActive check */}
            <div className={`absolute top-4 left-4 px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1 ${table.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
              <span className={`w-2 h-2 rounded-full ${table.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {table.isActive ? 'Available' : 'Reserved'} 
            </div>

            {/* Delete Button */}
            <button 
                onClick={() => handleDelete(table._id)}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors"
                title="Delete Table"
            >
                <Trash2 size={16} />
            </button>

            <h3 className="text-xl font-bold text-white mb-4 mt-6">Table #{table.tableNumber}</h3>

            {/* QR Code */}
            <div className="bg-white p-3 rounded-lg w-fit mx-auto mb-6 shadow-inner relative group/qr">
              {table.qrImage ? (
                  <>
                    <img src={table.qrImage} alt={`QR Table ${table.tableNumber}`} className="w-32 h-32 object-contain" />
                    {/* Hover Overlay for Download */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/qr:opacity-100 transition-opacity rounded-lg">
                        <button 
                            onClick={() => downloadQR(table.qrImage, table.tableNumber)}
                            className="bg-white text-black p-2 rounded-full hover:scale-110 transition-transform"
                            title="Download QR"
                        >
                            <Download size={20} />
                        </button>
                    </div>
                  </>
              ) : (
                  <div className="w-32 h-32 flex items-center justify-center text-black font-bold text-xs">No QR</div>
              )}
            </div>

            {/* Footer Details */}
            <div className="flex justify-between items-center bg-[#0b0f19] p-3 rounded-lg border border-gray-800">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Users size={14} />
                <span>{table.capacity} Seats</span>
              </div>
              <button 
                onClick={() => downloadQR(table.qrImage, table.tableNumber)}
                className="text-blue-400 hover:text-blue-300 text-xs font-bold flex items-center gap-1"
              >
                <Download size={12} /> Download QR
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- ADD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="bg-[#111625] w-full max-w-md rounded-2xl border border-gray-700 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <h3 className="text-lg font-bold text-white font-cinzel">Add New Table</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Table Number</label>
                        <input type="number" value={formData.tableNumber} onChange={(e) => setFormData({...formData, tableNumber: e.target.value})} className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg p-3 text-white mt-1 focus:border-green-500 outline-none" placeholder="e.g. 5" required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Seating Capacity</label>
                        <input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg p-3 text-white mt-1 focus:border-green-500 outline-none" placeholder="e.g. 4" required />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 rounded-lg transition-colors shadow-lg">Generate QR & Save</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminTables;