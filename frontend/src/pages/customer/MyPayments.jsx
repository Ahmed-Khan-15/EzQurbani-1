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
            <div className="bg-white rounded-3xl shadow-xl border border-ez-gold/20 overflow-hidden">
                <div className="bg-ez-emerald p-8 text-ez-cream relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-ez-gold/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <h2 className="text-3xl font-bold font-serif text-ez-gold">Payment Portal</h2>
                    <p className="opacity-90 mt-1 italic">Securely finalize your booking for Order #{booking.booking_id}</p>
                    <div className="absolute top-8 right-8 text-ez-gold/20">
                        <CreditCard className="w-12 h-12" />
                    </div>
                </div>

                <div className="p-8 bg-ez-cream/30">
                    <div className="mb-8 p-6 bg-white border border-ez-gold/30 rounded-2xl shadow-sm text-center">
                        <p className="text-sm text-gray-500 mb-1 font-bold uppercase tracking-widest">Total to Pay</p>
                        <p className="text-4xl font-black text-ez-emerald">Rs. {parseFloat(booking.total_amount).toLocaleString()}</p>
                    </div>

                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-24 h-24 bg-ez-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-inner">
                                <CheckCircle className="w-12 h-12 text-ez-emerald" />
                            </div>
                            <h3 className="text-3xl font-bold text-ez-emerald font-serif">Payment Successful!</h3>
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
                                                ? 'border-ez-gold bg-ez-gold/5 ring-4 ring-ez-gold/10' 
                                                : 'border-ez-gold/10 hover:border-ez-gold/30 hover:bg-white bg-white/50'
                                            }`}
                                        >
                                            <input 
                                                type="radio" 
                                                name="method" 
                                                className="hidden"
                                                value={method.method_id}
                                                onChange={(e) => setSelectedMethod(parseInt(e.target.value))}
                                            />
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                                                selectedMethod === method.method_id ? 'bg-ez-emerald text-ez-gold' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {method.name.includes('Cash') ? <Wallet className="w-6 h-6" /> : <Landmark className="w-6 h-6" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`font-bold text-lg ${selectedMethod === method.method_id ? 'text-ez-emerald' : 'text-gray-700'}`}>{method.name}</p>
                                                <p className="text-xs text-gray-500">Process payment via {method.name}</p>
                                            </div>
                                            {selectedMethod === method.method_id && <CheckCircle className="w-6 h-6 text-ez-gold" />}
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
                                className="w-full bg-ez-gold hover:bg-ez-gold-light text-ez-emerald font-black text-lg py-5 rounded-xl transition-all shadow-xl shadow-ez-gold/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 border border-ez-gold"
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
