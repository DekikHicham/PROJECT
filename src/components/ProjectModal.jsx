import React, { useState } from 'react';
import './ProjectModal.css';

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

function ProjectModal({ project, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: project?.name || '',
        description: project?.description || '',
        status: project?.status || 'in-progress',
        tags: project?.tags || []
    });

    const [errors, setErrors] = useState({});
    const [tagInput, setTagInput] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleAddTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !formData.tags.includes(tag)) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
            setTagInput('');
        }
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Project name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {project ? 'Edit Project' : 'Create New Project'}
                    </h2>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}>
                        <CloseIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Project Name *</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className={`input ${errors.name ? 'input-error' : ''}`}
                                placeholder="Enter project name"
                                value={formData.name}
                                onChange={handleChange}
                                autoFocus
                            />
                            {errors.name && <span className="form-error">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                className="input textarea"
                                placeholder="Describe your project..."
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                className="input select"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="on-hold">On Hold</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tags</label>
                            <div className="tag-input-container">
                                <input
                                    type="text"
                                    className="input tag-input"
                                    placeholder="Add a tag and press Enter..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                />
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-add-tag"
                                    onClick={handleAddTag}
                                >
                                    <PlusIcon />
                                </button>
                            </div>
                            {formData.tags.length > 0 && (
                                <div className="tags-list">
                                    {formData.tags.map(tag => (
                                        <span key={tag} className="tag">
                                            {tag}
                                            <button
                                                type="button"
                                                className="tag-remove"
                                                onClick={() => handleRemoveTag(tag)}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {project ? 'Save Changes' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProjectModal;

