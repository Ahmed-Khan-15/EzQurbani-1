import React, { useState, useEffect } from 'react';
import { getAllDeliveries, updateDeliveryStatus, createDelivery, getAllAgents } from '../../api/deliveryApi';
import axiosInstance from '../../api/axiosInstance';
import StatusBadge from '../../components/common/StatusBadge';
import { Truck, MapPin, Loader2, PackagePlus, ArrowRight } from 'lucide-react';

const ManageDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPackForm, setShowPackForm] = useState(false);
    const [packData, setPackData] = useState({ booking_id: '', weight: '', status: 'prepared' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [delivs, agnts] = await Promise.all([getAllDeliveries(), getAllAgents()]);
            setDeliveries(delivs);
            setAgents(agnts);
        } catch (err) {
            console.error('Fetch error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateDeliveryStatus(id, status);
            fetchData();
        } catch (err) {
            alert('Update failed');
        }
    };

    const handleCreatePackage = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/delivery/package', packData);
            setShowPackForm(false);
            fetchData();
            alert('Package Created! Now create delivery order.');
        } catch (err) {
            alert('Package creation failed');
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900 font-sans">Delivery Operations</h1>
                <button 
                    onClick={() => setShowPackForm(!showPackForm)}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-black transition-all"
                >
                    <PackagePlus className="w-4 h-4" /> Create Meat Package
                </button>
            </div>

            {showPackForm && (
                <form onSubmit={handleCreatePackage} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-300">
                    <input 
                        type="number" placeholder="Booking ID" required className="p-2.5 border rounded-xl"
                        value={packData.booking_id} onChange={(e) => setPackData({...packData, booking_id: e.target.value})}
                    />
                    <input 
                        type="number" step="0.1" placeholder="Weight (KG)" required className="p-2.5 border rounded-xl"
                        value={packData.weight} onChange={(e) => setPackData({...packData, weight: e.target.value})}
                    />
                    <button type="submit" className="bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100">Prepare Package</button>
                </form>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4 text-center">ID</th>
                                <th className="px-6 py-4">Agent</th>
                                <th className="px-6 py-4">Destination</th>
                                <th className="px-6 py-4">Package</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm font-medium">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-12"><Loader2 className="animate-spin mx-auto text-indigo-600" /></td></tr>
                            ) : deliveries.map(item => (
                                <tr key={item.delivery_id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-center text-slate-400">#{item.delivery_id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center">
                                                <Truck className="w-4 h-4 text-indigo-500" />
                                            </div>
                                            <span>{item.agent_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-500 max-w-xs truncate">
                                            <MapPin className="w-3.5 h-3.5" /> {item.address_line}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-indigo-600">{item.package_weight} KG</td>
                                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <select 
                                                className="bg-white border rounded px-2 py-1 text-xs outline-none"
                                                value={item.status}
                                                onChange={(e) => handleUpdateStatus(item.delivery_id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="out for delivery">Out for Delivery</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                            <button className="p-1 hover:bg-slate-100 rounded transition-colors"><ArrowRight className="w-4 h-4 text-slate-400" /></button>
                                        </div>
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

export default ManageDeliveries;
