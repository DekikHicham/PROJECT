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

function ReviewsSection({ project }) {
    const { addToSection, updateInSection, removeFromSection } = useProjects();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newReview, setNewReview] = useState({ author: '', comment: '', status: 'pending' });

    const handleAddReview = () => {
        if (newReview.comment.trim()) {
            addToSection(project.id, 'reviews', {
                ...newReview,
                createdAt: new Date().toISOString()
            });
            setNewReview({ author: '', comment: '', status: 'pending' });
            setShowAddForm(false);
        }
    };

    const handleUpdateStatus = (reviewId, status) => {
        updateInSection(project.id, 'reviews', reviewId, { status });
    };

    const handleDeleteReview = (reviewId) => {
        removeFromSection(project.id, 'reviews', reviewId);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'approved': return 'review-status-approved';
            case 'needs-changes': return 'review-status-changes';
            default: return 'review-status-pending';
        }
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <h3 className="section-title">Reviews & Feedback</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(true)}
                >
                    <PlusIcon />
                    <span>Add Review</span>
                </button>
            </div>

            {/* Add New Review Form */}
            {showAddForm && (
                <div className="card add-item-card">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Reviewer Name</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Who is reviewing?"
                                value={newReview.author}
                                onChange={(e) => setNewReview(prev => ({ ...prev, author: e.target.value }))}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="input select"
                                value={newReview.status}
                                onChange={(e) => setNewReview(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="needs-changes">Needs Changes</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Comment</label>
                        <textarea
                            className="input textarea"
                            placeholder="Review comments and feedback..."
                            value={newReview.comment}
                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                            rows={4}
                            autoFocus
                        />
                    </div>
                    <div className="card-actions">
                        <button className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleAddReview}>
                            Add Review
                        </button>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
                {project.reviews.length > 0 ? (
                    project.reviews.map(review => (
                        <div key={review.id} className="review-card card">
                            <div className="review-header">
                                <div className="review-author">
                                    <div className="author-avatar">
                                        {review.author ? review.author.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className="author-info">
                                        <span className="author-name">{review.author || 'Anonymous'}</span>
                                        <span className="review-date">{formatDate(review.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="review-actions">
                                    <select
                                        className={`input select review-status-select ${getStatusClass(review.status)}`}
                                        value={review.status}
                                        onChange={(e) => handleUpdateStatus(review.id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="needs-changes">Needs Changes</option>
                                    </select>
                                    <button
                                        className="btn btn-ghost btn-icon btn-danger-icon"
                                        onClick={() => handleDeleteReview(review.id)}
                                        title="Delete review"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                        </div>
                    ))
                ) : !showAddForm && (
                    <div className="empty-section">
                        <p>No reviews yet. Add feedback and review comments here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReviewsSection;
