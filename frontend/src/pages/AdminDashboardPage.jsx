import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { moviesAPI, cinemasAPI, showtimesAPI, bookingsAPI } from '../services/api';
import {
  ShieldAlert,
  Film,
  Calendar,
  Ticket,
  DollarSign,
  Plus,
  Trash2,
  Users,
  CheckCircle2,
  Clock,
  MapPin
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('movies'); // 'movies' | 'showtimes' | 'bookings'
  const [metrics, setMetrics] = useState({ totalRevenue: 0, totalTicketsSold: 0, totalBookings: 0 });
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Movie Form Modal State
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    tagline: '',
    description: '',
    posterUrl: '',
    backdropUrl: '',
    genre: 'Action, Sci-Fi',
    duration: 120,
    rating: 8.0,
    censorRating: 'PG-13',
    releaseDate: new Date().toISOString().split('T')[0],
    director: '',
    status: 'now_showing'
  });

  // New Showtime Form Modal State
  const [showShowtimeModal, setShowShowtimeModal] = useState(false);
  const [newShowtime, setNewShowtime] = useState({
    movie: '',
    cinema: '',
    screenName: 'Screen 1 (Dolby Atmos)',
    screenType: 'Dolby Atmos',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '07:00 PM',
    priceVIP: 22,
    pricePremium: 16,
    priceStandard: 12
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mRes, cRes, stRes, bRes] = await Promise.all([
        moviesAPI.getAll(),
        cinemasAPI.getAll(),
        showtimesAPI.getAll(),
        bookingsAPI.getAll()
      ]);

      if (mRes.data.success) setMovies(mRes.data.data);
      if (cRes.data.success) {
        setCinemas(cRes.data.data);
        if (cRes.data.data.length > 0 && !newShowtime.cinema) {
          setNewShowtime((prev) => ({ ...prev, cinema: cRes.data.data[0]._id }));
        }
      }
      if (stRes.data.success) setShowtimes(stRes.data.data);
      if (bRes.data.success) {
        setBookings(bRes.data.data);
        if (bRes.data.metrics) setMetrics(bRes.data.metrics);
      }
      if (mRes.data.data.length > 0 && !newShowtime.movie) {
        setNewShowtime((prev) => ({ ...prev, movie: mRes.data.data[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card p-5 max-w-md mx-auto" style={{ maxWidth: '480px' }}>
          <ShieldAlert size={48} className="text-danger mb-3" />
          <h4 className="fw-bold text-white brand-font mb-2">Admin Access Required</h4>
          <p className="text-secondary small mb-4">
            You must be logged in as an administrator to manage movies, showtimes, and view financial metrics.
          </p>
        </div>
      </div>
    );
  }

  // Handle Add Movie
  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newMovie,
        duration: Number(newMovie.duration),
        rating: Number(newMovie.rating),
        genre: newMovie.genre.split(',').map((g) => g.trim()),
        languages: ['English']
      };
      const res = await moviesAPI.create(payload);
      if (res.data.success) {
        setShowMovieModal(false);
        setNewMovie({
          title: '',
          tagline: '',
          description: '',
          posterUrl: '',
          backdropUrl: '',
          genre: 'Action, Sci-Fi',
          duration: 120,
          rating: 8.0,
          censorRating: 'PG-13',
          releaseDate: new Date().toISOString().split('T')[0],
          director: '',
          status: 'now_showing'
        });
        await fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add movie');
    }
  };

  // Handle Delete Movie
  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie and its scheduled showtimes?')) {
      return;
    }
    try {
      await moviesAPI.delete(movieId);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete movie');
    }
  };

  // Handle Add Showtime
  const handleAddShowtime = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        movie: newShowtime.movie,
        cinema: newShowtime.cinema,
        screenName: newShowtime.screenName,
        screenType: newShowtime.screenType,
        showDate: newShowtime.showDate,
        showTime: newShowtime.showTime,
        prices: {
          VIP: Number(newShowtime.priceVIP),
          Premium: Number(newShowtime.pricePremium),
          Standard: Number(newShowtime.priceStandard)
        }
      };
      const res = await showtimesAPI.create(payload);
      if (res.data.success) {
        setShowShowtimeModal(false);
        await fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule showtime');
    }
  };

  // Handle Delete Showtime
  const handleDeleteShowtime = async (stId) => {
    if (!window.confirm('Delete this showtime slot?')) return;
    try {
      await showtimesAPI.delete(stId);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete showtime');
    }
  };

  return (
    <div className="container py-4">
      {/* Top Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-danger px-2.5 py-1">ADMINISTRATOR CONTROL PANEL</span>
          </div>
          <h2 className="fw-bold text-white brand-font mb-0">IMovies Platform Administration</h2>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={() => setShowMovieModal(true)}
            className="btn btn-cinema-primary btn-sm d-flex align-items-center gap-1.5 px-3 py-2 shadow-sm"
          >
            <Plus size={16} />
            <span>Add Movie</span>
          </button>
          <button
            onClick={() => setShowShowtimeModal(true)}
            className="btn btn-outline-info btn-sm d-flex align-items-center gap-1.5 px-3 py-2"
          >
            <Plus size={16} />
            <span>Schedule Showtime</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <div className="glass-card p-3">
            <span className="text-secondary small d-flex align-items-center gap-1.5 mb-1">
              <DollarSign size={16} className="text-success" />
              <span>Gross Box Office</span>
            </span>
            <h3 className="fw-extrabold text-white mb-0 brand-font">
              ${metrics.totalRevenue?.toFixed(2) || '0.00'}
            </h3>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-card p-3">
            <span className="text-secondary small d-flex align-items-center gap-1.5 mb-1">
              <Ticket size={16} className="text-primary" />
              <span>Tickets Sold</span>
            </span>
            <h3 className="fw-extrabold text-white mb-0 brand-font">
              {metrics.totalTicketsSold || 0}
            </h3>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-card p-3">
            <span className="text-secondary small d-flex align-items-center gap-1.5 mb-1">
              <Film size={16} className="text-warning" />
              <span>Active Movies</span>
            </span>
            <h3 className="fw-extrabold text-white mb-0 brand-font">
              {movies.length}
            </h3>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="glass-card p-3">
            <span className="text-secondary small d-flex align-items-center gap-1.5 mb-1">
              <Calendar size={16} className="text-info" />
              <span>Scheduled Shows</span>
            </span>
            <h3 className="fw-extrabold text-white mb-0 brand-font">
              {showtimes.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex border-bottom border-secondary border-opacity-25 mb-4">
        <button
          onClick={() => setActiveTab('movies')}
          className={`btn btn-link text-decoration-none px-4 py-2.5 rounded-0 fw-semibold ${
            activeTab === 'movies' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'
          }`}
        >
          🎬 Movies Catalog ({movies.length})
        </button>
        <button
          onClick={() => setActiveTab('showtimes')}
          className={`btn btn-link text-decoration-none px-4 py-2.5 rounded-0 fw-semibold ${
            activeTab === 'showtimes' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'
          }`}
        >
          🎟️ Showtime Slots ({showtimes.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`btn btn-link text-decoration-none px-4 py-2.5 rounded-0 fw-semibold ${
            activeTab === 'bookings' ? 'text-primary border-bottom border-primary border-2' : 'text-secondary'
          }`}
        >
          👥 Customer Bookings ({bookings.length})
        </button>
      </div>

      {/* Tab 1: Movies */}
      {activeTab === 'movies' && (
        <div className="glass-card p-3 p-md-4">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small text-uppercase">
                  <th>Poster</th>
                  <th>Title &amp; Director</th>
                  <th>Genre</th>
                  <th>Duration</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m._id}>
                    <td style={{ width: '60px' }}>
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="rounded-2 shadow"
                        style={{ width: '45px', height: '65px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>
                      <strong className="text-light d-block">{m.title}</strong>
                      <span className="text-secondary small">Dir: {m.director || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="small text-light">
                        {Array.isArray(m.genre) ? m.genre.join(', ') : m.genre}
                      </span>
                    </td>
                    <td className="small text-secondary">{m.duration} mins</td>
                    <td>
                      <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50">
                        ⭐ {m.rating}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${m.status === 'now_showing' ? 'bg-success' : 'bg-info text-dark'}`}>
                        {m.status === 'now_showing' ? 'Now Showing' : 'Upcoming'}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleDeleteMovie(m._id)}
                        className="btn btn-outline-danger btn-sm p-1.5"
                        title="Delete Movie"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Showtimes */}
      {activeTab === 'showtimes' && (
        <div className="glass-card p-3 p-md-4">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small text-uppercase">
                  <th>Movie</th>
                  <th>Cinema Theater</th>
                  <th>Auditorium</th>
                  <th>Date &amp; Time</th>
                  <th>Reserved Seats</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {showtimes.map((st) => (
                  <tr key={st._id}>
                    <td>
                      <strong className="text-light">{st.movie?.title || 'Unknown Movie'}</strong>
                    </td>
                    <td>
                      <span className="text-secondary small">{st.cinema?.name || 'Cinema'}</span>
                    </td>
                    <td>
                      <span className="badge bg-primary bg-opacity-25 text-primary small">
                        {st.screenName || 'Screen 1'}
                      </span>
                    </td>
                    <td className="font-monospace small text-light">
                      {st.showDate} • <strong>{st.showTime}</strong>
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {st.bookedSeats?.length || 0} booked
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        onClick={() => handleDeleteShowtime(st._id)}
                        className="btn btn-outline-danger btn-sm p-1.5"
                        title="Delete Showtime"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Customer Bookings */}
      {activeTab === 'bookings' && (
        <div className="glass-card p-3 p-md-4">
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead>
                <tr className="text-secondary small text-uppercase">
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Movie &amp; Cinema</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Booking Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <span className="font-monospace text-primary fw-bold small">{b.bookingReference}</span>
                    </td>
                    <td>
                      <strong className="text-light d-block small">{b.user?.name || 'Customer'}</strong>
                      <span className="text-secondary" style={{ fontSize: '0.72rem' }}>{b.user?.email}</span>
                    </td>
                    <td>
                      <span className="text-light d-block small fw-semibold">{b.movie?.title}</span>
                      <span className="text-secondary" style={{ fontSize: '0.72rem' }}>{b.cinema?.name}</span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {b.seats?.map((s, idx) => (
                          <span key={idx} className="badge bg-dark border border-secondary small">
                            {typeof s === 'string' ? s : s.seatNumber}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <strong className="text-success small">${b.totalAmount?.toFixed(2)}</strong>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          b.status === 'confirmed' ? 'bg-success bg-opacity-25 text-success' : 'bg-danger bg-opacity-25 text-danger'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="text-secondary small">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Movie Modal */}
      {showMovieModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1070 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content glass-panel border-secondary text-light">
              <div className="modal-header border-secondary py-2">
                <h5 className="modal-title fw-bold text-white brand-font">Add New Blockbuster Movie</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowMovieModal(false)}
                />
              </div>
              <form onSubmit={handleAddMovie}>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label small text-secondary">Movie Title *</label>
                    <input
                      type="text"
                      required
                      className="form-control bg-dark border-secondary border-opacity-50 text-light"
                      value={newMovie.title}
                      onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                      placeholder="e.g. Inception"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small text-secondary">Director</label>
                    <input
                      type="text"
                      className="form-control bg-dark border-secondary border-opacity-50 text-light"
                      value={newMovie.director}
                      onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                      placeholder="e.g. Christopher Nolan"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small text-secondary">Tagline</label>
                    <input
                      type="text"
                      className="form-control bg-dark border-secondary border-opacity-50 text-light"
                      value={newMovie.tagline}
                      onChange={(e) => setNewMovie({ ...newMovie, tagline: e.target.value })}
                      placeholder="e.g. Your mind is the scene of the crime."
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small text-secondary">Description / Synopsis *</label>
                    <textarea
                      rows={3}
                      required
                      className="form-control bg-dark border-secondary border-opacity-50 text-light"
                      value={newMovie.description}
                      onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small text-secondary">Poster URL *</label>
                    <input
                      type="url"
                      required
                      className="form-control bg-dark border-secondary border-opacity-50 text-light"
                      value={newMovie.posterUrl}
                      onChange={(e) => setNewMovie({ ...newMovie, posterUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small text-secondary">Backdrop URL *</label>
                    <input
                      type="url"
                      required
                      className="form-control bg-dark border-secondary border-opacity-50 text-light"
                      value={newMovie.backdropUrl}
                      onChange={(e) => setNewMovie({ ...newMovie, backdropUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small text-secondary">Duration (mins)</label>
                    <input
                      type="number"
                      required
                      className="form-control bg-dark border-secondary border-opacity-50 text-light"
                      value={newMovie.duration}
                      onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small text-secondary">Rating (1 - 10)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control bg-dark border-secondary border-opacity-50 text-light"
                      value={newMovie.rating}
                      onChange={(e) => setNewMovie({ ...newMovie, rating: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small text-secondary">Status</label>
                    <select
                      className="form-select bg-dark border-secondary border-opacity-50 text-light"
                      value={newMovie.status}
                      onChange={(e) => setNewMovie({ ...newMovie, status: e.target.value })}
                    >
                      <option value="now_showing">Now Showing</option>
                      <option value="upcoming">Upcoming</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small text-secondary">Genres (comma separated)</label>
                    <input
                      type="text"
                      className="form-control bg-dark border-secondary border-opacity-50 text-light"
                      value={newMovie.genre}
                      onChange={(e) => setNewMovie({ ...newMovie, genre: e.target.value })}
                      placeholder="Action, Sci-Fi, Drama"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small text-secondary">Censor Rating</label>
                    <select
                      className="form-select bg-dark border-secondary border-opacity-50 text-light"
                      value={newMovie.censorRating}
                      onChange={(e) => setNewMovie({ ...newMovie, censorRating: e.target.value })}
                    >
                      <option value="PG-13">PG-13</option>
                      <option value="R">R</option>
                      <option value="PG">PG</option>
                      <option value="UA">UA</option>
                      <option value="A">A</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowMovieModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-cinema-primary px-4">
                    Save Movie
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Showtime Modal */}
      {showShowtimeModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1070 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-panel border-secondary text-light">
              <div className="modal-header border-secondary py-2">
                <h5 className="modal-title fw-bold text-white brand-font">Schedule New Showtime</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowShowtimeModal(false)}
                />
              </div>
              <form onSubmit={handleAddShowtime}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label small text-secondary">Select Movie *</label>
                    <select
                      required
                      className="form-select bg-dark border-secondary border-opacity-50 text-light"
                      value={newShowtime.movie}
                      onChange={(e) => setNewShowtime({ ...newShowtime, movie: e.target.value })}
                    >
                      {movies.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label small text-secondary">Select Cinema *</label>
                    <select
                      required
                      className="form-select bg-dark border-secondary border-opacity-50 text-light"
                      value={newShowtime.cinema}
                      onChange={(e) => setNewShowtime({ ...newShowtime, cinema: e.target.value })}
                    >
                      {cinemas.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small text-secondary">Show Date *</label>
                      <input
                        type="date"
                        required
                        className="form-control bg-dark border-secondary border-opacity-50 text-light"
                        value={newShowtime.showDate}
                        onChange={(e) => setNewShowtime({ ...newShowtime, showDate: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-secondary">Show Time *</label>
                      <select
                        className="form-select bg-dark border-secondary border-opacity-50 text-light"
                        value={newShowtime.showTime}
                        onChange={(e) => setNewShowtime({ ...newShowtime, showTime: e.target.value })}
                      >
                        <option value="10:30 AM">10:30 AM</option>
                        <option value="01:45 PM">01:45 PM</option>
                        <option value="05:15 PM">05:15 PM</option>
                        <option value="08:30 PM">08:30 PM</option>
                        <option value="11:00 PM">11:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-4">
                      <label className="form-label small text-secondary">VIP ($)</label>
                      <input
                        type="number"
                        className="form-control bg-dark border-secondary border-opacity-50 text-light"
                        value={newShowtime.priceVIP}
                        onChange={(e) => setNewShowtime({ ...newShowtime, priceVIP: e.target.value })}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small text-secondary">Premium ($)</label>
                      <input
                        type="number"
                        className="form-control bg-dark border-secondary border-opacity-50 text-light"
                        value={newShowtime.pricePremium}
                        onChange={(e) => setNewShowtime({ ...newShowtime, pricePremium: e.target.value })}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small text-secondary">Standard ($)</label>
                      <input
                        type="number"
                        className="form-control bg-dark border-secondary border-opacity-50 text-light"
                        value={newShowtime.priceStandard}
                        onChange={(e) => setNewShowtime({ ...newShowtime, priceStandard: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowShowtimeModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-cinema-primary px-4">
                    Create Showtime
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;

