import React from 'react';
import './StatusBadge.css';

function StatusBadge({ status }) {
    const getStatusConfig = () => {
        switch (status) {
            case 'in-progress':
                return { label: 'In Progress', className: 'badge-progress' };
            case 'completed':
                return { label: 'Completed', className: 'badge-completed' };
            case 'on-hold':
                return { label: 'On Hold', className: 'badge-hold' };
            default:
                return { label: status, className: '' };
        }
    };

    const { label, className } = getStatusConfig();

    return (
        <span className={`badge ${className}`}>
            <span className="badge-dot"></span>
            {label}
        </span>
    );
}

export default StatusBadge;
