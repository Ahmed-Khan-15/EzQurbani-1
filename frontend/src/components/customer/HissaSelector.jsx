import React from 'react';
import { X, Check } from 'lucide-react';

const HissaSelector = ({ animal, hissas, onClose, onSelect }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-green-50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Select Hissa Slot</h3>
                        <p className="text-sm text-green-700">Tag: {animal.tag_no} • Rs. {hissas[0]?.price.toLocaleString()} per hissa</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
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
                                className={`h-16 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                                    isBooked 
                                    ? 'bg-red-50 border-red-100 text-red-300 cursor-not-allowed' 
                                    : 'bg-green-50 border-green-200 text-green-700 hover:border-green-500 hover:shadow-md'
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

                <div className="p-4 bg-gray-50 text-center">
                    <p className="text-xs text-gray-500 italic">Red slots are already booked. Green slots are available.</p>
                </div>
            </div>
        </div>
    );
};

export default HissaSelector;
