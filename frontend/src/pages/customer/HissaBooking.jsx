import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActiveHissaAnimal } from '../../api/animalApi';
import { Loader2, ArrowLeft, CheckCircle2, ShoppingCart } from 'lucide-react';

const HissaBooking = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [animal, setAnimal] = useState(null);
    const [selectedHissas, setSelectedHissas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchActiveAnimal();
    }, [category]);

    const fetchActiveAnimal = async () => {
        setLoading(true);
        try {
            const data = await getActiveHissaAnimal(category);
            setAnimal(data);
        } catch (err) {
            console.error('Failed to fetch hissa animal', err);
            setError(err.response?.data?.message || 'Failed to find an available animal for hissa.');
        } finally {
            setLoading(false);
        }
    };

    const toggleHissaSelection = (hissa) => {
        if (hissa.status !== 'available') return;
        
        setSelectedHissas(prev => {
            const isSelected = prev.find(h => h.hissa_id === hissa.hissa_id);
            if (isSelected) {
                return prev.filter(h => h.hissa_id !== hissa.hissa_id);
            } else {
                return [...prev, hissa];
            }
        });
    };

    const handleProceed = () => {
        if (selectedHissas.length === 0) return;
        navigate('/dashboard/customer/book-confirm', { 
            state: { 
                animal, 
                hissas: selectedHissas, 
                type: 'hissa' 
            } 
        });
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-ez-emerald transition"
                >
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200">
                    {error}
                </div>
            </div>
        );
    }

    if (!animal) return null;

    const availableHissasCount = animal.hissas.filter(h => h.status === 'available').length;
    const bookedHissasCount = 7 - availableHissasCount;
    const totalPrice = selectedHissas.length * Number(animal.hissas[0]?.price);

    return (
        <div className="space-y-8 pb-12 max-w-4xl mx-auto">
            <button 
                onClick={() => navigate('/dashboard/customer/browse')}
                className="flex items-center gap-2 text-gray-600 hover:text-ez-emerald transition"
            >
                <ArrowLeft className="w-5 h-5" /> Back to Browse
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-ez-gold/20 overflow-hidden">
                <div className="bg-ez-emerald text-white p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold font-serif">{category} Hissa Booking</h1>
                            <p className="text-white/80 mt-2">Tag No: {animal.tag_no}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-ez-gold text-2xl font-bold">Rs. {Number(animal.hissas[0]?.price).toLocaleString()}</div>
                            <div className="text-white/80 text-sm">per hissa</div>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">Status</h3>
                            <p className="text-gray-500">Currently filling this animal</p>
                        </div>
                        <div className="flex items-center gap-6 text-center">
                            <div>
                                <div className="text-3xl font-bold text-red-500">{bookedHissasCount}</div>
                                <div className="text-sm text-gray-500 uppercase tracking-wide font-medium mt-1">Booked</div>
                            </div>
                            <div className="h-10 w-px bg-gray-200"></div>
                            <div>
                                <div className="text-3xl font-bold text-ez-emerald">{availableHissasCount}</div>
                                <div className="text-sm text-gray-500 uppercase tracking-wide font-medium mt-1">Available</div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif">Select Your Hissas (Multiple Allowed)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {animal.hissas.sort((a, b) => a.hissa_no - b.hissa_no).map((hissa) => {
                            const isAvailable = hissa.status === 'available';
                            const isSelected = selectedHissas.find(h => h.hissa_id === hissa.hissa_id);
                            
                            return (
                                <div 
                                    key={hissa.hissa_id}
                                    onClick={() => toggleHissaSelection(hissa)}
                                    className={`
                                        relative p-4 rounded-xl border-2 text-center transition-all cursor-pointer
                                        ${!isAvailable 
                                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                            : isSelected 
                                                ? 'border-ez-gold bg-ez-gold/10 text-ez-emerald shadow-md translate-y-[-2px]' 
                                                : 'border-ez-emerald/30 hover:border-ez-emerald bg-white text-ez-emerald hover:-translate-y-1'
                                        }
                                    `}
                                >
                                    <div className="text-lg font-bold">Hissa {hissa.hissa_no}</div>
                                    {!isAvailable && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 rounded-xl">
                                            <div className="flex items-center gap-1 text-sm font-semibold text-gray-500">
                                                <CheckCircle2 className="w-4 h-4" /> Booked
                                            </div>
                                        </div>
                                    )}
                                    {isSelected && (
                                        <div className="absolute -top-2 -right-2 bg-ez-gold text-white rounded-full p-1 shadow-sm">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sticky Footer for Checkout */}
                {selectedHissas.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50 p-6 flex items-center justify-between sticky bottom-0">
                        <div>
                            <div className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">
                                {selectedHissas.length} Hissa{selectedHissas.length > 1 ? 's' : ''} Selected
                            </div>
                            <div className="text-2xl font-black text-ez-emerald">
                                Rs. {totalPrice.toLocaleString()}
                            </div>
                        </div>
                        <button
                            onClick={handleProceed}
                            className="bg-ez-gold hover:bg-ez-gold-light text-ez-emerald font-black py-3 px-8 rounded-xl shadow-md border border-ez-gold transition-all active:scale-[0.98] flex items-center gap-2"
                        >
                            Proceed to Checkout <ShoppingCart className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HissaBooking;
