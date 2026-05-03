import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPaymentMethods, makePayment } from '../../api/paymentApi';
import { CreditCard, Wallet, Landmark, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const MyPayments = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking } = location.state || {};
    
    const [methods, setMethods] = useState([]);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchMethods();
    }, []);

    const fetchMethods = async () => {
        try {
            const data = await getPaymentMethods();
            setMethods(data);
        } catch (err) {
            console.error('Failed to fetch methods');
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!selectedMethod) return setError('Please select a payment method');

        setIsLoading(true);
        setError('');
        try {
            await makePayment({
                booking_id: booking.booking_id,
                method_id: selectedMethod,
                amount: booking.total_amount
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard/customer/receipts', { state: { bookingId: booking.booking_id } });
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!booking) {
        return (
            <div className="p-8 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold">No booking selected</h3>
                <p className="text-gray-500 mt-2">Please go to My Bookings and click "Pay Now".</p>
                <button onClick={() => navigate('/dashboard/customer/bookings')} className="mt-4 text-green-600 font-semibold">View Bookings →</button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-8">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-blue-600 p-8 text-white relative">
                    <h2 className="text-2xl font-bold">Payment Portal</h2>
                    <p className="opacity-90">Securely finalize your booking for Order #{booking.booking_id}</p>
                    <div className="absolute top-8 right-8">
                        <CreditCard className="w-10 h-10 opacity-20" />
                    </div>
                </div>

                <div className="p-8">
                    <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
                        <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wider">Total to Pay</p>
                        <p className="text-3xl font-extrabold text-gray-900">Rs. {parseFloat(booking.total_amount).toLocaleString()}</p>
                    </div>

                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Payment Successful!</h3>
                            <p className="text-gray-500 mt-2">Generating your official receipt...</p>
                        </div>
                    ) : (
                        <form onSubmit={handlePayment} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Payment Method</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {methods.map((method) => (
                                        <label 
                                            key={method.method_id}
                                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                selectedMethod === method.method_id 
                                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' 
                                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            <input 
                                                type="radio" 
                                                name="method" 
                                                className="hidden"
                                                value={method.method_id}
                                                onChange={(e) => setSelectedMethod(parseInt(e.target.value))}
                                            />
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                selectedMethod === method.method_id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {method.name.includes('Cash') ? <Wallet className="w-5 h-5" /> : <Landmark className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`font-bold ${selectedMethod === method.method_id ? 'text-blue-900' : 'text-gray-700'}`}>{method.name}</p>
                                                <p className="text-xs text-gray-400">Process payment via {method.name}</p>
                                            </div>
                                            {selectedMethod === method.method_id && <CheckCircle className="w-5 h-5 text-blue-600" />}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                                    <AlertCircle className="w-4 h-4" /> {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Processing Securely...
                                    </>
                                ) : (
                                    `Pay Rs. ${parseFloat(booking.total_amount).toLocaleString()}`
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyPayments;
