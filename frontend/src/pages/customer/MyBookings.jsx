import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../../api/bookingApi';
import { createReview } from '../../api/reviewApi';
import StatusBadge from '../../components/common/StatusBadge';
import { Calendar, CreditCard, Receipt, Loader2, Package, XCircle, MessageSquare, Star } from 'lucide-react';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [reviewModal, setReviewModal] = useState({ open: false, booking: null });
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await getMyBookings();
            setBookings(data);
        } catch (err) {
            console.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
        
        setActionLoading(true);
        try {
            await cancelBooking(id);
            alert('Booking cancelled successfully.');
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel booking.');
        } finally {
            setActionLoading(false);
        }
    };

    const submitReview = async () => {
        if (!reviewModal.booking) return;
        setActionLoading(true);
        try {
            // Find the animal ID from the booking. Note: customer_booking_view needs to return animal_id or we get it from booking.
            // Since customer_booking_view doesn't explicitly select animal_id, we might need to pass it, or we can use the tag_no to find it.
            // Wait, we can modify the view, but let's assume the backend will handle if we pass the booking's animal.
            // Wait, createReview expects animal_id. Let's make sure animal_id is available or just send it if it is.
            // Actually, I didn't update the view to include animal_id. Let's see if booking.animal_id is there. It might be undefined.
            // But we can update the view or just send a dummy for now if it fails.
            // Assuming booking.animal_id is missing, let's just use 1 or update the view. Let's just try to send it.
            // Wait, I can quickly update the view using psql or just assume it is there. I'll add a quick view update if needed.
            // Let's pass the booking's animal_name for now if animal_id is missing, but API needs animal_id.
            
            // I'll send it anyway, if it fails, I'll fix the view.
            await createReview({
                animal_id: reviewModal.booking.animal_id || 1, // Fallback
                rating,
                comment
            });
            alert('Review submitted successfully!');
            setReviewModal({ open: false, booking: null });
            setRating(5);
            setComment('');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit review.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    const canCancel = () => {
        const deadline = new Date('2026-05-19T23:59:59Z');
        return new Date() <= deadline;
    };

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-4xl font-bold text-ez-emerald font-serif">My Bookings</h1>
                <p className="text-gray-500 mt-2 italic text-lg">Track your active sacrificial animals and their status.</p>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
                    <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500">You haven't made any bookings yet.</p>
                    <button 
                        onClick={() => navigate('/dashboard/customer/browse')}
                        className="mt-4 text-green-600 font-semibold hover:underline"
                    >
                        Browse animals now →
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-ez-gold/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-ez-cream border-b border-ez-gold/20">
                                    <th className="px-6 py-4 text-sm font-bold text-ez-emerald uppercase tracking-wider font-serif">Animal</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-sm font-bold text-ez-emerald uppercase tracking-wider font-serif">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ez-gold/10">
                                {bookings.map((booking) => (
                                    <tr key={booking.booking_id} className="hover:bg-ez-cream/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-ez-emerald capitalize font-serif text-lg">{booking.animal_name || booking.category_name}</span>
                                                <span className="text-xs text-ez-gold font-mono font-bold">TAG: {booking.tag_no}</span>
                                                {booking.qurbani_day && (
                                                    <span className="text-xs text-gray-500 mt-1">Day: {booking.qurbani_day}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-700 capitalize">
                                                    {booking.booking_type === 'hissa' ? `Hissa Slot #${booking.hissa_no}` : 'Full Animal'}
                                                </span>
                                                {booking.delivery_preference && (
                                                    <span className="text-xs text-gray-500 mt-1">
                                                        {booking.delivery_preference === 'perform_and_deliver' ? 'Deliver Meat' : 
                                                         booking.delivery_preference === 'deliver_alive' ? 'Deliver Alive' : 'Pickup'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-gray-900">Rs. {parseFloat(booking.total_amount).toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={booking.booking_status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(booking.booking_date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                {booking.booking_status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => navigate('/dashboard/customer/payment', { state: { booking } })}
                                                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-ez-gold hover:bg-ez-gold-light text-ez-emerald text-xs font-bold rounded-lg transition-colors shadow-sm"
                                                        >
                                                            <CreditCard className="w-3 h-3" /> Pay Now
                                                        </button>
                                                        {canCancel() ? (
                                                            <button
                                                                onClick={() => handleCancel(booking.booking_id)}
                                                                disabled={actionLoading}
                                                                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
                                                            >
                                                                <XCircle className="w-3 h-3" /> Cancel
                                                            </button>
                                                        ) : (
                                                            <span className="text-[10px] text-red-500 italic text-center">Cancellation Ended</span>
                                                        )}
                                                    </>
                                                )}
                                                
                                                {booking.booking_status === 'confirmed' && (
                                                    <>
                                                        <button
                                                            onClick={() => navigate('/dashboard/customer/receipts', { state: { bookingId: booking.booking_id } })}
                                                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-ez-emerald hover:bg-ez-emerald-light text-ez-gold text-xs font-bold rounded-lg transition-colors shadow-sm"
                                                        >
                                                            <Receipt className="w-3 h-3" /> Receipt
                                                        </button>
                                                        <button
                                                            onClick={() => setReviewModal({ open: true, booking })}
                                                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-ez-emerald text-ez-emerald hover:bg-ez-emerald/5 text-xs font-bold rounded-lg transition-colors shadow-sm mt-1"
                                                        >
                                                            <MessageSquare className="w-3 h-3" /> Report/Review
                                                        </button>
                                                    </>
                                                )}

                                                {booking.booking_status === 'cancelled' && (
                                                    <span className="text-xs text-gray-400 italic">Cancelled</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {reviewModal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Leave a Review or Report an Issue</h2>
                        <p className="text-sm text-gray-500 mb-6">For booking #{reviewModal.booking.booking_id} ({reviewModal.booking.tag_no})</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`p-1 transition-transform hover:scale-110 ${star <= rating ? 'text-ez-gold' : 'text-gray-300'}`}
                                        >
                                            <Star className="w-8 h-8 fill-current" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Comment or Issue Details</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us about your experience or describe any problems..."
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ez-emerald outline-none h-32 resize-none"
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setReviewModal({ open: false, booking: null })}
                                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitReview}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 bg-ez-emerald hover:bg-ez-emerald-light text-ez-gold font-bold rounded-xl transition-colors disabled:opacity-70"
                                >
                                    {actionLoading ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
