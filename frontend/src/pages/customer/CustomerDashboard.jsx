import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
    LayoutDashboard, 
    Search, 
    BookOpen, 
    CreditCard, 
    Receipt, 
    Truck, 
    LogOut, 
    User as UserIcon,
    Menu,
    X
} from 'lucide-react';

// Sub-pages
import BrowseAnimals from './BrowseAnimals';
import MyBookings from './MyBookings';
import MyPayments from './MyPayments';
import MyReceipts from './MyReceipts';
import TrackDelivery from './TrackDelivery';
import BookConfirm from './BookConfirm';

const CustomerDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard/customer', name: 'Overview', icon: LayoutDashboard },
        { path: '/dashboard/customer/browse', name: 'Browse Animals', icon: Search },
        { path: '/dashboard/customer/bookings', name: 'My Bookings', icon: BookOpen },
        { path: '/dashboard/customer/payment', name: 'Make Payment', icon: CreditCard },
        { path: '/dashboard/customer/receipts', name: 'My Receipts', icon: Receipt },
        { path: '/dashboard/customer/track', name: 'Track Delivery', icon: Truck },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside 
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
            >
                {/* Logo Area */}
                <div className="p-6 flex items-center gap-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xl">E</span>
                    </div>
                    {isSidebarOpen && <span className="font-bold text-xl text-gray-800 tracking-tight">EzQurbani</span>}
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
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                                    isActive 
                                    ? 'bg-green-50 text-green-700' 
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center border border-green-200">
                                <UserIcon className="w-5 h-5 text-green-700" />
                            </div>
                            <div className="overflow-hidden text-ellipsis">
                                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Customer'}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded capitalize">
                            {user?.role} Portal
                        </span>
                    </div>
                </header>

                {/* Nested Content Scrollable */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <Routes>
                        <Route path="/" element={<Overview user={user} />} />
                        <Route path="/browse" element={<BrowseAnimals />} />
                        <Route path="/book-confirm" element={<BookConfirm />} />
                        <Route path="/bookings" element={<MyBookings />} />
                        <Route path="/payment" element={<MyPayments />} />
                        <Route path="/receipts" element={<MyReceipts />} />
                        <Route path="/track" element={<TrackDelivery />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

// Default Overview Component
const Overview = ({ user }) => (
    <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900">Assalam-o-Alaikum, {user?.name}! 👋</h1>
            <p className="text-gray-500 mt-2 text-lg">Manage your sacrificial animal bookings from your personal dashboard.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white shadow-lg shadow-green-100">
                <Search className="w-8 h-8 mb-4 opacity-80" />
                <h3 className="text-lg font-semibold opacity-90">Browse Inventory</h3>
                <p className="text-3xl font-bold mt-2">Animals</p>
                <Link to="/dashboard/customer/browse" className="inline-block mt-4 text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors font-medium backdrop-blur-sm">Explore Now →</Link>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-100">
                <BookOpen className="w-8 h-8 mb-4 opacity-80" />
                <h3 className="text-lg font-semibold opacity-90">My Orders</h3>
                <p className="text-3xl font-bold mt-2">Bookings</p>
                <Link to="/dashboard/customer/bookings" className="inline-block mt-4 text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors font-medium backdrop-blur-sm">View Status →</Link>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg shadow-orange-100">
                <Truck className="w-8 h-8 mb-4 opacity-80" />
                <h3 className="text-lg font-semibold opacity-90">Tracking</h3>
                <p className="text-3xl font-bold mt-2">Delivery</p>
                <Link to="/dashboard/customer/track" className="inline-block mt-4 text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors font-medium backdrop-blur-sm">Track Package →</Link>
            </div>
        </div>
    </div>
);

export default CustomerDashboard;
