import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, Phone, Sparkles, ShieldAlert } from 'lucide-react';

const AuthModal = () => {
  const { isAuthModalOpen, authModalTab, closeAuthModal, login, register, quickLogin } = useAuth();
  const [tab, setTab] = useState(authModalTab || 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, phone);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      await quickLogin(role);
    } catch (err) {
      setError('Quick login failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
        <div className="modal-content glass-panel border-secondary border-opacity-50 text-light shadow-2xl rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header border-secondary border-opacity-25 pb-2">
            <h5 className="modal-title fw-bold text-white brand-font">
              {tab === 'login' ? 'Sign In to IMovies' : 'Create an Account'}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={closeAuthModal}
            />
          </div>

          <div className="modal-body p-4">
            {/* Quick Demo Login Presets */}
            <div className="p-3 mb-4 rounded-3 bg-dark border border-secondary border-opacity-50">
              <span className="text-secondary small fw-bold d-block mb-2 text-uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>
                🚀 1-Click Instant Demo Login:
              </span>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickLogin('user')}
                  className="btn btn-sm btn-outline-info flex-grow-1 d-flex align-items-center justify-content-center gap-1.5 py-1.5"
                >
                  <Sparkles size={14} />
                  <span>Demo User</span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleQuickLogin('admin')}
                  className="btn btn-sm btn-outline-warning flex-grow-1 d-flex align-items-center justify-content-center gap-1.5 py-1.5"
                >
                  <ShieldAlert size={14} />
                  <span>Demo Admin</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="d-flex border-bottom border-secondary border-opacity-25 mb-4">
              <button
                type="button"
                onClick={() => { setTab('login'); setError(''); }}
                className={`btn btn-link text-decoration-none flex-grow-1 pb-2 rounded-0 fw-semibold ${
                  tab === 'login' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setTab('register'); setError(''); }}
                className={`btn btn-link text-decoration-none flex-grow-1 pb-2 rounded-0 fw-semibold ${
                  tab === 'register' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'
                }`}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small border-0 mb-3" role="alert">
                {error}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit}>
              {tab === 'register' && (
                <>
                  <div className="mb-3">
                    <label className="form-label small text-secondary">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary border-opacity-50 text-secondary">
                        <UserIcon size={16} />
                      </span>
                      <input
                        type="text"
                        required
                        className="form-control bg-dark border-secondary border-opacity-50 text-light"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-secondary">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary border-opacity-50 text-secondary">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        className="form-control bg-dark border-secondary border-opacity-50 text-light"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label small text-secondary">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-50 text-secondary">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    required
                    className="form-control bg-dark border-secondary border-opacity-50 text-light"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small text-secondary">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary border-opacity-50 text-secondary">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="form-control bg-dark border-secondary border-opacity-50 text-light"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {tab === 'register' && (
                  <small className="text-secondary" style={{ fontSize: '0.7rem' }}>
                    Password must be at least 6 characters long
                  </small>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-cinema-primary w-100 py-2.5 fw-semibold shadow"
              >
                {loading ? 'Please wait...' : tab === 'login' ? 'Sign In to Account' : 'Create Free Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

