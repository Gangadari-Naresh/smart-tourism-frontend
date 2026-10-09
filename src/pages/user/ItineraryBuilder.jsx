import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Calendar, MapPin, CheckCircle2, Map } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { itineraryApi } from '../../api/itineraryApi';
import { destinationApi } from '../../api/destinationApi';
import { attractionApi } from '../../api/attractionApi';

const ItineraryBuilder = () => {
  const [itineraries, setItineraries] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItineraryId, setEditingItineraryId] = useState(null);
  
  // Form State
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [itins, dests, attrs] = await Promise.all([
        itineraryApi.getAll(),
        destinationApi.getAll(),
        attractionApi.getAll()
      ]);
      setItineraries(itins);
      setDestinations(dests);
      setAttractions(attrs);
    } catch (err) {
      console.error("Error loading itineraries data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingItineraryId(null);
    setName('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setItems([
      { dayNumber: 1, destinationId: destinations[0]?.id || '', attractionId: '', notes: '' }
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (itin) => {
    setEditingItineraryId(itin.id);
    setName(itin.name);
    setStartDate(itin.startDate || '');
    setEndDate(itin.endDate || '');
    setDescription(itin.description || '');
    setItems(itin.items && itin.items.length > 0 ? itin.items : [
      { dayNumber: 1, destinationId: destinations[0]?.id || '', attractionId: '', notes: '' }
    ]);
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    const nextDay = items.length > 0 ? items[items.length - 1].dayNumber + 1 : 1;
    setItems([
      ...items,
      { dayNumber: nextDay, destinationId: destinations[0]?.id || '', attractionId: '', notes: '' }
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Please provide a trip name.");
      return;
    }

    try {
      const payload = {
        name,
        startDate: startDate || null,
        endDate: endDate || null,
        description,
        items
      };

      if (editingItineraryId) {
        await itineraryApi.update(editingItineraryId, payload);
      } else {
        await itineraryApi.create(payload);
      }

      setIsModalOpen(false);
      fetchInitialData();
    } catch (err) {
      console.error("Error saving itinerary:", err);
      alert("Failed to save itinerary.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this itinerary?")) {
      try {
        await itineraryApi.delete(id);
        setItineraries(prev => prev.filter(i => i.id !== id));
      } catch (err) {
        console.error("Error deleting itinerary:", err);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading travel itineraries..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Travel Itineraries & Trip Planner</h1>
          <p style={{ color: 'var(--text-muted)' }}>Build day-by-day travel schedules with destinations and attractions</p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          <Plus size={18} /> Create New Itinerary
        </button>
      </div>

      {itineraries.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Map size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No Itineraries Created Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Plan your first multi-day trip by selecting destinations and daily activities.</p>
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            Build First Itinerary
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {itineraries.map((itin) => (
            <div key={itin.id} className="glass-card" style={{ padding: '2rem' }}>
              
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{itin.name}</h3>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                    <span><Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} /> {itin.startDate || 'Flex'} to {itin.endDate || 'Flex'}</span>
                    <span>{itin.items?.length || 0} Scheduled Activities</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenEditModal(itin)} className="btn btn-outline btn-sm">
                    <Edit size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(itin.id)} className="btn btn-danger btn-sm">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>

              {itin.description && (
                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>{itin.description}</p>
              )}

              {/* Day-by-Day Timeline */}
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Day-by-Day Itinerary Timeline</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {itin.items && itin.items.length > 0 ? (
                  itin.items.map((item, idx) => (
                    <div key={item.id || idx} style={{ display: 'flex', gap: '1rem', background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
                      <div style={{ background: 'var(--primary)', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem', height: 'fit-content' }}>
                        Day {item.dayNumber}
                      </div>

                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                          {item.destinationName ? `Destination: ${item.destinationName}` : ''} 
                          {item.attractionName ? ` • Attraction: ${item.attractionName}` : ''}
                        </div>
                        {item.notes && (
                          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            Notes: {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>No daily items added yet.</p>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Itinerary Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItineraryId ? "Edit Trip Itinerary" : "Create New Trip Itinerary"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Trip Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Hyderabad to Goa 3-Day Tour"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Trip Goals</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Brief summary of trip..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Daily Schedule Items */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Daily Schedule Items</label>
              <button type="button" onClick={handleAddItem} className="btn btn-outline btn-sm">
                <Plus size={14} /> Add Day
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '240px', overflowY: 'auto' }}>
              {items.map((item, index) => (
                <div key={index} style={{ background: 'var(--bg-main)', padding: '0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Day:</span>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      style={{ width: '70px', padding: '0.3rem 0.5rem' }}
                      value={item.dayNumber}
                      onChange={(e) => handleItemChange(index, 'dayNumber', parseInt(e.target.value))}
                    />
                    <select
                      className="form-control"
                      style={{ padding: '0.3rem 0.5rem' }}
                      value={item.destinationId || ''}
                      onChange={(e) => handleItemChange(index, 'destinationId', e.target.value)}
                    >
                      <option value="">Select Destination</option>
                      {destinations.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>

                    <button type="button" onClick={() => handleRemoveItem(index)} className="btn btn-danger btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Activity Notes (e.g. Visit Baga beach, sunset cruise)..."
                    value={item.notes || ''}
                    onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Save Trip Itinerary
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ItineraryBuilder;
