import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { Weight, DollarSign, Tag } from 'lucide-react';

const AnimalCard = ({ animal, onBookFull, onViewHissas }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            {/* Image Placeholder */}
            <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                <img 
                    src={`https://api.dicebear.com/9.x/icons/svg?seed=${animal.category_name}&backgroundColor=f3f4f6`}
                    alt={animal.category_name}
                    className="w-24 h-24 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                    <StatusBadge status={animal.status} />
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 capitalize">{animal.category_name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Tag className="w-3 h-3" /> {animal.tag_no}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Weight className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">{animal.weight} KG</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Rs. {parseFloat(animal.price).toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                    <button
                        onClick={() => onBookFull(animal)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                    >
                        Book Full Animal
                    </button>
                    {['Cow', 'Camel'].includes(animal.category_name) && (
                        <button
                            onClick={() => onViewHissas(animal)}
                            className="w-full bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold py-2.5 rounded-lg border border-gray-200 transition-colors"
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
