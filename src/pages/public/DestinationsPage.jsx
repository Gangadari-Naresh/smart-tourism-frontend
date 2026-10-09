import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, MapPin } from 'lucide-react';
import DestinationCard from '../../components/DestinationCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { destinationApi } from '../../api/destinationApi';
import { categoryApi } from '../../api/categoryApi';

const DestinationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [budget, setBudget] = useState(searchParams.get('budget') || '');
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '');
  const [season, setSeason] = useState(searchParams.get('season') || '');

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (categoryId) params.categoryId = categoryId;
      if (budget) params.budget = budget;
      if (minRating) params.minRating = minRating;
      if (season) params.season = season;

      const data = await destinationApi.getAll(params);
      setDestinations(data);
    } catch (err) {
      console.error("Error fetching destinations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryApi.getAll();
        setCategories(cats);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [search, categoryId, budget, minRating, season]);

  const handleResetFilters = () => {
    setSearch('');
    setCategoryId('');
    setBudget('');
    setMinRating('');
    setSeason('');
    setSearchParams({});
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="section-title">Explore Tourist Destinations</h1>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>Filter by location, category, budget tier, rating score, and best season to visit</p>
        </div>

        {/* Filter Controls Card */}
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            <Filter size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Filter Destinations</h3>
            <button onClick={handleResetFilters} className="btn btn-outline btn-sm" style={{ marginLeft: 'auto' }}>
              <RefreshCw size={14} /> Reset Filters
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            
            {/* Search Input */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Search Location/State</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Goa, Jaipur..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Tourism Category</label>
              <select className="form-control" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Budget Select */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Budget Tier</label>
              <select className="form-control" value={budget} onChange={(e) => setBudget(e.target.value)}>
                <option value="">All Budgets</option>
                <option value="Low">Low Budget</option>
                <option value="Medium">Medium Budget</option>
                <option value="High">High Budget</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            {/* Minimum Rating Select */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Minimum Rating</label>
              <select className="form-control" value={minRating} onChange={(e) => setMinRating(e.target.value)}>
                <option value="">Any Rating</option>
                <option value="4.5">★ 4.5 & above</option>
                <option value="4.0">★ 4.0 & above</option>
                <option value="3.5">★ 3.5 & above</option>
              </select>
            </div>

            {/* Best Season */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Best Visit Season</label>
              <select className="form-control" value={season} onChange={(e) => setSeason(e.target.value)}>
                <option value="">Any Season</option>
                <option value="November">Winter (Nov - Feb)</option>
                <option value="October">Autumn (Oct - Mar)</option>
                <option value="June">Summer (Apr - Jun)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <LoadingSpinner message="Searching destinations..." />
        ) : destinations.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <MapPin size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3>No Destinations Found</h3>
            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0' }}>Try broadening your search filters or clearing criteria.</p>
            <button onClick={handleResetFilters} className="btn btn-primary">Clear All Filters</button>
          </div>
        ) : (
          <div className="grid-cards">
            {destinations.map(dest => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default DestinationsPage;
