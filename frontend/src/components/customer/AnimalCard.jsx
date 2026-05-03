import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { Weight, DollarSign, Tag } from 'lucide-react';

const AnimalCard = ({ animal, onBookFull, onViewHissas }) => {
    const getAnimalEmoji = (category) => {
        const map = {
            'bakra': '🐐',
            'cow': '🐄',
            'dumba': '🐏',
            'camel': '🐪'
        };
        return map[category?.toLowerCase()] || '🐾';
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-ez-gold/20 overflow-hidden hover:shadow-lg hover:border-ez-gold transition-all duration-300 group">
            {/* Image Placeholder */}
            <div className="h-48 bg-[#fdf6e8] flex items-center justify-center relative overflow-hidden">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-500 drop-shadow-md">
                    {getAnimalEmoji(animal.category_name)}
                </span>
                <div className="absolute top-4 right-4">
                    <StatusBadge status={animal.status} />
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-2xl font-bold text-ez-emerald capitalize font-serif">{animal.category_name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Tag className="w-3 h-3" /> {animal.tag_no}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Weight className="w-4 h-4 text-ez-gold" />
                        <span className="text-sm font-medium">{animal.weight} KG</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4 text-ez-gold" />
                        <span className="text-sm font-bold text-ez-emerald">Rs. {parseFloat(animal.price).toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                    <button
                        onClick={() => onBookFull(animal)}
                        className="w-full bg-ez-emerald hover:bg-ez-emerald-light text-ez-gold font-bold py-2.5 rounded-lg transition-colors border border-ez-emerald"
                    >
                        Book Full Animal
                    </button>
                    {['Cow', 'Camel'].includes(animal.category_name) && (
                        <button
                            onClick={() => onViewHissas(animal)}
                            className="w-full bg-white hover:bg-ez-cream text-ez-emerald font-bold py-2.5 rounded-lg border border-ez-gold/30 hover:border-ez-gold transition-colors"
                        >
                            View Hissas
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnimalCard;
