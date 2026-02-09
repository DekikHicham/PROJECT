import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import './Sections.css';

const SaveIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

function LandingCopySection({ project }) {
    const { updateProjectSection } = useProjects();
    const [copy, setCopy] = useState(project.landingCopy || {
        headline: '',
        subheadline: '',
        body: '',
        cta: ''
    });
    const [saved, setSaved] = useState(false);

    // Auto-save with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            updateProjectSection(project.id, 'landingCopy', copy);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }, 1000);

        return () => clearTimeout(timer);
    }, [copy, project.id, updateProjectSection]);

    const handleChange = (field, value) => {
        setCopy(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <h3 className="section-title">Landing Page Copy</h3>
                {saved && (
                    <span className="save-indicator">
                        <SaveIcon /> Auto-saved
                    </span>
                )}
            </div>

            <div className="copy-editor card">
                <div className="form-group">
                    <label className="form-label">Headline</label>
                    <input
                        type="text"
                        className="input headline-input"
                        placeholder="Your main headline..."
                        value={copy.headline}
                        onChange={(e) => handleChange('headline', e.target.value)}
                    />
                    <span className="char-count">{copy.headline.length} characters</span>
                </div>

                <div className="form-group">
                    <label className="form-label">Subheadline</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Supporting headline..."
                        value={copy.subheadline}
                        onChange={(e) => handleChange('subheadline', e.target.value)}
                    />
                    <span className="char-count">{copy.subheadline.length} characters</span>
                </div>

                <div className="form-group">
                    <label className="form-label">Body Copy</label>
                    <textarea
                        className="input textarea"
                        placeholder="Main body text for your landing page..."
                        value={copy.body}
                        onChange={(e) => handleChange('body', e.target.value)}
                        rows={6}
                    />
                    <span className="char-count">{copy.body.length} characters</span>
                </div>

                <div className="form-group">
                    <label className="form-label">Call-to-Action (CTA)</label>
                    <input
                        type="text"
                        className="input cta-input"
                        placeholder="e.g., Get Started, Learn More, Buy Now..."
                        value={copy.cta}
                        onChange={(e) => handleChange('cta', e.target.value)}
                    />
                </div>

                {/* Preview */}
                <div className="copy-preview">
                    <h4 className="preview-title">Preview</h4>
                    <div className="preview-content">
                        <h1 className="preview-headline">{copy.headline || 'Your Headline Here'}</h1>
                        <h2 className="preview-subheadline">{copy.subheadline || 'Your subheadline here'}</h2>
                        <p className="preview-body">{copy.body || 'Your body copy will appear here...'}</p>
                        <button className="preview-cta">{copy.cta || 'Call to Action'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingCopySection;
