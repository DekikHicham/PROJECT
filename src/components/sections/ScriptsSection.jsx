import React, { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import './Sections.css';

const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const SaveIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

function ScriptsSection({ project }) {
    const { addToSection, updateInSection, removeFromSection } = useProjects();
    const [editingId, setEditingId] = useState(null);
    const [newScript, setNewScript] = useState({ title: '', content: '' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [saveStatus, setSaveStatus] = useState({});

    const handleAddScript = () => {
        if (newScript.title.trim()) {
            addToSection(project.id, 'scripts', {
                title: newScript.title,
                content: newScript.content,
                updatedAt: new Date().toISOString()
            });
            setNewScript({ title: '', content: '' });
            setShowAddForm(false);
        }
    };

    const handleUpdateScript = (scriptId, updates) => {
        updateInSection(project.id, 'scripts', scriptId, {
            ...updates,
            updatedAt: new Date().toISOString()
        });
        setSaveStatus(prev => ({ ...prev, [scriptId]: true }));
        setTimeout(() => {
            setSaveStatus(prev => ({ ...prev, [scriptId]: false }));
        }, 2000);
    };

    const handleDeleteScript = (scriptId) => {
        removeFromSection(project.id, 'scripts', scriptId);
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <h3 className="section-title">Scripts</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(true)}
                >
                    <PlusIcon />
                    <span>Add Script</span>
                </button>
            </div>

            {/* Add New Script Form */}
            {showAddForm && (
                <div className="card add-item-card">
                    <div className="form-group">
                        <label className="form-label">Script Title</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Enter script title..."
                            value={newScript.title}
                            onChange={(e) => setNewScript(prev => ({ ...prev, title: e.target.value }))}
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Script Content</label>
                        <textarea
                            className="input textarea script-editor"
                            placeholder="Write your script here..."
                            value={newScript.content}
                            onChange={(e) => setNewScript(prev => ({ ...prev, content: e.target.value }))}
                            rows={8}
                        />
                    </div>
                    <div className="card-actions">
                        <button className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleAddScript}>
                            Add Script
                        </button>
                    </div>
                </div>
            )}

            {/* Scripts List */}
            <div className="items-list">
                {project.scripts.length > 0 ? (
                    project.scripts.map(script => (
                        <div key={script.id} className="item-card card">
                            <div className="item-header">
                                <input
                                    type="text"
                                    className="input item-title-input"
                                    value={script.title}
                                    onChange={(e) => handleUpdateScript(script.id, { title: e.target.value })}
                                />
                                <div className="item-actions">
                                    {saveStatus[script.id] && (
                                        <span className="save-indicator">
                                            <SaveIcon /> Saved
                                        </span>
                                    )}
                                    <button
                                        className="btn btn-ghost btn-icon btn-danger-icon"
                                        onClick={() => handleDeleteScript(script.id)}
                                        title="Delete script"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                            <textarea
                                className="input textarea script-editor"
                                value={script.content}
                                onChange={(e) => handleUpdateScript(script.id, { content: e.target.value })}
                                placeholder="Write your script content..."
                                rows={10}
                            />
                            <div className="item-meta">
                                Last updated: {new Date(script.updatedAt).toLocaleString()}
                            </div>
                        </div>
                    ))
                ) : !showAddForm && (
                    <div className="empty-section">
                        <p>No scripts yet. Add your first script to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ScriptsSection;
