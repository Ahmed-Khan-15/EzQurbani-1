import React from 'react';
import { X, Check } from 'lucide-react';

const HissaSelector = ({ animal, hissas, onClose, onSelect }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-ez-gold/20">
                <div className="p-6 border-b border-ez-gold/20 flex justify-between items-center bg-ez-cream relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-ez-gold/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-ez-emerald font-serif">Select Hissa Slot</h3>
                        <p className="text-sm text-ez-emerald/80 font-bold mt-1">Tag: <span className="text-ez-gold">{animal.tag_no}</span> • Rs. {hissas[0]?.price.toLocaleString()} per hissa</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors relative z-10 border border-transparent hover:border-ez-gold/30">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-4 gap-4">
                    {hissas.map((hissa) => {
                        const isBooked = hissa.status !== 'available';
                        return (
                            <button
                                key={hissa.hissa_id}
                                disabled={isBooked}
                                onClick={() => onSelect(hissa)}
                                className={`h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all relative ${
                                    isBooked 
                                    ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' 
                                    : 'bg-ez-cream border-ez-gold/30 text-ez-emerald hover:border-ez-gold hover:bg-ez-gold hover:text-white hover:shadow-lg'
                                }`}
                            >
                                <span className="text-xs font-bold uppercase">Hissa</span>
                                <span className="text-lg font-bold">{hissa.hissa_no}</span>
                                {isBooked && <X className="w-3 h-3 absolute top-1 right-1" />}
                                {!isBooked && <Check className="w-3 h-3 absolute top-1 right-1 opacity-0 group-hover:opacity-100" />}
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 bg-ez-cream/30 text-center border-t border-ez-gold/10">
                    <p className="text-xs text-gray-500 italic">Gray slots are already booked. Gold slots are available.</p>
                </div>
            </div>
        </div>
    );
};

export default HissaSelector;
