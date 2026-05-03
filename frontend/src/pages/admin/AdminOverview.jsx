import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../api/adminApi';
import { 
    ClipboardList, 
    CircleDollarSign, 
    PawPrint, 
    Truck, 
    TrendingUp,
    Loader2
} from 'lucide-react';

const AdminOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    const statCards = [
        { label: 'Total Bookings', value: stats.totalBookings, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Total Revenue', value: `Rs. ${parseFloat(stats.totalRevenue).toLocaleString()}`, icon: CircleDollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Animals Available', value: stats.availableAnimals, icon: PawPrint, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { label: 'Pending Deliveries', value: stats.pendingDeliveries, icon: Truck, color: 'text-amber-600', bg: 'bg-amber-100' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">System Overview</h1>
                    <p className="text-slate-500 mt-2">Real-time performance metrics and operational status.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-bold text-slate-600">Growth +12%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-300 italic">
                    Revenue Chart Placeholder
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-300 italic">
                    Booking Category Distribution Placeholder
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
