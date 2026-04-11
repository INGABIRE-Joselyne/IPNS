import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigateTo } from '../utils/navigation';
import AdminLayout from '../components/AdminLayout';
import { Plus, Trash2, AlertCircle, Search } from 'lucide-react';

const API = 'http://localhost:8000/api/v1';

export default function AdminUserManagement() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'pharmacist' });
  const [roleEdits, setRoleEdits] = useState({});
  const [savingRoleId, setSavingRoleId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigateTo('/unauthorized');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API}/auth/admin/users/`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.results || []);
      setError('');
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/auth/admin/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg =
          body.detail ||
          (body.email && String(body.email)) ||
          (body.password && String(body.password)) ||
          (body.role && String(body.role)) ||
          JSON.stringify(body);
        throw new Error(typeof msg === 'string' ? msg : 'Failed to create user');
      }

      setFormData({ email: '', password: '', role: 'pharmacist' });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to create user');
      console.error(err);
    }
  };

  const displayRole = (u) => roleEdits[u.id] ?? u.role ?? 'pharmacist';

  const handleSaveRole = async (targetUser) => {
    const role = displayRole(targetUser);
    if (targetUser.id === user?.id && role !== 'admin') {
      setError('You cannot remove your own admin role.');
      return;
    }
    setSavingRoleId(targetUser.id);
    setError('');
    try {
      const response = await fetch(`${API}/auth/admin/users/${targetUser.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg = body.detail || body.role || JSON.stringify(body);
        throw new Error(typeof msg === 'string' ? msg : 'Failed to update role');
      }
      const updated = await response.json();
      setUsers((prev) => prev.map((row) => (row.id === updated.id ? { ...row, ...updated } : row)));
      setRoleEdits((prev) => {
        const next = { ...prev };
        delete next[targetUser.id];
        return next;
      });
    } catch (err) {
      setError(err.message || 'Failed to update role');
      console.error(err);
    } finally {
      setSavingRoleId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user? Linked pharmacy rows may be removed (CASCADE).')) return;

    try {
      const response = await fetch(`${API}/auth/admin/users/${userId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout active="users">
        <div className="flex justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout active="users">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-600 mt-1">
            Add users with a role, change roles (e.g. make admin), or remove access. IPNS admin uses profile role, not
            Django superuser.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4" />
          Add user
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleAddUser}
          className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          <h3 className="text-lg font-bold text-slate-900">New user</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
            />
            <input
              type="password"
              placeholder="Password (min 8)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
              className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900"
            >
              <option value="pharmacist">Pharmacist</option>
              <option value="admin">Admin</option>
              <option value="patient">Patient</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold">
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search users…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Email</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Role</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Change role</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Pharmacy</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Joined</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 text-slate-900 font-medium">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {u.role || 'pharmacist'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={displayRole(u)}
                        disabled={u.id === user?.id}
                        onChange={(e) =>
                          setRoleEdits((prev) => ({ ...prev, [u.id]: e.target.value }))
                        }
                        title={u.id === user?.id ? 'You cannot change your own role here (stay admin)' : ''}
                        className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-900 disabled:opacity-60"
                      >
                        <option value="pharmacist">Pharmacist</option>
                        <option value="admin">Admin</option>
                        <option value="patient">Patient</option>
                      </select>
                      <button
                        type="button"
                        disabled={
                          savingRoleId === u.id ||
                          displayRole(u) === (u.role || 'pharmacist') ||
                          u.id === user?.id
                        }
                        onClick={() => handleSaveRole(u)}
                        className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 disabled:opacity-40"
                      >
                        {savingRoleId === u.id ? 'Saving…' : 'Apply'}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">
                    {u.pharmacy ? u.pharmacy.name : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">
                    {u.date_joined ? new Date(u.date_joined).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(u.id)}
                      className="inline-flex rounded-lg p-2 text-red-600 hover:bg-red-50"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
