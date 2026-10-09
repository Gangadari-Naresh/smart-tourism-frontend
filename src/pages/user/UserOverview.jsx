import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map, Heart, Star, Sparkles, Plus, Calendar, ArrowRight, Compass } from 'lucide-react';
import DestinationCard from '../../components/DestinationCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { itineraryApi } from '../../api/itineraryApi';
import { favoriteApi } from '../../api/favoriteApi';
import { reviewApi } from '../../api/reviewApi';
import { recommendationApi } from '../../api/recommendationApi';

const UserOverview = () => {
  const { user } = useAuth();
  const [itineraries, setItineraries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [itins, favs, revs, recs] = await Promise.all([
          itineraryApi.getAll(),
          favoriteApi.getFavorites(),
          reviewApi.getMyReviews(),
          recommendationApi.getUserRecommendations()
        ]);
        setItineraries(itins);
        setFavorites(favs);
        setReviews(revs);
        setRecommendations(recs);
      } catch (err) {
        console.error("Error loading user dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your personal dashboard..." />;

  return (
    <div>
      {/* Welcome Greeting Banner */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', color: '#fff' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: '#e2e8f0', fontSize: '1.05rem' }}>
          Explore your saved itineraries, personalized destination scores, and travel activities.
        </p>
      </div>

      {/* 4 Counter Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <Map size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{itineraries.length}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Trips Planned</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: '#fee2e2', color: '#ef4444', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <Heart size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{favorites.length}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Saved Favorites</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: '#fef3c7', color: '#d97706', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <Star size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{reviews.length}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Reviews Written</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <Sparkles size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{recommendations.length}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Recommendations</div>
          </div>
        </div>

      </div>

      {/* Recommended Destinations Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Recommended For You</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Based on your {user?.travelPreference} & {user?.budgetPreference} budget preferences</p>
          </div>
          <Link to="/dashboard/recommendations" className="btn btn-outline btn-sm">
            View All Scores <ArrowRight size={14} />
          </Link>
        </div>

        {recommendations.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No recommendations calculated yet.</p>
        ) : (
          <div className="grid-cards">
            {recommendations.slice(0, 3).map(rec => (
              <DestinationCard key={rec.id} destination={rec.destination} matchScore={rec.score} />
            ))}
          </div>
        )}
      </div>

      {/* Two Column Grid: Upcoming Trips & Recent Reviews */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Upcoming Trips List */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Upcoming Planned Trips</h3>
            <Link to="/dashboard/itineraries" className="btn btn-primary btn-sm">
              <Plus size={14} /> Create Trip
            </Link>
          </div>

          {itineraries.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No trips created yet. Click Create Trip to get started!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {itineraries.slice(0, 3).map(itin => (
                <div key={itin.id} style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{itin.name}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Calendar size={12} /> {itin.startDate || 'Flexible dates'} ({itin.items?.length || 0} activities)
                    </div>
                  </div>
                  <Link to="/dashboard/itineraries" className="btn btn-outline btn-sm">View</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity / Reviews */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Recent Reviews & Feedback</h3>

          {reviews.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You haven't written any reviews yet. Share your experience on destination pages!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.slice(0, 3).map(rev => (
                <div key={rev.id} style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rev.destinationName}</span>
                    <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.85rem' }}>★ {rev.rating}/5</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserOverview;
