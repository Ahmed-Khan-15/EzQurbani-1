import React, { useState, useEffect } from 'react';
import { getAnimals, getAnimalsSummary } from '../../api/animalApi';
import axiosInstance from '../../api/axiosInstance';
import StatusBadge from '../../components/common/StatusBadge';
import { Plus, Search, Loader2, Tag, Trash2, Edit, ArrowLeft } from 'lucide-react';

const ManageAnimals = () => {
    const [summary, setSummary] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
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
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        setLoading(true);
        try {
            const data = await getAnimalsSummary();
            setSummary(data);
        } catch (err) {
            console.error('Failed to fetch animals summary');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnimalsByCategory = async (categoryName) => {
        setLoading(true);
        setSelectedCategory(categoryName);
        try {
            const data = await getAnimals(categoryName);
            setAnimals(data);
        } catch (err) {
            console.error('Failed to fetch animals');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToSummary = () => {
        setSelectedCategory(null);
        setAnimals([]);
        fetchSummary();
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/animals', formData);
            setShowForm(false);
            if (selectedCategory) {
                fetchAnimalsByCategory(selectedCategory);
            } else {
                fetchSummary();
            }
            setFormData({ category_id: 1, vendor_id: 1, tag_no: '', weight: '', price: '', status: 'available' });
        } catch (err) {
            alert('Failed to add animal');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {selectedCategory && (
                        <button 
                            onClick={handleBackToSummary}
                            className="p-2 border border-ez-gold/30 rounded-full text-ez-gold hover:bg-ez-gold/10 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <h1 className="text-3xl font-bold text-white font-serif tracking-wide">
                        {selectedCategory ? `Manage ${selectedCategory}s` : 'Inventory Summary'} 🐄
                    </h1>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-ez-gold text-ez-emerald px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-ez-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.2)]"
                >
                    <Plus className="w-4 h-4" /> Add Animal
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleAdd} className="bg-white/5 p-6 rounded-2xl shadow-lg border border-ez-gold/30 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top duration-300">
                    <input 
                        type="text" placeholder="Tag Number (e.g. TAG-101)" 
                        required className="p-2 bg-transparent border border-ez-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ez-gold"
                        value={formData.tag_no} onChange={(e) => setFormData({...formData, tag_no: e.target.value})}
                    />
                    <input 
                        type="number" placeholder="Weight (KG)" 
                        required className="p-2 bg-transparent border border-ez-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ez-gold"
                        value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    />
                    <input 
                        type="number" placeholder="Price (PKR)" 
                        required className="p-2 bg-transparent border border-ez-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-ez-gold"
                        value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                    <select 
                        className="p-2 bg-ez-dark border border-ez-gold/30 rounded-lg text-white focus:outline-none focus:border-ez-gold"
                        value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: parseInt(e.target.value)})}
                    >
                        <option value={1}>Bakra</option>
                        <option value={2}>Cow</option>
                        <option value={3}>Dumba</option>
                        <option value={4}>Camel</option>
                    </select>
                    <button type="submit" className="md:col-span-2 bg-ez-emerald text-ez-gold border border-ez-gold/30 hover:border-ez-gold rounded-lg font-bold transition-all">Save Animal</button>
                </form>
            )}

            {loading ? (
                <div className="flexjustify-center py-12"><Loader2 className="animate-spin w-8 h-8 text-ez-gold mx-auto" /></div>
            ) : !selectedCategory ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {summary.map((cat) => (
                        <div 
                            key={cat.category_id} 
                            onClick={() => fetchAnimalsByCategory(cat.category_name)}
                            className="bg-white/5 rounded-2xl shadow-lg border border-ez-gold/20 p-8 cursor-pointer hover:border-ez-gold/60 transition hover:-translate-y-1 flex flex-col items-center justify-center text-center group"
                        >
                            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                                {cat.category_name === 'Bakra' ? '🐐' : 
                                 cat.category_name === 'Cow' ? '🐄' : 
                                 cat.category_name === 'Dumba' ? '🐑' : '🐪'}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">{cat.category_name}</h2>
                            <p className="text-gray-400 mb-2">
                                <span className="font-bold text-ez-gold text-lg">{cat.available_count}</span> Available
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white/5 rounded-2xl shadow-lg border border-ez-gold/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/40 border-b border-ez-gold/20">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-ez-gold uppercase tracking-wider font-serif">Tag</th>
                                    <th className="px-6 py-4 text-xs font-bold text-ez-gold uppercase tracking-wider font-serif">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold text-ez-gold uppercase tracking-wider font-serif">Weight</th>
                                    <th className="px-6 py-4 text-xs font-bold text-ez-gold uppercase tracking-wider font-serif">Price</th>
                                    <th className="px-6 py-4 text-xs font-bold text-ez-gold uppercase tracking-wider font-serif">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-ez-gold uppercase tracking-wider font-serif">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ez-gold/10">
                                {animals.map(animal => (
                                    <tr key={animal.animal_id} className="hover:bg-ez-gold/5 transition-colors text-sm text-gray-300">
                                        <td className="px-6 py-4 font-mono font-bold text-ez-gold">{animal.tag_no}</td>
                                        <td className="px-6 py-4 font-bold capitalize text-white">{animal.category_name}</td>
                                        <td className="px-6 py-4">{animal.weight} KG</td>
                                        <td className="px-6 py-4 font-black text-white">Rs. {parseFloat(animal.price).toLocaleString()}</td>
                                        <td className="px-6 py-4"><StatusBadge status={animal.status} /></td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button className="p-1.5 text-gray-500 hover:text-ez-gold transition-colors"><Edit className="w-4 h-4" /></button>
                                            <button className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                                {animals.length === 0 && (
                                    <tr><td colSpan="6" className="text-center py-8 text-gray-500">No {selectedCategory}s found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAnimals;
