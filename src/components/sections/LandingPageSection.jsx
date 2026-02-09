import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import './Sections.css';

const SaveIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const ImageIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

function LandingPageSection({ project }) {
    const { updateProjectSection } = useProjects();
    const [pageData, setPageData] = useState(project.landingPage || {
        mockupUrl: '',
        notes: ''
    });
    const [saved, setSaved] = useState(false);

    // Auto-save with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            updateProjectSection(project.id, 'landingPage', pageData);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 1000);

        return () => clearTimeout(timer);
    }, [pageData, project.id, updateProjectSection]);

    const handleChange = (field, value) => {
        setPageData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <h3 className="section-title">Landing Page</h3>
                {saved && (
                    <span className="save-indicator">
                        <SaveIcon /> Auto-saved
                    </span>
                )}
            </div>

            <div className="landing-page-content">
                {/* Mockup Preview Area */}
                <div className="mockup-area card">
                    <h4 className="area-title">Mockup Preview</h4>

                    <div className="form-group">
                        <label className="form-label">Mockup Image URL</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Paste image URL or upload link..."
                            value={pageData.mockupUrl}
                            onChange={(e) => handleChange('mockupUrl', e.target.value)}
                        />
                    </div>

                    <div className="mockup-preview">
                        {pageData.mockupUrl ? (
                            <img
                                src={pageData.mockupUrl}
                                alt="Landing page mockup"
                                className="mockup-image"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div className={`mockup-placeholder ${pageData.mockupUrl ? 'hidden' : ''}`}>
                            <ImageIcon />
                            <p>Add a mockup image URL above to preview your landing page design</p>
                        </div>
                    </div>
                </div>

                {/* Notes Area */}
                <div className="notes-area card">
                    <h4 className="area-title">Design Notes & Annotations</h4>
                    <textarea
                        className="input textarea notes-editor"
                        placeholder="Add notes about the landing page design, layout decisions, color schemes, etc..."
                        value={pageData.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        rows={12}
                    />
                </div>
            </div>
        </div>
    );
}

export default LandingPageSection;
