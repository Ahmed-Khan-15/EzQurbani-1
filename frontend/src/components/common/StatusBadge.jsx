import React from 'react';

const StatusBadge = ({ status }) => {
    const getStyles = () => {
        switch (status.toLowerCase()) {
            case 'available':
            case 'confirmed':
            case 'delivered':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'booked':
            case 'pending':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'slaughtered':
            case 'packaged':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cancelled':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyles()} capitalize`}>
            {status}
        </span>
    );
};

export default StatusBadge;
