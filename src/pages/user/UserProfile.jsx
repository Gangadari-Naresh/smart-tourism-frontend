import React, { useState } from 'react';
import { User, Mail, Phone, Compass, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';

const UserProfile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [travelPreference, setTravelPreference] = useState(user?.travelPreference || 'Beaches');
  const [budgetPreference, setBudgetPreference] = useState(user?.budgetPreference || 'Medium');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updated = await authApi.updateProfile({
        name,
        phone,
        travelPreference,
        budgetPreference
      });
      updateUser(updated);
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Profile & Preferences Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your contact details and default recommendation preferences</p>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        {message && (
          <div style={{ background: 'var(--accent-light)', color: 'var(--accent-hover)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Read-only)</label>
            <input
              type="email"
              className="form-control"
              value={user?.email || ''}
              disabled
              style={{ backgroundColor: 'var(--bg-main)', cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Preferred Travel Category</label>
              <select className="form-control" value={travelPreference} onChange={(e) => setTravelPreference(e.target.value)}>
                <option value="Beaches">Beaches & Coastal</option>
                <option value="Nature & Backwaters">Nature & Backwaters</option>
                <option value="Historical & Heritage">Historical & Heritage</option>
                <option value="Adventure & Hill Stations">Adventure & Hill Stations</option>
                <option value="Cultural & Spiritual">Cultural & Spiritual</option>
                <option value="Urban & Modern">Urban & Modern</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Default Budget Preference</label>
              <select className="form-control" value={budgetPreference} onChange={(e) => setBudgetPreference(e.target.value)}>
                <option value="Low">Low Budget</option>
                <option value="Medium">Medium Budget</option>
                <option value="High">High Budget</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Profile Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
