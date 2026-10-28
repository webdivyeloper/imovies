import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Ticket, User, ShieldAlert, Sparkles, Coins, LogOut, Search } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky-top glass-panel shadow-sm">
      {/* Top Banner matching user screenshot styling */}
      <div className="bg-dark border-bottom border-secondary border-opacity-25 py-1 px-3 px-md-4 small text-secondary d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2 overflow-hidden text-truncate">
          <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50">MERN Project</span>
          <span className="d-none d-sm-inline">Dashboard &gt; Program &gt; Full Stack &gt;</span>
          <span className="text-light fw-medium">IMovies - Movie ticket booking made simple.</span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-1 text-info fw-medium">
            <Sparkles size={14} />
            <span>0 AI Token</span>
          </div>
          <div className="d-flex align-items-center gap-1 text-warning fw-medium">
            <Coins size={14} />
            <span>{user ? user.credits || 300 : 300} Credits</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark py-2 px-3 px-md-4">
        <div className="container-fluid px-0">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center shadow">
              <Film size={22} className="text-white" />
            </div>
            <div>
              <span className="brand-font fs-4 fw-bold text-white tracking-wide">
                IMOVIES<span className="text-primary">.</span>
              </span>
              <span className="d-block text-secondary" style={{ fontSize: '0.68rem', marginTop: '-4px' }}>
                Cinema Experience Redefined
              </span>
            </div>
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-1">
              <li className="nav-item">
                <Link
                  to="/"
                  className={`nav-link px-3 py-2 rounded-2 fw-medium ${location.pathname === '/' ? 'active text-primary fw-bold' : 'text-light'}`}
                >
                  Explore Movies
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/#cinemas"
                  className="nav-link px-3 py-2 rounded-2 text-light fw-medium"
                >
                  Cinemas &amp; Screens
                </Link>
              </li>
              {isAuthenticated && (
                <li className="nav-item">
                  <Link
                    to="/my-bookings"
                    className={`nav-link px-3 py-2 rounded-2 fw-medium d-flex align-items-center gap-1 ${
                      location.pathname === '/my-bookings' ? 'active text-primary fw-bold' : 'text-light'
                    }`}
                  >
                    <Ticket size={16} />
                    <span>My Bookings</span>
                  </Link>
                </li>
              )}
              {isAdmin && (
                <li className="nav-item">
                  <Link
                    to="/admin"
                    className={`nav-link px-3 py-2 rounded-2 fw-medium d-flex align-items-center gap-1 text-warning ${
                      location.pathname === '/admin' ? 'active fw-bold' : ''
                    }`}
                  >
                    <ShieldAlert size={16} />
                    <span>Admin Panel</span>
                  </Link>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              {isAuthenticated ? (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary border-opacity-50 text-light d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt="Avatar"
                      className="rounded-circle"
                      style={{ width: '26px', height: '26px', objectFit: 'cover' }}
                    />
                    <span className="fw-semibold small">{user?.name?.split(' ')[0]}</span>
                    {isAdmin && <span className="badge bg-danger ms-1" style={{ fontSize: '0.65rem' }}>ADMIN</span>}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end bg-dark border-secondary shadow-lg">
                    <li className="px-3 py-2 border-bottom border-secondary border-opacity-50">
                      <p className="mb-0 fw-bold text-light">{user?.name}</p>
                      <small className="text-secondary">{user?.email}</small>
                    </li>
                    <li>
                      <Link to="/my-bookings" className="dropdown-item text-light d-flex align-items-center gap-2 py-2">
                        <Ticket size={16} className="text-primary" />
                        <span>My Tickets</span>
                      </Link>
                    </li>
                    {isAdmin && (
                      <li>
                        <Link to="/admin" className="dropdown-item text-warning d-flex align-items-center gap-2 py-2">
                          <ShieldAlert size={16} />
                          <span>Admin Dashboard</span>
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider border-secondary border-opacity-50" /></li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item text-danger d-flex align-items-center gap-2 py-2"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="btn btn-outline-light btn-sm px-3 py-1.5 rounded-pill fw-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('register')}
                    className="btn btn-cinema-primary btn-sm px-3 py-1.5 rounded-pill fw-medium shadow-sm"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

