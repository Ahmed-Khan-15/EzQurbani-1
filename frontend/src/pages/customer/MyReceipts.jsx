import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getReceipt } from '../../api/paymentApi';
import { getMyBookings } from '../../api/bookingApi';
import { Receipt, Download, Loader2, Printer } from 'lucide-react';

const MyReceipts = () => {
    const location = useLocation();
    const [bookingId, setBookingId] = useState(location.state?.bookingId || '');
    const [bookings, setBookings] = useState([]);
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMyBookings();
        if (bookingId) {
            handleFetchReceipt(bookingId);
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

    const handleFetchReceipt = async (id) => {
        setLoading(true);
        try {
            const data = await getReceipt(id);
            setReceipt(data);
        } catch (err) {
            console.error('No receipt found');
            setReceipt(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment Receipts</h1>
                <p className="text-gray-500 mt-2">View and download your official sacrificial booking receipts.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Booking</label>
                    <select 
                        value={bookingId}
                        onChange={(e) => {
                            setBookingId(e.target.value);
                            handleFetchReceipt(e.target.value);
                        }}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">Choose an order...</option>
                        {bookings.map(b => (
                            <option key={b.booking_id} value={b.booking_id}>
                                Order #{b.booking_id} - {b.animal_name} ({b.tag_no})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                </div>
            ) : receipt ? (
                <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 max-w-2xl mx-auto relative overflow-hidden">
                    {/* Watermark/Stamp */}
                    <div className="absolute top-10 right-10 opacity-10 -rotate-12">
                        <Receipt className="w-32 h-32 text-green-600" />
                    </div>

                    <div className="border-b-2 border-dashed border-gray-100 pb-8 mb-8 text-center">
                        <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-black text-2xl">Ez</span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">EzQurbani Official Receipt</h2>
                        <p className="text-gray-400 text-sm mt-1">Receipt ID: {receipt.receipt_no}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Payment Date</span>
                            <span className="text-gray-900 font-bold">{new Date(receipt.payment_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Payment Method</span>
                            <span className="text-gray-900 font-bold">{receipt.payment_method}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Booking ID</span>
                            <span className="text-gray-900 font-bold">#{receipt.booking_id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Animal Tag</span>
                            <span className="text-gray-900 font-bold">{receipt.tag_no}</span>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl mt-8">
                            <div className="flex justify-between items-center text-xl font-black text-gray-900">
                                <span>Total Paid</span>
                                <span>Rs. {parseFloat(receipt.amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex gap-4">
                        <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors">
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                        <button className="px-6 py-3 border-2 border-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                            <Printer className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : bookingId && (
                <div className="text-center py-12 text-gray-400">
                    No receipt found for this order. Ensure payment is completed.
                </div>
            )}
        </div>
    );
};

export default MyReceipts;
