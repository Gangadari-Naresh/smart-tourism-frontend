import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Camera } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { attractionApi } from '../../api/attractionApi';
import { destinationApi } from '../../api/destinationApi';

const AdminAttractions = () => {
  const [attractions, setAttractions] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    destinationId: '',
    imageUrl: '',
    entryFee: 0.0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attrs, dests] = await Promise.all([
        attractionApi.getAll(),
        destinationApi.getAll()
      ]);
      setAttractions(attrs);
      setDestinations(dests);
    } catch (err) {
      console.error("Error loading attractions:", err);
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
      destinationId: destinations[0]?.id || '',
      imageUrl: '',
      entryFee: 0.0
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (attr) => {
    setEditingId(attr.id);
    setFormData({
      name: attr.name,
      description: attr.description,
      destinationId: attr.destinationId,
      imageUrl: attr.imageUrl,
      entryFee: attr.entryFee
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
        await attractionApi.update(editingId, formData);
      } else {
        await attractionApi.create(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving attraction:", err);
      alert("Failed to save attraction.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this attraction?")) {
      try {
        await attractionApi.delete(id);
        setAttractions(prev => prev.filter(a => a.id !== id));
      } catch (err) {
        console.error("Error deleting attraction:", err);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading attractions manager..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Manage Tourist Attractions</h1>
          <p style={{ color: 'var(--text-muted)' }}>Perform CRUD operations on attractions linked to destinations</p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          <Plus size={18} /> Add Attraction
        </button>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Attraction</th>
              <th style={{ padding: '1rem' }}>Linked Destination</th>
              <th style={{ padding: '1rem' }}>Entry Fee</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attractions.map(a => (
              <tr key={a.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem', fontWeight: 700 }}>#{a.id}</td>
                <td style={{ padding: '1rem', fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={a.imageUrl} alt={a.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '8px' }} />
                    <span>{a.name}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge badge-primary">{a.destinationName}</span>
                </td>
                <td style={{ padding: '1rem' }}>₹{a.entryFee}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button onClick={() => handleOpenEditModal(a)} className="btn btn-outline btn-sm">
                      <Edit size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="btn btn-danger btn-sm">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Attraction" : "Add New Attraction"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Attraction Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Linked Destination</label>
            <select name="destinationId" className="form-control" value={formData.destinationId} onChange={handleChange} required>
              {destinations.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.state})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Entry Fee (₹)</label>
            <input
              type="number"
              min="0"
              name="entryFee"
              className="form-control"
              value={formData.entryFee}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              className="form-control"
              value={formData.imageUrl}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Save Attraction
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminAttractions;
