import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { categoryApi } from '../../api/categoryApi';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const cats = await categoryApi.getAll();
      setCategories(cats);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', imageUrl: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      description: cat.description,
      imageUrl: cat.imageUrl
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
        await categoryApi.update(editingId, formData);
      } else {
        await categoryApi.create(formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err);
      alert("Failed to save category.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoryApi.delete(id);
        setCategories(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        console.error("Error deleting category:", err);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading tourism categories..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Manage Tourism Categories</h1>
          <p style={{ color: 'var(--text-muted)' }}>Define travel categories (e.g. Beaches, Hill Stations, Heritage)</p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="grid-cards">
        {categories.map(c => (
          <div key={c.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <img src={c.imageUrl} alt={c.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>{c.name}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{c.description}</p>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              <button onClick={() => handleOpenEditModal(c)} className="btn btn-outline btn-sm" style={{ flexGrow: 1 }}>
                <Edit size={14} /> Edit
              </button>
              <button onClick={() => handleDelete(c.id)} className="btn btn-danger btn-sm">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Category" : "Add New Category"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category Name</label>
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
            Save Category
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategories;
