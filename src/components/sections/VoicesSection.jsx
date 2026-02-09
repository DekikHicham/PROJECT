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

const MicIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
);

function VoicesSection({ project }) {
    const { addToSection, updateInSection, removeFromSection } = useProjects();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newVoice, setNewVoice] = useState({ talent: '', notes: '', status: 'pending' });

    const handleAddVoice = () => {
        if (newVoice.talent.trim()) {
            addToSection(project.id, 'voices', newVoice);
            setNewVoice({ talent: '', notes: '', status: 'pending' });
            setShowAddForm(false);
        }
    };

    const handleUpdateVoice = (voiceId, updates) => {
        updateInSection(project.id, 'voices', voiceId, updates);
    };

    const handleDeleteVoice = (voiceId) => {
        removeFromSection(project.id, 'voices', voiceId);
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'assigned', label: 'Assigned' },
        { value: 'recorded', label: 'Recorded' },
        { value: 'approved', label: 'Approved' }
    ];

    return (
        <div className="section-container">
            <div className="section-header">
                <h3 className="section-title">Voice-Over</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(true)}
                >
                    <PlusIcon />
                    <span>Add Voice</span>
                </button>
            </div>

            {/* Add New Voice Form */}
            {showAddForm && (
                <div className="card add-item-card">
                    <div className="form-group">
                        <label className="form-label">Voice Talent</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Enter voice talent name..."
                            value={newVoice.talent}
                            onChange={(e) => setNewVoice(prev => ({ ...prev, talent: e.target.value }))}
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                            className="input select"
                            value={newVoice.status}
                            onChange={(e) => setNewVoice(prev => ({ ...prev, status: e.target.value }))}
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Notes & Directions</label>
                        <textarea
                            className="input textarea"
                            placeholder="Voice direction, tone, style notes..."
                            value={newVoice.notes}
                            onChange={(e) => setNewVoice(prev => ({ ...prev, notes: e.target.value }))}
                            rows={4}
                        />
                    </div>
                    <div className="card-actions">
                        <button className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleAddVoice}>
                            Add Voice
                        </button>
                    </div>
                </div>
            )}

            {/* Voices List */}
            <div className="items-grid">
                {project.voices.length > 0 ? (
                    project.voices.map(voice => (
                        <div key={voice.id} className="item-card card voice-card">
                            <div className="voice-icon">
                                <MicIcon />
                            </div>
                            <div className="voice-content">
                                <input
                                    type="text"
                                    className="input item-title-input"
                                    value={voice.talent}
                                    onChange={(e) => handleUpdateVoice(voice.id, { talent: e.target.value })}
                                    placeholder="Voice talent name"
                                />
                                <select
                                    className="input select voice-status"
                                    value={voice.status}
                                    onChange={(e) => handleUpdateVoice(voice.id, { status: e.target.value })}
                                >
                                    {statusOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <textarea
                                    className="input textarea"
                                    value={voice.notes}
                                    onChange={(e) => handleUpdateVoice(voice.id, { notes: e.target.value })}
                                    placeholder="Voice direction notes..."
                                    rows={3}
                                />
                            </div>
                            <button
                                className="btn btn-ghost btn-icon btn-danger-icon voice-delete"
                                onClick={() => handleDeleteVoice(voice.id)}
                                title="Delete voice"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    ))
                ) : !showAddForm && (
                    <div className="empty-section">
                        <p>No voice-over entries yet. Add your first voice talent.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VoicesSection;
