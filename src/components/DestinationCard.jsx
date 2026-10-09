import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, Tag, ArrowRight } from 'lucide-react';
import RatingStars from './RatingStars';
import { useAuth } from '../context/AuthContext';
import { favoriteApi } from '../api/favoriteApi';

const DestinationCard = ({ destination, isFavorite: initialFav = false, onFavoriteToggle, matchScore }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialFav);
  const [loading, setLoading] = useState(false);

  const handleToggleFav = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in to save favorites');
      return;
    }
    setLoading(true);
    try {
      if (isFavorite) {
        await favoriteApi.removeFavorite(destination.id);
        setIsFavorite(false);
      } else {
        await favoriteApi.addFavorite(destination.id);
        setIsFavorite(true);
      }
      if (onFavoriteToggle) onFavoriteToggle(destination.id, !isFavorite);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setLoading(false);
    }
  };

  const getBudgetBadgeClass = (budget) => {
    switch (budget?.toLowerCase()) {
      case 'low': return 'badge-accent';
      case 'medium': return 'badge-primary';
      case 'high': return 'badge-warning';
      case 'luxury': return 'badge-danger';
      default: return 'badge-primary';
    }
  };

  return (
    <div className="glass-card card-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Top Banner Image */}
      <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden' }}>
        <img
          src={destination.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}
          alt={destination.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        
        {/* Category & Budget Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span className="badge badge-primary">{destination.categoryName || 'General'}</span>
          <span className={`badge ${getBudgetBadgeClass(destination.budget)}`}>{destination.budget}</span>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleToggleFav}
          disabled={loading}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          <Heart
            size={18}
            style={{
              color: isFavorite ? '#ef4444' : '#64748b',
              fill: isFavorite ? '#ef4444' : 'none',
              transition: 'all 0.2s ease'
            }}
          />
        </button>

        {/* Smart Recommendation Score Match Pill */}
        {matchScore !== undefined && matchScore !== null && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '20px',
            fontWeight: '700',
            fontSize: '0.8rem',
            boxShadow: '0 2px 10px rgba(16,185,129,0.4)'
          }}>
            {matchScore}% Match
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{destination.name}</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          <MapPin size={14} style={{ color: 'var(--primary)' }} />
          <span>{destination.city}, {destination.state}, {destination.country}</span>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {destination.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
          <RatingStars rating={destination.rating} />
          
          <Link to={`/destinations/${destination.id}`} className="btn btn-primary btn-sm">
            Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
