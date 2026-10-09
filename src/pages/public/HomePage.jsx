import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Compass, MapPin, Sparkles, Star, ArrowRight, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import DestinationCard from '../../components/DestinationCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { destinationApi } from '../../api/destinationApi';
import { categoryApi } from '../../api/categoryApi';
import { attractionApi } from '../../api/attractionApi';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, dests, attrs] = await Promise.all([
          categoryApi.getAll(),
          destinationApi.getFeatured(),
          attractionApi.getAll()
        ]);
        setCategories(cats);
        setFeaturedDestinations(dests);
        setAttractions(attrs.slice(0, 4));
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/destinations?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '82vh',
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.75)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        color: '#fff',
        padding: '4rem 0'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px' }}>
          <span className="badge badge-accent" style={{ marginBottom: '1.25rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
            <Sparkles size={14} /> AI-Powered Travel Assistant
          </span>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem', lineHeight: 1.15 }}>
            Discover Your Next Unforgettable Journey
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#e2e8f0', marginBottom: '2.5rem', fontWeight: 400 }}>
            Personalized tourism recommendations, itinerary planning, handpicked destinations, and seamless trip management.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            padding: '0.6rem 0.6rem 0.6rem 1.5rem',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            maxWidth: '680px',
            margin: '0 auto',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <Search size={22} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by destination name, state (e.g. Goa, Kerala, Jaipur)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '1rem',
                fontFamily: 'var(--font-body)',
                color: 'var(--text-main)',
                background: 'transparent'
              }}
            />
            <button type="submit" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-full)', flexShrink: 0 }}>
              Search Places
            </button>
          </form>

          {/* Popular Tag Pills */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.9rem', color: '#cbd5e1' }}>
            <span>Popular Searches:</span>
            {['Goa Beaches', 'Kerala Backwaters', 'Jaipur Heritage', 'Manali Snow', 'Ooty Hills'].map(tag => (
              <span key={tag} onClick={() => navigate(`/destinations?search=${encodeURIComponent(tag.split(' ')[0])}`)} style={{ cursor: 'pointer', textDecoration: 'underline', color: '#fff', fontWeight: 600 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tourism Categories Section */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
            <h2 className="section-title">Explore Travel Categories</h2>
            <p className="section-subtitle">Select your preferred travel style to discover curated locations tailored to your lifestyle</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/destinations?category=${cat.id}`}
                className="glass-card card-hover"
                style={{
                  padding: '1.5rem',
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '180px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25 }}
                />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <h2 className="section-title">Popular Destinations</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>Top rated places loved by thousands of travelers</p>
            </div>
            <Link to="/destinations" className="btn btn-outline">
              View All Destinations <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching top destinations..." />
          ) : (
            <div className="grid-cards">
              {featuredDestinations.map(dest => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Smart Recommendation Banner */}
      <section style={{
        background: 'linear-gradient(135deg, var(--bg-dark-surface) 0%, var(--bg-dark) 100%)',
        color: '#fff',
        padding: '5rem 0'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <span className="badge badge-accent" style={{ marginBottom: '1rem' }}>
              <Sparkles size={14} /> Smart Matching Engine
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              Get Recommendations Tailored to Your Preferences & Budget
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Our rule-based engine scores destinations based on your category choices, budget limits, preferred duration, and interests to present high-confidence match percentage scores (e.g., 92% Match for Goa).
            </p>
            <Link to="/recommendations" className="btn btn-accent btn-lg">
              Generate Smart Recommendations <Sparkles size={18} />
            </Link>
          </div>

          <div className="glass-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
            <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.3rem' }}>How Recommendation Matching Works:</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--primary)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}>35%</div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1rem' }}>Category Match</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Direct alignment with your selected interest (Beaches, Nature, History, Hills)</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'var(--accent)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}>25%</div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1rem' }}>Budget Alignment</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Ensures financial comfort (Low, Medium, High, Luxury tiers)</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#f59e0b', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}>20%</div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1rem' }}>Location & Specific Activities</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Filters by state preference & keyword interest matches</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: '#8b5cf6', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold' }}>20%</div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1rem' }}>Rating & Community Feedback</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Verified user reviews and historical rating score</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tourist Attractions */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
            <h2 className="section-title">Must-Visit Attractions</h2>
            <p className="section-subtitle">Famous landmarks, forts, beaches, and hidden gems across India</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {attractions.map(attr => (
              <div key={attr.id} className="glass-card card-hover" style={{ overflow: 'hidden' }}>
                <img src={attr.imageUrl} alt={attr.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                <div style={{ padding: '1.25rem' }}>
                  <span className="badge badge-accent" style={{ marginBottom: '0.5rem' }}>Entry: ₹{attr.entryFee}</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.3rem' }}>{attr.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                    <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    {attr.destinationName}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{attr.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section" style={{ background: 'var(--primary-light)', textCenter: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '750px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-hover)' }}>
            Ready to Plan Your Dream Vacation?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Join thousands of travelers using Wanderlust to plan customized multi-day itineraries, save favorite spots, and discover local attractions.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account
            </Link>
            <Link to="/destinations" className="btn btn-outline btn-lg">
              Browse All Places
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
