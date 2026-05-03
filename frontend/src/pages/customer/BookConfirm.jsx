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

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-green-600 p-8 text-white">
                    <h2 className="text-2xl font-bold">Booking Confirmation</h2>
                    <p className="opacity-90">Please review your sacrificial selection details.</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center py-4 border-b border-gray-50">
                        <span className="text-gray-500 font-medium">Sacrifice Type</span>
                        <span className="text-gray-900 font-bold capitalize">{animal.category_name}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-gray-50">
                        <span className="text-gray-500 font-medium">Booking Option</span>
                        <span className="text-gray-900 font-bold capitalize">{type === 'hissa' ? `Hissa Slot #${hissa.hissa_no}` : 'Full Animal'}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-gray-50">
                        <span className="text-gray-500 font-medium">Tag Number</span>
                        <span className="text-gray-900 font-bold">{animal.tag_no}</span>
                    </div>
                    <div className="flex justify-between items-center py-6">
                        <span className="text-xl font-bold text-gray-900">Total Price</span>
                        <span className="text-3xl font-extrabold text-green-600">Rs. {price.toLocaleString()}</span>
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
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-100 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
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
