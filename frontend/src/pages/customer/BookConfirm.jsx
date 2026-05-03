import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../../api/bookingApi';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const BookConfirm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { animal, hissa, type } = location.state || {};
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!animal) {
        return <div className="p-8 text-center">Invalid selection. Please go back.</div>;
    }

    const price = type === 'hissa' ? parseFloat(hissa.price) : parseFloat(animal.price);

    const handleConfirm = async () => {
        setIsLoading(true);
        setError('');
        try {
            await createBooking({
                animal_id: animal.animal_id,
                hissa_id: hissa?.hissa_id || null,
                booking_type: type,
                total_amount: price
            });
            navigate('/dashboard/customer/bookings', { state: { success: true } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Browse
            </button>

            <div className="bg-white rounded-3xl shadow-xl border border-ez-gold/20 overflow-hidden">
                <div className="bg-ez-emerald p-8 text-ez-cream relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-ez-gold/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <h2 className="text-3xl font-bold font-serif text-ez-gold">Booking Confirmation</h2>
                    <p className="opacity-90 mt-1 italic">Please review your sacrificial selection details.</p>
                </div>

                <div className="p-8 space-y-6 bg-ez-cream/30">
                    <div className="flex justify-between items-center py-4 border-b border-ez-gold/20">
                        <span className="text-gray-500 font-bold uppercase tracking-widest text-xs font-serif">Sacrifice Type</span>
                        <span className="text-ez-emerald font-bold capitalize text-lg">{animal.category_name}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-ez-gold/20">
                        <span className="text-gray-500 font-bold uppercase tracking-widest text-xs font-serif">Booking Option</span>
                        <span className="text-ez-emerald font-bold capitalize text-lg">{type === 'hissa' ? `Hissa Slot #${hissa.hissa_no}` : 'Full Animal'}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-ez-gold/20">
                        <span className="text-gray-500 font-bold uppercase tracking-widest text-xs font-serif">Tag Number</span>
                        <span className="text-ez-emerald font-bold text-lg">{animal.tag_no}</span>
                    </div>
                    <div className="flex justify-between items-center py-6 bg-white rounded-xl px-6 border border-ez-gold/30 mt-4">
                        <span className="text-xl font-bold text-ez-emerald font-serif">Total Price</span>
                        <span className="text-3xl font-black text-ez-emerald">Rs. {price.toLocaleString()}</span>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-center gap-3 text-red-700">
                            <AlertCircle className="w-5 h-5" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="pt-4 flex flex-col gap-3">
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="w-full bg-ez-gold hover:bg-ez-gold-light text-ez-emerald font-black py-4 text-lg rounded-xl shadow-lg border border-ez-gold transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Processing...' : (
                                <>
                                    <CheckCircle className="w-5 h-5" /> Confirm Booking
                                </>
                            )}
                        </button>
                        <p className="text-xs text-gray-400 text-center">By clicking confirm, you agree to the slaughter and meat distribution terms.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookConfirm;
