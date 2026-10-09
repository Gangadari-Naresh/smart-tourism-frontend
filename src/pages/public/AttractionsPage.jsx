import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Search } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { attractionApi } from '../../api/attractionApi';

const AttractionsPage = () => {
  const [attractions, setAttractions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const data = await attractionApi.getAll();
        setAttractions(data);
      } catch (err) {
        console.error("Error fetching attractions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttractions();
  }, []);

  const filteredAttractions = attractions.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.destinationName && a.destinationName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: '3rem 0', minHeight: '85vh' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title">Tourist Attractions Index</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>Explore landmarks, forts, beaches, and historic monuments</p>
          </div>

          <div style={{ position: 'relative', width: '320px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search attractions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading attractions..." />
        ) : filteredAttractions.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Camera size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3>No Attractions Found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {filteredAttractions.map(attr => (
              <div key={attr.id} className="glass-card card-hover" style={{ overflow: 'hidden' }}>
                <img
                  src={attr.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}
                  alt={attr.name}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span className="badge badge-accent">Entry Fee: ₹{attr.entryFee}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <MapPin size={12} style={{ color: 'var(--primary)' }} /> {attr.destinationName}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{attr.name}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{attr.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttractionsPage;
