import React from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import ProjectCard from '../components/ProjectCard';
import './Dashboard.css';

// Icons
const FolderIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
);

const PlayIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
);

const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const PauseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="10" y1="15" x2="10" y2="9" />
        <line x1="14" y1="15" x2="14" y2="9" />
    </svg>
);

function Dashboard() {
    const { projects, stats, filteredProjects } = useProjects();

    const recentProjects = [...filteredProjects]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 6);

    const recentActivity = projects
        .flatMap(project => [
            ...project.reviews.map(r => ({
                type: 'review',
                projectName: project.name,
                projectId: project.id,
                text: `New review on "${project.name}"`,
                time: r.createdAt
            })),
            {
                type: 'update',
                projectName: project.name,
                projectId: project.id,
                text: `"${project.name}" was updated`,
                time: project.updatedAt
            }
        ])
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5);

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <div className="dashboard">
            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">
                        <FolderIcon />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">Total Projects</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
                        <PlayIcon />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.inProgress}</div>
                        <div className="stat-label">In Progress</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <CheckIcon />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.completed}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <PauseIcon />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.onHold}</div>
                        <div className="stat-label">On Hold</div>
                    </div>
                </div>
            </div>

            {/* Recent Projects */}
            <section className="dashboard-section">
                <div className="section-header">
                    <h2 className="section-title">Recent Projects</h2>
                    <Link to="/projects" className="section-link">View all →</Link>
                </div>

                {recentProjects.length > 0 ? (
                    <div className="projects-grid">
                        {recentProjects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <FolderIcon />
                        </div>
                        <h3 className="empty-state-title">No projects yet</h3>
                        <p className="empty-state-text">Create your first project to get started</p>
                    </div>
                )}
            </section>

            {/* Activity Feed */}
            <section className="dashboard-section">
                <div className="section-header">
                    <h2 className="section-title">Recent Activity</h2>
                </div>

                <div className="activity-feed card">
                    {recentActivity.length > 0 ? (
                        recentActivity.map((activity, index) => (
                            <Link
                                key={index}
                                to={`/projects/${activity.projectId}`}
                                className="activity-item"
                            >
                                <div className="activity-dot"></div>
                                <div className="activity-content">
                                    <p className="activity-text">{activity.text}</p>
                                    <span className="activity-time">{formatTimeAgo(activity.time)}</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="no-activity">No recent activity</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
