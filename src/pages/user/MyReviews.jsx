import React, { useState, useEffect } from 'react';
import { Star, Trash2, Edit } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import RatingStars from '../../components/RatingStars';
import { reviewApi } from '../../api/reviewApi';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await reviewApi.getMyReviews();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching my reviews:", err);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return <LoadingSpinner message="Loading your submitted reviews..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Destination Reviews & Ratings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage feedback submitted across tourist spots</p>
      </div>

      {reviews.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Star size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No Reviews Submitted Yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Visit destination pages to leave feedback and ratings!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reviews.map(rev => (
            <div key={rev.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>{rev.destinationName}</h3>
                <RatingStars rating={rev.rating} size={16} />
                <p style={{ color: 'var(--text-main)', marginTop: '0.75rem', fontSize: '0.95rem' }}>"{rev.comment}"</p>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                  Posted on {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>

              <button onClick={() => handleDelete(rev.id)} className="btn btn-danger btn-sm">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
