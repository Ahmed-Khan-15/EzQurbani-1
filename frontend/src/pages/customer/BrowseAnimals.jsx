import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnimals, getAnimalHissas } from '../../api/animalApi';
import AnimalCard from '../../components/customer/AnimalCard';
import HissaSelector from '../../components/customer/HissaSelector';
import { Loader2 } from 'lucide-react';

const BrowseAnimals = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [hissas, setHissas] = useState([]);
    const [loadingHissas, setLoadingHissas] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchAnimals();
    }, []);

    const fetchAnimals = async () => {
        try {
            const data = await getAnimals();
            setAnimals(data);
        } catch (err) {
            console.error('Failed to fetch animals');
        } finally {
            setLoading(false);
        }
    };

    const handleBookFull = (animal) => {
        navigate('/dashboard/customer/book-confirm', { 
            state: { animal, type: 'full' } 
        });
    };

    const handleViewHissas = async (animal) => {
        setLoadingHissas(true);
        setSelectedAnimal(animal);
        try {
            const data = await getAnimalHissas(animal.animal_id);
            setHissas(data);
        } catch (err) {
            console.error('Failed to fetch hissas');
            setSelectedAnimal(null);
        } finally {
            setLoadingHissas(false);
        }
    };

    const handleSelectHissa = (hissa) => {
        navigate('/dashboard/customer/book-confirm', { 
            state: { 
                animal: selectedAnimal, 
                hissa, 
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

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Choose Your Sacrifice</h1>
                <p className="text-gray-500 mt-2">Browse our high-quality inventory for your Qurbani.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {animals.map((animal) => (
                    <AnimalCard 
                        key={animal.animal_id} 
                        animal={animal} 
                        onBookFull={handleBookFull}
                        onViewHissas={handleViewHissas}
                    />
                ))}
            </div>

            {selectedAnimal && !loadingHissas && (
                <HissaSelector 
                    animal={selectedAnimal}
                    hissas={hissas}
                    onClose={() => setSelectedAnimal(null)}
                    onSelect={handleSelectHissa}
                />
            )}

            {loadingHissas && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                    <Loader2 className="w-10 h-10 animate-spin text-white" />
                </div>
            )}
        </div>
    );
};

export default BrowseAnimals;
