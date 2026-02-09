import React from 'react';
import { useProjects } from '../context/ProjectContext';
import ProjectCard from '../components/ProjectCard';
import './Projects.css';

const FolderIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

function Projects() {
    const { filteredProjects, filterStatus, setFilterStatus } = useProjects();

    const filters = [
        { value: 'all', label: 'All Projects' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'on-hold', label: 'On Hold' },
    ];

    return (
        <div className="projects-page">
            {/* Filter Tabs */}
            <div className="filters-section">
                <div className="tabs">
                    {filters.map(filter => (
                        <button
                            key={filter.value}
                            className={`tab ${filterStatus === filter.value ? 'active' : ''}`}
                            onClick={() => setFilterStatus(filter.value)}
                        >
                            {filter.label}
                            {filter.value === 'all' && (
                                <span className="tab-count">{filteredProjects.length}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length > 0 ? (
                <div className="projects-grid">
                    {filteredProjects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <FolderIcon />
                    </div>
                    <h3 className="empty-state-title">No projects found</h3>
                    <p className="empty-state-text">
                        {filterStatus !== 'all'
                            ? 'Try changing the filter or create a new project'
                            : 'Create your first project to get started'}
                    </p>
                </div>
            )}
        </div>
    );
}

export default Projects;
