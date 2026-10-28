import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { moviesAPI } from '../services/api';
import { useBooking } from '../context/BookingContext';
import { Star, Clock, Calendar, Play, MapPin, Film, ShieldCheck, ChevronLeft } from 'lucide-react';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedMovie, setSelectedShowtime, setSelectedCinema } = useBooking();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [trailerModal, setTrailerModal] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const res = await moviesAPI.getById(id);
        if (res.data.success) {
          setMovie(res.data.data.movie);
          const stList = res.data.data.showtimes || [];
          setShowtimes(stList);

          // Default selected date to first available date or today
          if (stList.length > 0) {
            setSelectedDate(stList[0].showDate);
          } else {
            setSelectedDate(new Date().toISOString().split('T')[0]);
          }
        }
      } catch (err) {
        setError('Failed to load movie information.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary my-5" role="status">
          <span className="visually-hidden">Loading movie...</span>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger">{error || 'Movie not found'}</h4>
        <Link to="/" className="btn btn-outline-light mt-3">Back to Movies</Link>
      </div>
    );
  }

  // Get unique show dates
  const uniqueDates = Array.from(new Set(showtimes.map((s) => s.showDate))).sort();

  // Filter showtimes for chosen date
  const filteredShowtimes = showtimes.filter((s) => s.showDate === selectedDate);

  // Group showtimes by cinema
  const showtimesByCinema = {};
  filteredShowtimes.forEach((st) => {
    const cinemaId = st.cinema?._id || 'unknown';
    if (!showtimesByCinema[cinemaId]) {
      showtimesByCinema[cinemaId] = {
        cinema: st.cinema,
        slots: []
      };
    }
    showtimesByCinema[cinemaId].slots.push(st);
  });

  const handleSelectShowtime = (st) => {
    setSelectedMovie(movie);
    setSelectedShowtime(st);
    setSelectedCinema(st.cinema);
    navigate(`/booking/${st._id}`);
  };

  return (
    <div className="pb-5">
      {/* Back button */}
      <div className="container pt-3">
        <button
          onClick={() => navigate('/')}
          className="btn btn-sm btn-dark text-secondary d-inline-flex align-items-center gap-1.5 border border-secondary border-opacity-50 rounded-pill px-3 py-1 mb-3"
        >
          <ChevronLeft size={16} />
          <span>Back to Movies</span>
        </button>
      </div>

      {/* Hero Header with Backdrop */}
      <div className="position-relative overflow-hidden mb-5" style={{ minHeight: '440px' }}>
        <div
          className="hero-backdrop"
          style={{ backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})`, filter: 'brightness(0.28)' }}
        />
        <div className="hero-gradient" />

        <div className="position-relative container py-4">
          <div className="row g-4 align-items-end">
            {/* Poster */}
            <div className="col-md-4 col-lg-3">
              <div className="movie-poster-wrapper shadow-2xl border border-secondary border-opacity-50">
                <img src={movie.posterUrl} alt={movie.title} />
              </div>
            </div>

            {/* Movie Info */}
            <div className="col-md-8 col-lg-9">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge bg-danger px-2.5 py-1 fw-bold">
                  {movie.status === 'now_showing' ? 'NOW SHOWING' : 'UPCOMING RELEASE'}
                </span>
                <span className="badge bg-dark border border-secondary text-light">
                  {movie.censorRating || 'UA'}
                </span>
                <div className="d-flex align-items-center gap-1 text-warning bg-black bg-opacity-60 px-2.5 py-1 rounded-pill small border border-warning border-opacity-25">
                  <Star size={14} fill="#f59e0b" />
                  <span className="fw-bold">{movie.rating?.toFixed(1) || '8.5'}</span>
                  <span className="text-secondary" style={{ fontSize: '0.7rem' }}>/ 10</span>
                </div>
              </div>

              <h1 className="display-4 fw-extrabold text-white brand-font mb-1">{movie.title}</h1>
              {movie.tagline && <p className="lead text-primary fw-medium mb-3">&ldquo;{movie.tagline}&rdquo;</p>}

              <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small mb-3">
                <span className="d-flex align-items-center gap-1.5 text-light">
                  <Clock size={15} className="text-primary" />
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
                <span>•</span>
                <span className="text-light">
                  {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
                </span>
                <span>•</span>
                <span className="text-light">
                  Languages: {movie.languages?.join(', ') || 'English'}
                </span>
                <span>•</span>
                <span className="d-flex align-items-center gap-1.5 text-light">
                  <Calendar size={15} className="text-primary" />
                  Released: {new Date(movie.releaseDate).toLocaleDateString()}
                </span>
              </div>

              <p className="text-light text-opacity-80 small mb-4" style={{ maxWidth: '820px', lineHeight: '1.7' }}>
                {movie.description}
              </p>

              {movie.trailerUrl && (
                <button
                  onClick={() => setTrailerModal(true)}
                  className="btn btn-outline-light d-inline-flex align-items-center gap-2 px-3 py-2 rounded-2"
                >
                  <Play size={16} fill="white" />
                  <span>Watch Official Trailer</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row g-4">
          {/* Main Showtime Booking Schedule */}
          <div className="col-lg-8">
            <div className="glass-card p-4 mb-4">
              <h4 className="fw-bold text-white brand-font mb-3 d-flex align-items-center gap-2">
                <Film size={22} className="text-primary" />
                <span>Select Showtime &amp; Theater</span>
              </h4>

              {/* Date Selector Pills */}
              <div className="d-flex gap-2 overflow-x-auto pb-2 mb-4">
                {uniqueDates.length > 0 ? (
                  uniqueDates.map((dateStr) => {
                    const dateObj = new Date(dateStr + 'T00:00:00');
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNum = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                    const isSelected = selectedDate === dateStr;

                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`btn text-center p-2.5 rounded-3 border transition-all ${
                          isSelected
                            ? 'btn-primary border-primary shadow'
                            : 'btn-dark border-secondary border-opacity-50 text-light'
                        }`}
                        style={{ minWidth: '90px' }}
                      >
                        <span className="d-block small text-uppercase" style={{ fontSize: '0.72rem', opacity: isSelected ? 1 : 0.7 }}>
                          {dayName}
                        </span>
                        <strong className="d-block fs-6">{dayNum}</strong>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-secondary small">No scheduled dates available currently.</div>
                )}
              </div>

              {/* Showtimes Grouped By Cinema */}
              {Object.keys(showtimesByCinema).length === 0 ? (
                <div className="text-center py-5 border border-secondary border-opacity-25 rounded-3">
                  <p className="text-secondary mb-0">No showtimes found for the selected date.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  {Object.values(showtimesByCinema).map(({ cinema, slots }) => (
                    <div
                      key={cinema?._id || Math.random()}
                      className="p-3.5 rounded-3 bg-dark border border-secondary border-opacity-40"
                    >
                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                        <div>
                          <h6 className="text-white fw-bold mb-0">{cinema?.name || 'IMovies Cinema'}</h6>
                          <span className="text-secondary small d-flex align-items-center gap-1 mt-0.5">
                            <MapPin size={12} className="text-danger" />
                            {cinema?.address}
                          </span>
                        </div>
                        <div className="d-flex gap-1.5">
                          {cinema?.amenities?.slice(0, 2).map((a, i) => (
                            <span key={i} className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-50" style={{ fontSize: '0.68rem' }}>
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div className="d-flex flex-wrap gap-2.5">
                        {slots.map((st) => (
                          <button
                            key={st._id}
                            onClick={() => handleSelectShowtime(st)}
                            className="btn btn-outline-primary border-opacity-75 py-2 px-3.5 rounded-2 d-flex flex-column align-items-center"
                            style={{ minWidth: '105px' }}
                          >
                            <span className="fw-bold text-light fs-6">{st.showTime}</span>
                            <span className="text-primary small" style={{ fontSize: '0.7rem' }}>
                              {st.screenType || 'Dolby Atmos'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Cast & Movie Details */}
          <div className="col-lg-4">
            {/* Cast & Director */}
            <div className="glass-card p-4 mb-4">
              <h5 className="fw-bold text-white brand-font mb-3">Cast &amp; Crew</h5>
              {movie.director && (
                <div className="mb-3 pb-3 border-bottom border-secondary border-opacity-25">
                  <span className="text-secondary small d-block">Directed By:</span>
                  <span className="text-light fw-semibold">{movie.director}</span>
                </div>
              )}

              <span className="text-secondary small d-block mb-2">Starring Cast:</span>
              <div className="d-flex flex-column gap-2.5">
                {movie.cast && movie.cast.length > 0 ? (
                  movie.cast.map((c, i) => (
                    <div key={i} className="d-flex align-items-center gap-2.5">
                      <img
                        src={c.image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'}
                        alt={c.name}
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                      <div>
                        <h6 className="text-light fw-semibold mb-0 small">{c.name}</h6>
                        <span className="text-secondary" style={{ fontSize: '0.72rem' }}>{c.role}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-secondary small">Cast info available soon.</span>
                )}
              </div>
            </div>

            {/* Cinema Assurance Guarantee */}
            <div className="glass-card p-4">
              <h6 className="fw-bold text-white mb-2 d-flex align-items-center gap-1.5">
                <ShieldCheck size={18} className="text-success" />
                <span>IMovies Ticket Assurance</span>
              </h6>
              <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-0">
                <li>• 100% Genuine Tickets guaranteed</li>
                <li>• Instant digital pass with gate QR code</li>
                <li>• Instant refund upon cancellation</li>
                <li>• Contactless gate scanning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {trailerModal && movie.trailerUrl && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1070 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark border-secondary">
              <div className="modal-header border-secondary py-2">
                <h6 className="modal-title text-light fw-bold">{movie.title} - Official Trailer</h6>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setTrailerModal(false)}
                />
              </div>
              <div className="modal-body p-0 ratio ratio-16x9">
                <iframe
                  src={`${movie.trailerUrl}?autoplay=1`}
                  title="Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;

