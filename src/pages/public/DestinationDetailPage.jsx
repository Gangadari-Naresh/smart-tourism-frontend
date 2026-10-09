import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Star, Heart, Plus, CloudSun, Compass, Send, CheckCircle2 } from 'lucide-react';
import RatingStars from '../../components/RatingStars';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { destinationApi } from '../../api/destinationApi';
import { attractionApi } from '../../api/attractionApi';
import { reviewApi } from '../../api/reviewApi';
import { favoriteApi } from '../../api/favoriteApi';
import { itineraryApi } from '../../api/itineraryApi';
import { useAuth } from '../../context/AuthContext';

const DestinationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [destination, setDestination] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userItineraries, setUserItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  const [selectedItineraryId, setSelectedItineraryId] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [notes, setNotes] = useState('');

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dest, attrs, revs] = await Promise.all([
          destinationApi.getById(id),
          attractionApi.getAll(id),
          reviewApi.getByDestination(id)
        ]);
        setDestination(dest);
        setAttractions(attrs);
        setReviews(revs);
      } catch (err) {
        console.error("Error loading destination detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleOpenItineraryModal = async () => {
    if (!isAuthenticated) {
      alert("Please log in to add this destination to your itinerary.");
      navigate('/login');
      return;
    }
    try {
      const itinList = await itineraryApi.getAll();
      setUserItineraries(itinList);
      if (itinList.length > 0) {
        setSelectedItineraryId(itinList[0].id);
      }
      setIsItineraryModalOpen(true);
    } catch (err) {
      console.error("Error loading user itineraries:", err);
    }
  };

  const handleAddToItinerary = async (e) => {
    e.preventDefault();
    if (!selectedItineraryId) {
      alert("Please select or create an itinerary first.");
      return;
    }
    try {
      const existingItin = await itineraryApi.getById(selectedItineraryId);
      const updatedItems = existingItin.items || [];
      updatedItems.push({
        destinationId: destination.id,
        dayNumber: parseInt(dayNumber) || 1,
        notes: notes || `Visit ${destination.name}`
      });

      await itineraryApi.update(selectedItineraryId, {
        name: existingItin.name,
        startDate: existingItin.startDate,
        endDate: existingItin.endDate,
        description: existingItin.description,
        items: updatedItems
      });

      alert(`Successfully added ${destination.name} to itinerary!`);
      setIsItineraryModalOpen(false);
    } catch (err) {
      console.error("Error adding item to itinerary:", err);
      alert("Failed to add destination to itinerary.");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in to leave a review.");
      navigate('/login');
      return;
    }
    setSubmittingReview(true);
    try {
      const newReview = await reviewApi.create({
        destinationId: destination.id,
        rating: parseInt(rating),
        comment: comment
      });
      setReviews([newReview, ...reviews]);
      setComment('');
      alert("Review submitted successfully!");

      // Refresh destination for updated avg rating
      const updatedDest = await destinationApi.getById(id);
      setDestination(updatedDest);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading destination details..." />;
  if (!destination) return <div className="container" style={{ padding: '3rem 0' }}>Destination not found.</div>;

  return (
    <div>
      {/* Hero Banner Header */}
      <div style={{
        position: 'relative',
        height: '420px',
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.8)), url("${destination.imageUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
        color: '#fff',
        paddingBottom: '3rem'
      }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span className="badge badge-primary">{destination.categoryName}</span>
            <span className="badge badge-accent">{destination.budget} Budget</span>
            <span className="badge badge-warning">★ {destination.rating} / 5.0</span>
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
            {destination.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '1.05rem', color: '#e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={18} style={{ color: 'var(--primary)' }} />
              <span>{destination.city}, {destination.state}, {destination.country}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={18} style={{ color: 'var(--accent)' }} />
              <span>Best Time: {destination.bestTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          
          {/* Left Column: Overview, Attractions, Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Overview Card */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>About Destination</h2>
              <p style={{ color: 'var(--text-main)', lineHeight: 1.7, fontSize: '1.05rem' }}>
                {destination.description}
              </p>
            </div>

            {/* Attractions Section */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>Popular Attractions Nearby</h2>
              {attractions.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No attractions listed for this destination yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {attractions.map(attr => (
                    <div key={attr.id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                      <img src={attr.imageUrl} alt={attr.name} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{attr.name}</h4>
                        <span className="badge badge-accent" style={{ margin: '4px 0' }}>Fee: ₹{attr.entryFee}</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{attr.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ratings & User Reviews */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>User Reviews</h2>
                <RatingStars rating={destination.rating} size={20} />
              </div>

              {/* Review Input Form */}
              <form onSubmit={handleReviewSubmit} style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Leave a Review & Rating</h4>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Rating:</label>
                  <select className="form-control" style={{ width: 'auto' }} value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="5">★★★★★ (5/5 Excellent)</option>
                    <option value="4">★★★★☆ (4/5 Very Good)</option>
                    <option value="3">★★★☆☆ (3/5 Average)</option>
                    <option value="2">★★☆☆☆ (2/5 Below Average)</option>
                    <option value="1">★☆☆☆☆ (1/5 Poor)</option>
                  </select>
                </div>

                <div className="form-group">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Share your personal experience, travel tips, and feedback..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" disabled={submittingReview} className="btn btn-primary btn-sm">
                  <Send size={14} /> Submit Review
                </button>
              </form>

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review this place!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {reviews.map(rev => (
                    <div key={rev.id} style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rev.userName}</span>
                        <RatingStars rating={rev.rating} size={14} />
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.4rem' }}>{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Actions, Weather Placeholder, Travel Tips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Quick Action Widget */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Plan Your Trip</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <button onClick={handleOpenItineraryModal} className="btn btn-primary" style={{ width: '100%' }}>
                  <Plus size={18} /> Add to Itinerary
                </button>
                <Link to="/recommendations" className="btn btn-accent" style={{ width: '100%' }}>
                  <Compass size={18} /> Get Recommended Route
                </Link>
              </div>
            </div>

            {/* Weather Information Placeholder */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <CloudSun size={24} style={{ color: 'var(--warning)' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Live Weather Info</h3>
              </div>
              <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>26°C</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Pleasant & Clear Skies</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Ideal for sightseeing & outdoor activities</div>
              </div>
            </div>

            {/* Essential Travel Tips */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Traveler Tips</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Book local attractions and entry tickets early to avoid long queues.</span>
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Best weather conditions are during {destination.bestTime}.</span>
                </li>
                <li style={{ display: 'flex', gap: '8px' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Respect local heritage guidelines and environmental sustainability.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Add to Itinerary Modal */}
      <Modal
        isOpen={isItineraryModalOpen}
        onClose={() => setIsItineraryModalOpen(false)}
        title={`Add ${destination.name} to Travel Itinerary`}
      >
        <form onSubmit={handleAddToItinerary}>
          {userItineraries.length === 0 ? (
            <div style={{ textCenter: 'center', padding: '1rem 0' }}>
              <p style={{ marginBottom: '1rem' }}>You don't have any existing itineraries. Please create one in your dashboard!</p>
              <Link to="/dashboard/itineraries" className="btn btn-primary btn-sm">Create New Itinerary</Link>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Select Itinerary</label>
                <select
                  className="form-control"
                  value={selectedItineraryId}
                  onChange={(e) => setSelectedItineraryId(e.target.value)}
                  required
                >
                  {userItineraries.map(itin => (
                    <option key={itin.id} value={itin.id}>{itin.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Day Number of Trip</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={dayNumber}
                  onChange={(e) => setDayNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Activity Notes</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="e.g. Visit beach at sunset, explore local heritage market..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Save Destination to Itinerary
              </button>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default DestinationDetailPage;
