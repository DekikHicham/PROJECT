import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import './Sidebar.css';

// Icons as SVG components
const DashboardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

const ProjectsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

function Sidebar() {
    const location = useLocation();
    const { searchQuery, setSearchQuery } = useProjects();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
        { path: '/projects', label: 'Projects', icon: <ProjectsIcon /> },
    ];

    return (
        <>
            <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">
                            <svg viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="8" height="8" rx="2" fill="url(#logoGrad)" />
                                <rect x="13" y="3" width="8" height="8" rx="2" fill="url(#logoGrad)" opacity="0.7" />
                                <rect x="3" y="13" width="8" height="8" rx="2" fill="url(#logoGrad)" opacity="0.7" />
                                <rect x="13" y="13" width="8" height="8" rx="2" fill="url(#logoGrad)" opacity="0.4" />
                                <defs>
                                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#7c3aed" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span className="logo-text">ProjectHub</span>
                    </div>
                </div>

                <div className="sidebar-search">
                    <div className="search-container">
                        <SearchIcon />
                        <input
                            type="text"
                            className="input search-input"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-item ${isActive || (item.path === '/projects' && location.pathname.startsWith('/projects/')) ? 'active' : ''}`
                            }
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-version">
                        v1.0.0
                    </div>
                </div>
            </aside>

            {/* Mobile overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

            {/* Mobile menu button */}
            <button
                className="mobile-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
                {isOpen ? '✕' : '☰'}
            </button>
        </>
    );
}

export default Sidebar;
