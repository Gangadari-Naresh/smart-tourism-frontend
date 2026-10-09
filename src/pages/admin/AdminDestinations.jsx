import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Search } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import RatingStars from '../../components/RatingStars';
import { destinationApi } from '../../api/destinationApi';
import { categoryApi } from '../../api/categoryApi';

const AdminDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: 'India',
    state: '',
    city: '',
    categoryId: '',
    budget: 'Medium',
    bestTime: 'October to March',
    imageUrl: '',
    rating: 4.5
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dests, cats] = await Promise.all([
        destinationApi.getAll(),
        categoryApi.getAll()
      ]);
      setDestinations(dests);
      setCategories(cats);
    } catch (err) {
      console.error("Error loading destinations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      country: 'India',
      state: '',
      city: '',
      categoryId: categories[0]?.id || '',
      budget: 'Medium',
      bestTime: 'October to March',
      imageUrl: '',
      rating: 4.5
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dest) => {
    setEditingId(dest.id);
    setFormData({
      name: dest.name,
      description: dest.description,
      country: dest.country,
      state: dest.state,
      city: dest.city,
      categoryId: dest.categoryId || categories[0]?.id || '',
      budget: dest.budget,
      bestTime: dest.bestTime,
      imageUrl: dest.imageUrl,
      rating: dest.rating
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await destinationApi.update(editingId, formData);
      } else {
        await destinationApi.create(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving destination:", err);
      alert("Failed to save destination.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this destination?")) {
      try {
        await destinationApi.delete(id);
        setDestinations(prev => prev.filter(d => d.id !== id));
      } catch (err) {
        console.error("Error deleting destination:", err);
      }
    }
  };

  const filteredDestinations = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.state.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Loading destination manager..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Manage Tourist Destinations</h1>
          <p style={{ color: 'var(--text-muted)' }}>Perform CRUD operations on destinations catalog</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '220px' }}
          />
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            <Plus size={18} /> Add Destination
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Destination</th>
              <th style={{ padding: '1rem' }}>Location</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Budget</th>
              <th style={{ padding: '1rem' }}>Rating</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDestinations.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem', fontWeight: 700 }}>#{d.id}</td>
                <td style={{ padding: '1rem', fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={d.imageUrl} alt={d.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px' }} />
                    <span>{d.name}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>{d.city}, {d.state}</td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge badge-primary">{d.categoryName}</span>
                </td>
                <td style={{ padding: '1rem' }}>{d.budget}</td>
                <td style={{ padding: '1rem' }}>
                  <RatingStars rating={d.rating} size={14} />
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button onClick={() => handleOpenEditModal(d)} className="btn btn-outline btn-sm">
                      <Edit size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(d.id)} className="btn btn-danger btn-sm">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Destination" : "Add New Tourist Destination"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Destination Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Goa"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" name="city" className="form-control" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input type="text" name="state" className="form-control" value={formData.state} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <input type="text" name="country" className="form-control" value={formData.country} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="categoryId" className="form-control" value={formData.categoryId} onChange={handleChange} required>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Budget Tier</label>
              <select name="budget" className="form-control" value={formData.budget} onChange={handleChange}>
                <option value="Low">Low Budget</option>
                <option value="Medium">Medium Budget</option>
                <option value="High">High Budget</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Best Time To Visit</label>
            <input type="text" name="bestTime" className="form-control" placeholder="e.g. November to February" value={formData.bestTime} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input type="url" name="imageUrl" className="form-control" placeholder="https://images.unsplash.com/..." value={formData.imageUrl} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Save Destination
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDestinations;
