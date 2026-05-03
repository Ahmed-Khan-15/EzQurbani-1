import React, { useState, useEffect } from 'react';
import { getAnimals } from '../../api/animalApi';
import axiosInstance from '../../api/axiosInstance';
import StatusBadge from '../../components/common/StatusBadge';
import { Plus, Search, Loader2, Tag, Trash2, Edit } from 'lucide-react';

const ManageAnimals = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        category_id: 1,
        vendor_id: 1,
        tag_no: '',
        weight: '',
        price: '',
        status: 'available'
    });

    useEffect(() => {
        fetchAnimals();
    }, []);

    const fetchAnimals = async () => {
        try {
            const data = await getAnimals();
            setAnimals(data);
        } catch (err) {
            console.error('Failed to fetch animals');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/animals', formData);
            setShowForm(false);
            fetchAnimals();
            setFormData({ category_id: 1, vendor_id: 1, tag_no: '', weight: '', price: '', status: 'available' });
        } catch (err) {
            alert('Failed to add animal');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Animal
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top duration-300">
                    <input 
                        type="text" placeholder="Tag Number (e.g. TAG-101)" 
                        required className="p-2 border rounded-lg"
                        value={formData.tag_no} onChange={(e) => setFormData({...formData, tag_no: e.target.value})}
                    />
                    <input 
                        type="number" placeholder="Weight (KG)" 
                        required className="p-2 border rounded-lg"
                        value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    />
                    <input 
                        type="number" placeholder="Price (PKR)" 
                        required className="p-2 border rounded-lg"
                        value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                    <select 
                        className="p-2 border rounded-lg"
                        value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: parseInt(e.target.value)})}
                    >
                        <option value={1}>Bakra</option>
                        <option value={2}>Cow</option>
                        <option value={3}>Dumba</option>
                        <option value={4}>Camel</option>
                    </select>
                    <button type="submit" className="md:col-span-2 bg-slate-900 text-white rounded-lg font-bold">Save Animal</button>
                </form>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tag</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Weight</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8"><Loader2 className="animate-spin mx-auto text-indigo-600" /></td></tr>
                            ) : animals.map(animal => (
                                <tr key={animal.animal_id} className="hover:bg-slate-50/50 transition-colors text-sm">
                                    <td className="px-6 py-4 font-mono font-bold text-indigo-600">{animal.tag_no}</td>
                                    <td className="px-6 py-4 font-semibold capitalize">{animal.category_name}</td>
                                    <td className="px-6 py-4">{animal.weight} KG</td>
                                    <td className="px-6 py-4 font-bold text-slate-900">Rs. {parseFloat(animal.price).toLocaleString()}</td>
                                    <td className="px-6 py-4"><StatusBadge status={animal.status} /></td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"><Edit className="w-4 h-4" /></button>
                                        <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageAnimals;
