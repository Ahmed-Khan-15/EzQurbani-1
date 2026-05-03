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
                <h1 className="text-3xl font-bold text-gray-900 text-center">Track Your Sacrifice</h1>
                <p className="text-gray-500 mt-2 text-center">Enter your booking ID or select from your active orders.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Booking</label>
                    <select 
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
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
                    className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-100 disabled:opacity-50 transition-all active:scale-[0.98]"
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
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
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
                                                index < currentStatusIdx ? 'bg-green-500' : 'bg-gray-100'
                                            }`} />
                                        )}
                                        
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 ${
                                            isCompleted ? 'bg-green-600 border-green-100 text-white' : 'bg-white border-gray-100 text-gray-300'
                                        } ${isCurrent ? 'ring-4 ring-green-100 animate-pulse' : ''}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-xs font-bold mt-3 text-center ${isCompleted ? 'text-green-700' : 'text-gray-400'}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Truck className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Agent Details</p>
                                        <p className="font-bold text-gray-900">{trackingInfo.agent_name || 'Assigning soon...'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Delivery Address</p>
                                        <p className="font-bold text-gray-900">{trackingInfo.address_line}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Estimated Delivery</p>
                                        <p className="font-bold text-gray-900">
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
