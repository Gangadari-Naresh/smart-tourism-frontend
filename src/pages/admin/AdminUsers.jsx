import React, { useState, useEffect } from 'react';
import { Users, Search, ToggleLeft, ToggleRight, Trash2, Shield } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminApi } from '../../api/adminApi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await adminApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const updated = await adminApi.toggleUserStatus(id);
      setUsers(prev => prev.map(u => u.id === id ? updated : u));
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user account?")) {
      try {
        await adminApi.deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner message="Loading user management table..." />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Manage Platform Users</h1>
          <p style={{ color: 'var(--text-muted)' }}>View registered users, modify status, and audit user roles</p>
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Email</th>
              <th style={{ padding: '1rem' }}>Phone</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Travel Preference</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem', fontWeight: 700 }}>#{u.id}</td>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{u.name}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                <td style={{ padding: '1rem' }}>{u.phone || 'N/A'}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-danger' : 'badge-primary'}`}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{u.travelPreference} ({u.budgetPreference})</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`badge ${u.enabled ? 'badge-accent' : 'badge-danger'}`}>
                    {u.enabled ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className="btn btn-outline btn-sm"
                      title={u.enabled ? "Deactivate User" : "Activate User"}
                    >
                      {u.enabled ? <ToggleRight size={18} style={{ color: 'var(--accent)' }} /> : <ToggleLeft size={18} style={{ color: 'var(--danger)' }} />}
                    </button>
                    {u.role !== 'ROLE_ADMIN' && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="btn btn-danger btn-sm"
                        title="Delete User"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
