import React, { useContext, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
    LayoutDashboard, 
    PawPrint, 
    ClipboardList, 
    CalendarClock, 
    Truck, 
    Users, 
    LogOut, 
    ShieldCheck,
    Menu,
    X,
    TrendingUp
} from 'lucide-react';

// Sub-pages (Placeholders to be built next)
import AdminOverview from './AdminOverview';
import ManageAnimals from './ManageAnimals';
import ManageBookings from './ManageBookings';
import ManageSchedules from './ManageSchedules';
import ManageDeliveries from './ManageDeliveries';
import ManageUsers from './ManageUsers';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard/admin', name: 'Overview', icon: LayoutDashboard },
        { path: '/dashboard/admin/animals', name: 'Manage Animals', icon: PawPrint },
        { path: '/dashboard/admin/bookings', name: 'All Bookings', icon: ClipboardList },
        { path: '/dashboard/admin/schedules', name: 'Schedules', icon: CalendarClock },
        { path: '/dashboard/admin/deliveries', name: 'Deliveries', icon: Truck },
        { path: '/dashboard/admin/users', name: 'User Management', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside 
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 flex flex-col z-20`}
            >
                {/* Logo Area */}
                <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="text-white w-5 h-5" />
                    </div>
                    {isSidebarOpen && <span className="font-bold text-xl text-white tracking-tight">EzAdmin</span>}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                                    isActive 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User & Logout */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/20">
                                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
                                <p className="text-xs text-slate-500 truncate capitalize">{user?.role} Access</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all font-medium text-sm"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Exit Dashboard</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm z-10">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Server Status</p>
                            <p className="text-xs text-green-500 font-bold flex items-center justify-end gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Online
                            </p>
                        </div>
                    </div>
                </header>

                {/* Nested Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
                    <Routes>
                        <Route path="/" element={<AdminOverview />} />
                        <Route path="/animals" element={<ManageAnimals />} />
                        <Route path="/bookings" element={<ManageBookings />} />
                        <Route path="/schedules" element={<ManageSchedules />} />
                        <Route path="/deliveries" element={<ManageDeliveries />} />
                        <Route path="/users" element={<ManageUsers />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
