import React, { useState, useEffect } from 'react';
import { getAllSchedules, getAllHouses, getAllButchers, createSchedule } from '../../api/adminApi';
import { getAnimals } from '../../api/animalApi';
import { Calendar, Clock, MapPin, User, Loader2, PlusCircle } from 'lucide-react';

const ManageSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [animals, setAnimals] = useState([]);
    const [houses, setHouses] = useState([]);
    const [butchers, setButchers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        animal_id: '',
        house_id: '',
        butcher_id: '',
        slaughter_date: '',
        slaughter_time: '',
        status: 'pending'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [scheds, anims, hs, btch] = await Promise.all([
                getAllSchedules(), getAnimals(), getAllHouses(), getAllButchers()
            ]);
            setSchedules(scheds);
            setAnimals(anims.filter(a => a.status === 'booked'));
            setHouses(hs);
            setButchers(btch);
        } catch (err) {
            console.error('Fetch error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createSchedule(formData);
            fetchData();
            setFormData({ animal_id: '', house_id: '', butcher_id: '', slaughter_date: '', slaughter_time: '', status: 'pending' });
        } catch (err) {
            alert('Scheduling failed');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <PlusCircle className="text-indigo-600 w-5 h-5" /> New Schedule
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Select Animal</label>
                            <select 
                                className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none" required
                                value={formData.animal_id} onChange={(e) => setFormData({...formData, animal_id: e.target.value})}
                            >
                                <option value="">Choose booked animal...</option>
                                {animals.map(a => <option key={a.animal_id} value={a.animal_id}>{a.tag_no} - {a.category_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Slaughterhouse</label>
                            <select 
                                className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none" required
                                value={formData.house_id} onChange={(e) => setFormData({...formData, house_id: e.target.value})}
                            >
                                <option value="">Select location...</option>
                                {houses.map(h => <option key={h.house_id} value={h.house_id}>{h.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Butcher</label>
                            <select 
                                className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none" required
                                value={formData.butcher_id} onChange={(e) => setFormData({...formData, butcher_id: e.target.value})}
                            >
                                <option value="">Assign butcher...</option>
                                {butchers.map(b => <option key={b.butcher_id} value={b.butcher_id}>{b.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date</label>
                                <input 
                                    type="date" className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none" required
                                    value={formData.slaughter_date} onChange={(e) => setFormData({...formData, slaughter_date: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Time</label>
                                <input 
                                    type="time" className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none" required
                                    value={formData.slaughter_time} onChange={(e) => setFormData({...formData, slaughter_time: e.target.value})}
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
                            Assign Schedule
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Active Schedules</h2>
                {loading ? <Loader2 className="animate-spin mx-auto mt-12 text-indigo-600" /> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {schedules.map(item => (
                            <div key={item.schedule_id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-indigo-200 transition-all">
                                <div className="absolute top-0 right-0 p-2">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">{item.category_name} ({item.tag_no})</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <MapPin className="w-4 h-4 text-indigo-500" /> {item.house_name}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <User className="w-4 h-4 text-indigo-500" /> {item.butcher_name}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-900 font-bold border-t border-slate-50 pt-3">
                                        <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> {new Date(item.slaughter_date).toLocaleDateString()}</div>
                                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {item.slaughter_time}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageSchedules;
