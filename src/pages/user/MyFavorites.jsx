import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import DestinationCard from '../../components/DestinationCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { favoriteApi } from '../../api/favoriteApi';

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const data = await favoriteApi.getFavorites();
      setFavorites(data);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = (destinationId, isFav) => {
    if (!isFav) {
      setFavorites(prev => prev.filter(f => f.destinationId !== destinationId));
    }
  };

  if (loading) return <LoadingSpinner message="Loading saved favorite places..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Saved Favorite Destinations</h1>
        <p style={{ color: 'var(--text-muted)' }}>Quick access to your bookmarked travel spots</p>
      </div>

      {favorites.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Heart size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No Favorites Saved Yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Explore destinations and click the heart icon to save your favorites!</p>
        </div>
      ) : (
        <div className="grid-cards">
          {favorites.map(fav => (
            <DestinationCard
              key={fav.id}
              destination={fav.destination}
              isFavorite={true}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavorites;
