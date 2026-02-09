import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import './ProjectCard.css';

const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

function ProjectCard({ project }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getProjectIcon = () => {
        const colors = ['#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];
        const colorIndex = project.name.length % colors.length;
        const initial = project.name.charAt(0).toUpperCase();

        return (
            <div
                className="project-icon"
                style={{ background: `linear-gradient(135deg, ${colors[colorIndex]}, ${colors[(colorIndex + 1) % colors.length]})` }}
            >
                {initial}
            </div>
        );
    };

    return (
        <Link to={`/projects/${project.id}`} className="project-card">
            <div className="project-card-header">
                {getProjectIcon()}
                <StatusBadge status={project.status} />
            </div>

            <div className="project-card-body">
                <h3 className="project-card-title">{project.name}</h3>
                <p className="project-card-description">
                    {project.description || 'No description provided'}
                </p>
                {project.tags && project.tags.length > 0 && (
                    <div className="project-card-tags">
                        {project.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="project-tag">{tag}</span>
                        ))}
                        {project.tags.length > 3 && (
                            <span className="project-tag project-tag-more">+{project.tags.length - 3}</span>
                        )}
                    </div>
                )}
            </div>

            <div className="project-card-footer">
                <span className="project-card-date">
                    Updated {formatDate(project.updatedAt)}
                </span>
                <span className="project-card-arrow">
                    <ArrowIcon />
                </span>
            </div>
        </Link>
    );
}

export default ProjectCard;

