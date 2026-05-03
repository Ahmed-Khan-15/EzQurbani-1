import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import StatusBadge from '../../components/common/StatusBadge';
import { Loader2, Filter, Download } from 'lucide-react';

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await axiosInstance.get('/bookings');
            setBookings(data.data);
        } catch (err) {
            console.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axiosInstance.patch(`/bookings/${id}/status`, { status });
            fetchBookings();
        } catch (err) {
            alert('Update failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">All Bookings</h1>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Animal</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Update</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-8"><Loader2 className="animate-spin mx-auto text-indigo-600" /></td></tr>
                            ) : bookings.map(booking => (
                                <tr key={booking.booking_id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-400">#{booking.booking_id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">{booking.user_name}</span>
                                            <span className="text-xs text-slate-500">{booking.user_email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 capitalize font-medium">{booking.animal_name} ({booking.tag_no})</td>
                                    <td className="px-6 py-4 capitalize">{booking.booking_type}</td>
                                    <td className="px-6 py-4 font-bold">Rs. {parseFloat(booking.total_amount).toLocaleString()}</td>
                                    <td className="px-6 py-4"><StatusBadge status={booking.booking_status} /></td>
                                    <td className="px-6 py-4">
                                        <select 
                                            className="text-xs bg-slate-50 border border-slate-200 rounded p-1 outline-none"
                                            value={booking.booking_status}
                                            onChange={(e) => handleUpdateStatus(booking.booking_id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
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

export default ManageBookings;
