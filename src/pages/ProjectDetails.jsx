import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import StatusBadge from '../components/StatusBadge';
import ProjectModal from '../components/ProjectModal';
import ScriptsSection from '../components/sections/ScriptsSection';
import VoicesSection from '../components/sections/VoicesSection';
import ReviewsSection from '../components/sections/ReviewsSection';
import LandingCopySection from '../components/sections/LandingCopySection';
import LandingPageSection from '../components/sections/LandingPageSection';
import './ProjectDetails.css';

const BackIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProject, updateProject, deleteProject } = useProjects();
    const [activeTab, setActiveTab] = useState('scripts');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const project = getProject(id);

    if (!project) {
        return (
            <div className="project-not-found">
                <h2>Project not found</h2>
                <p>The project you're looking for doesn't exist or has been deleted.</p>
                <Link to="/projects" className="btn btn-primary">
                    Back to Projects
                </Link>
            </div>
        );
    }

    const tabs = [
        { id: 'scripts', label: 'Scripts', icon: '📝' },
        { id: 'voices', label: 'Voices', icon: '🎙️' },
        { id: 'reviews', label: 'Reviews', icon: '💬' },
        { id: 'landing-copy', label: 'Landing Copy', icon: '✍️' },
        { id: 'landing-page', label: 'Landing Page', icon: '🎨' },
    ];

    const handleEdit = (data) => {
        updateProject(id, data);
        setShowEditModal(false);
    };

    const handleDelete = () => {
        deleteProject(id);
        navigate('/projects');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderSection = () => {
        switch (activeTab) {
            case 'scripts':
                return <ScriptsSection project={project} />;
            case 'voices':
                return <VoicesSection project={project} />;
            case 'reviews':
                return <ReviewsSection project={project} />;
            case 'landing-copy':
                return <LandingCopySection project={project} />;
            case 'landing-page':
                return <LandingPageSection project={project} />;
            default:
                return null;
        }
    };

    return (
        <div className="project-details">
            {/* Back Button */}
            <Link to="/projects" className="back-link">
                <BackIcon />
                <span>Back to Projects</span>
            </Link>

            {/* Project Header */}
            <div className="project-header card">
                <div className="project-header-main">
                    <div className="project-info">
                        <div className="project-title-row">
                            <h2 className="project-name">{project.name}</h2>
                            <StatusBadge status={project.status} />
                        </div>
                        <p className="project-description">
                            {project.description || 'No description provided'}
                        </p>
                        <div className="project-meta">
                            <span>Created {formatDate(project.createdAt)}</span>
                            <span className="meta-divider">•</span>
                            <span>Updated {formatDate(project.updatedAt)}</span>
                        </div>
                    </div>

                    <div className="project-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowEditModal(true)}
                        >
                            <EditIcon />
                            <span>Edit</span>
                        </button>
                        <button
                            className="btn btn-ghost btn-danger"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <TrashIcon />
                        </button>
                    </div>
                </div>
            </div>

            {/* Section Tabs */}
            <div className="section-tabs">
                <div className="tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            <span className="tab-label">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Section Content */}
            <div className="section-content">
                {renderSection()}
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <ProjectModal
                    project={project}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleEdit}
                />
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal delete-modal" onClick={e => e.stopPropagation()}>
                        <h3>Delete Project?</h3>
                        <p>Are you sure you want to delete "{project.name}"? This action cannot be undone.</p>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDelete}
                            >
                                Delete Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectDetails;
