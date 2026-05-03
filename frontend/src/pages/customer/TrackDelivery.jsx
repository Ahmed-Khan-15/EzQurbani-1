import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { trackDelivery } from '../../api/deliveryApi';
import { getMyBookings } from '../../api/bookingApi';
import { Truck, MapPin, Calendar, CheckCircle2, Circle, Clock, Loader2, PackageSearch } from 'lucide-react';

const TrackDelivery = () => {
    const location = useLocation();
    const [bookingId, setBookingId] = useState(location.state?.booking_id || '');
    const [bookings, setBookings] = useState([]);
    const [trackingInfo, setTrackingInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyBookings();
        if (bookingId) {
            handleTrack(bookingId);
        }
    }, []);

    const fetchMyBookings = async () => {
        try {
            const data = await getMyBookings();
            setBookings(data.filter(b => b.booking_status === 'confirmed'));
        } catch (err) {
            console.error('Failed to fetch bookings');
        }
    };

    const handleTrack = async (id) => {
        setLoading(true);
        setError('');
        try {
            const data = await trackDelivery(id);
            setTrackingInfo(data);
        } catch (err) {
            setError('No tracking information found for this booking yet.');
            setTrackingInfo(null);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { key: 'pending', label: 'Order Placed', icon: Clock },
        { key: 'slaughtered', label: 'Slaughtered', icon: CheckCircle2 },
        { key: 'packaged', label: 'Meat Packaged', icon: PackageSearch },
        { key: 'delivered', label: 'Delivered', icon: Truck },
    ];

    const getStatusIndex = (status) => {
        const index = steps.findIndex(s => s.key === status.toLowerCase());
        return index === -1 ? 0 : index;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-4xl font-bold text-ez-emerald font-serif text-center">Track Your Sacrifice</h1>
                <p className="text-gray-500 mt-2 text-center italic text-lg">Enter your booking ID or select from your active orders.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-ez-gold/20 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-bold text-ez-emerald uppercase tracking-wider mb-2">Select Booking</label>
                    <select 
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        className="w-full p-3 bg-ez-cream/50 border border-ez-gold/30 rounded-xl outline-none focus:ring-2 focus:ring-ez-gold font-semibold text-ez-emerald"
                    >
                        <option value="">Select an order...</option>
                        {bookings.map(b => (
                            <option key={b.booking_id} value={b.booking_id}>
                                Order #{b.booking_id} - {b.animal_name} ({b.tag_no})
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => handleTrack(bookingId)}
                    disabled={!bookingId || loading}
                    className="w-full md:w-auto px-8 py-3 bg-ez-gold hover:bg-ez-gold-light text-ez-emerald font-bold rounded-xl shadow-lg border border-ez-gold disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track Now'}
                </button>
            </div>

            {error && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-xl flex items-center gap-4 text-amber-800">
                    <Clock className="w-6 h-6 flex-shrink-0" />
                    <div>
                        <p className="font-bold text-lg">Still in Progress</p>
                        <p className="text-sm opacity-90">{error}</p>
                    </div>
                </div>
            )}

            {trackingInfo && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Status Tracker */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-ez-gold/30">
                        <div className="flex justify-between items-center mb-12">
                            {steps.map((step, index) => {
                                const currentStatusIdx = getStatusIndex(trackingInfo.status);
                                const isCompleted = index <= currentStatusIdx;
                                const isCurrent = index === currentStatusIdx;
                                const Icon = step.icon;

                                return (
                                    <div key={step.key} className="flex flex-col items-center flex-1 relative">
                                        {/* Connector Line */}
                                        {index < steps.length - 1 && (
                                            <div className={`absolute left-1/2 top-5 w-full h-1 z-0 ${
                                                index < currentStatusIdx ? 'bg-ez-gold' : 'bg-ez-cream border-t border-dashed border-ez-gold/30'
                                            }`} />
                                        )}
                                        
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 ${
                                            isCompleted ? 'bg-ez-emerald border-ez-gold/50 text-ez-gold shadow-md' : 'bg-white border-ez-cream text-gray-300'
                                        } ${isCurrent ? 'ring-4 ring-ez-gold/20 animate-pulse bg-white border-ez-gold text-ez-gold' : ''}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-xs font-bold mt-3 text-center ${isCompleted || isCurrent ? 'text-ez-emerald' : 'text-gray-400'}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-ez-gold/20">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-ez-emerald">
                                    <div className="p-2 bg-ez-cream rounded-lg border border-ez-gold/20"><Truck className="w-5 h-5 text-ez-gold" /></div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 font-serif">Agent Details</p>
                                        <p className="font-bold text-ez-emerald text-lg">{trackingInfo.agent_name || 'Assigning soon...'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-ez-emerald">
                                    <div className="p-2 bg-ez-cream rounded-lg border border-ez-gold/20"><MapPin className="w-5 h-5 text-ez-gold" /></div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 font-serif">Delivery Address</p>
                                        <p className="font-bold text-ez-emerald">{trackingInfo.address_line}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-ez-emerald">
                                    <div className="p-2 bg-ez-cream rounded-lg border border-ez-gold/20"><Calendar className="w-5 h-5 text-ez-gold" /></div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 font-serif">Estimated Delivery</p>
                                        <p className="font-bold text-ez-emerald text-lg">
                                            {trackingInfo.delivery_date ? new Date(trackingInfo.delivery_date).toLocaleDateString() : 'Scheduling...'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackDelivery;
