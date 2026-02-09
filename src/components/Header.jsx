import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import ProjectModal from './ProjectModal';
import './Header.css';

const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { getProject, addProject } = useProjects();
    const [showModal, setShowModal] = useState(false);

    const getPageTitle = () => {
        if (location.pathname === '/') return 'Dashboard';
        if (location.pathname === '/projects') return 'Projects';
        if (location.pathname.startsWith('/projects/')) {
            const id = location.pathname.split('/')[2];
            const project = getProject(id);
            return project?.name || 'Project Details';
        }
        return 'Page';
    };

    const getPageSubtitle = () => {
        if (location.pathname === '/') return 'Welcome back! Here\'s an overview of your projects.';
        if (location.pathname === '/projects') return 'Manage and organize all your creative projects.';
        return null;
    };

    const handleAddProject = (data) => {
        const newProject = addProject(data);
        setShowModal(false);
        navigate(`/projects/${newProject.id}`);
    };

    return (
        <>
            <header className="header">
                <div className="header-content">
                    <div className="header-title-section">
                        <h1 className="header-title">{getPageTitle()}</h1>
                        {getPageSubtitle() && (
                            <p className="header-subtitle">{getPageSubtitle()}</p>
                        )}
                    </div>

                    <div className="header-actions">
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowModal(true)}
                        >
                            <PlusIcon />
                            <span>New Project</span>
                        </button>
                    </div>
                </div>
            </header>

            {showModal && (
                <ProjectModal
                    onClose={() => setShowModal(false)}
                    onSave={handleAddProject}
                />
            )}
        </>
    );
}

export default Header;
