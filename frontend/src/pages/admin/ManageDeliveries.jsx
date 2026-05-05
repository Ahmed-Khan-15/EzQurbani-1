import React, { useState, useEffect } from 'react';
import { getAllDeliveries, updateDeliveryStatus, createDelivery, getAllAgents, getPendingDeliveries } from '../../api/deliveryApi';
import axiosInstance from '../../api/axiosInstance';
import StatusBadge from '../../components/common/StatusBadge';
import { Truck, MapPin, Loader2, PackagePlus, ArrowRight, ClipboardList } from 'lucide-react';

const ManageDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [pendingBookings, setPendingBookings] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPackForm, setShowPackForm] = useState(false);
    
    // Track selections for assigning
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [packageWeight, setPackageWeight] = useState('');
    const [selectedAgent, setSelectedAgent] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [delivs, agnts, pending] = await Promise.all([
                getAllDeliveries(), 
                getAllAgents(),
                getPendingDeliveries()
            ]);
            setDeliveries(delivs);
            setAgents(agnts);
            setPendingBookings(pending);
        } catch (err) {
            console.error('Fetch error', err);
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

    const handleAssignDelivery = async (e) => {
        e.preventDefault();
        if (!selectedBooking || !packageWeight || !selectedAgent) {
            return alert('Please fill all required fields');
        }

        try {
            // 1. Create the Meat Package
            const pkgRes = await axiosInstance.post('/delivery/package', {
                booking_id: selectedBooking.booking_id,
                weight: packageWeight,
                status: 'prepared'
            });
            const newPkg = pkgRes.data;

            // 2. Create the Delivery Order
            await createDelivery({
                package_id: newPkg.package_id,
                agent_id: selectedAgent,
                address_id: selectedBooking.address_id || null, // Might be null for now
                delivery_date: new Date().toISOString().split('T')[0], // today
                status: 'pending'
            });

            // Reset form and reload
            alert(`Delivery Assigned for Booking #${selectedBooking.booking_id}!`);
            setSelectedBooking(null);
            setPackageWeight('');
            setSelectedAgent('');
            setShowPackForm(false);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to assign delivery. Make sure all fields are valid.');
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex justify-between items-center bg-black/20 p-6 rounded-2xl border border-ez-gold/20">
                <div>
                    <h1 className="text-3xl font-bold text-white font-serif tracking-wide">Delivery Operations 🚚</h1>
                    <p className="text-gray-400 mt-2 font-mono text-sm tracking-wide">Assign and track delivery agents</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/5 border border-ez-gold/30 rounded-xl p-3 flex flex-col justify-center items-center">
                        <span className="text-xs text-gray-500 font-bold uppercase">Pending Bookings</span>
                        <span className="text-xl text-ez-gold font-black">{pendingBookings?.length || 0}</span>
                    </div>
                </div>
            </div>

            {/* Pending Bookings Section */}
            {!loading && pendingBookings.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-ez-gold font-serif flex items-center gap-2">
                        <ClipboardList className="w-5 h-5" /> Pending Bookings Awaiting Delivery
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pendingBookings.map(b => (
                            <div key={b.booking_id} className="bg-white/5 p-4 rounded-xl border border-ez-gold/20 hover:border-ez-gold/50 transition-colors shadow-lg flex flex-col gap-3">
                                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                                    <span className="font-bold text-white">Order #{b.booking_id}</span>
                                    <StatusBadge status="confirmed" />
                                </div>
                                <div className="text-sm">
                                    <p className="text-gray-400"><strong className="text-gray-200">Customer:</strong> {b.customer_name}</p>
                                    <p className="text-gray-400"><strong className="text-gray-200">Animal:</strong> {b.animal_category} ({b.tag_no})</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setSelectedBooking(b);
                                        setShowPackForm(true);
                                    }}
                                    className="mt-2 text-sm bg-ez-gold/10 hover:bg-ez-gold/20 text-ez-gold font-bold py-2 rounded-lg border border-ez-gold/30 transition shadow-sm"
                                >
                                    Assign Delivery Agent
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Assignment Form Modal (Floating) */}
            {showPackForm && selectedBooking && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-ez-dark border border-ez-gold/40 rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl text-white font-bold font-serif mb-4 flex items-center gap-2 border-b border-gray-700 pb-2">
                            <PackagePlus className="w-5 h-5 text-ez-gold" /> Process Delivery #{selectedBooking.booking_id}
                        </h3>
                        <form onSubmit={handleAssignDelivery} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Meat Weight (KG)</label>
                                <input 
                                    type="number" step="1" required 
                                    placeholder="Enter total packaged weight..."
                                    className="w-full p-3 bg-black/40 border border-ez-gold/30 rounded-xl text-white focus:outline-none focus:border-ez-gold"
                                    value={packageWeight} onChange={(e) => setPackageWeight(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Assign Agent</label>
                                <select 
                                    className="w-full p-3 bg-black/40 border border-ez-gold/30 rounded-xl text-white focus:outline-none focus:border-ez-gold"
                                    required
                                    value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}
                                >
                                    <option value="" disabled>-- Select a Rider --</option>
                                    {agents.map(a => (
                                        <option key={a.agent_id} value={a.agent_id}>{a.name} ({a.contact})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700">
                                <button 
                                    type="button" 
                                    onClick={() => { setShowPackForm(false); setSelectedBooking(null); }}
                                    className="flex-1 py-3 text-gray-400 hover:text-white font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-ez-gold hover:bg-ez-gold-light text-ez-emerald font-bold rounded-xl shadow-lg transition-all">
                                    Dispatch Agent
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Master Delivery Table */}
            <div className="bg-white/5 rounded-3xl shadow-lg border border-ez-gold/20 overflow-hidden">
                <div className="p-5 border-b border-ez-gold/20 bg-black/20">
                    <h2 className="text-lg font-bold text-white font-serif tracking-wide">Active Dispatch Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/40 border-b border-ez-gold/20 text-xs font-bold text-ez-gold uppercase tracking-wider font-serif">
                            <tr>
                                <th className="px-6 py-4 text-center">ID</th>
                                <th className="px-6 py-4">Agent</th>
                                <th className="px-6 py-4">Destination</th>
                                <th className="px-6 py-4">Package</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ez-gold/10 text-sm font-medium">
                            {loading && deliveries.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-12"><Loader2 className="animate-spin mx-auto text-ez-gold" /></td></tr>
                            ) : deliveries.map(item => (
                                <tr key={item.delivery_id} className="hover:bg-ez-gold/5 transition-colors text-gray-300">
                                    <td className="px-6 py-4 text-center font-mono font-bold text-gray-500">#{item.delivery_id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-ez-gold/10 border border-ez-gold/20 rounded-full flex items-center justify-center">
                                                <Truck className="w-4 h-4 text-ez-gold" />
                                            </div>
                                            <span className="font-bold text-white">{item.agent_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-400 max-w-xs truncate">
                                            <MapPin className="w-3.5 h-3.5 text-ez-gold" /> {item.address_line || "Pickup from Farm/Slaughterhouse"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-white">{item.package_weight} KG</td>
                                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <select 
                                                className="bg-ez-dark border border-ez-gold/30 rounded px-2 py-1.5 text-xs outline-none text-ez-gold font-bold focus:border-ez-gold"
                                                value={item.status}
                                                onChange={(e) => handleUpdateStatus(item.delivery_id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="out_for_delivery">Out for Delivery</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && deliveries.length === 0 && (
                                <tr><td colSpan="6" className="text-center py-12 text-gray-500 font-serif italic">No delivery orders currently placed.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageDeliveries;
