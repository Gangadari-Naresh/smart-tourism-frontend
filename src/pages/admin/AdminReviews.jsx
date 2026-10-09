import React, { useState, useEffect } from 'react';
import { Trash2, Star, ShieldAlert } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import RatingStars from '../../components/RatingStars';
import { reviewApi } from '../../api/reviewApi';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const data = await reviewApi.getAllAdmin();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching all reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await reviewApi.delete(id);
        setReviews(prev => prev.filter(r => r.id !== id));
      } catch (err) {
        console.error("Error deleting review:", err);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading review moderation queue..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Review Moderation Queue</h1>
        <p style={{ color: 'var(--text-muted)' }}>Audit user reviews and remove inappropriate content</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {reviews.map(rev => (
          <div key={rev.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{rev.destinationName}</span>
                <RatingStars rating={rev.rating} size={16} />
              </div>
              
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Reviewed by <strong>{rev.userName}</strong> on {new Date(rev.createdAt).toLocaleDateString()}
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', background: 'var(--bg-main)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                "{rev.comment}"
              </p>
            </div>

            <button onClick={() => handleDelete(rev.id)} className="btn btn-danger btn-sm" title="Delete Inappropriate Review">
              <Trash2 size={14} /> Remove Review
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
