import React, { useState, useEffect } from 'react';
import { moviesAPI, cinemasAPI } from '../services/api';
import HeroBanner from '../components/HeroBanner';
import MovieCard from '../components/MovieCard';
import { Search, Film, MapPin, Sparkles, CheckCircle2, Layers, Award, Clock } from 'lucide-react';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Comedy', 'Animation', 'Biography'];

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [activeTab, setActiveTab] = useState('now_showing'); // 'now_showing' | 'upcoming'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesRes, cinemasRes] = await Promise.all([
          moviesAPI.getAll(),
          cinemasAPI.getAll()
        ]);
        if (moviesRes.data.success) {
          setMovies(moviesRes.data.data);
        }
        if (cinemasRes.data.success) {
          setCinemas(cinemasRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching initial movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter movies
  const filteredMovies = movies.filter((movie) => {
    const matchesTab = movie.status === activeTab;
    const matchesGenre =
      selectedGenre === 'All' ||
      (Array.isArray(movie.genre) && movie.genre.some((g) => g.toLowerCase() === selectedGenre.toLowerCase()));
    const matchesSearch =
      searchQuery.trim() === '' ||
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(movie.cast) && movie.cast.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesTab && matchesGenre && matchesSearch;
  });

  return (
    <div className="pb-5">
      <div className="container pt-3">
        {/* Hero Banner with Featured Movies */}
        <HeroBanner movies={movies.filter((m) => m.isFeatured || m.status === 'now_showing')} />

        {/* Project Documentation Banner matching User Screenshot requirement */}
        <div className="p-4 rounded-4 mb-5 border border-primary border-opacity-30 position-relative overflow-hidden shadow-lg"
             style={{ background: 'linear-gradient(135deg, rgba(29, 78, 216, 0.15) 0%, rgba(15, 23, 42, 0.7) 100%)' }}>
          <div className="row align-items-center g-3">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-primary px-2.5 py-1 fw-bold">Entertainment</span>
                <span className="badge bg-secondary px-2.5 py-1">Individual Project</span>
                <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50">
                  Status: Ready &amp; Running
                </span>
              </div>
              <h4 className="fw-bold text-white mb-2 brand-font">
                IMovies - Movie ticket booking made simple.
              </h4>
              <p className="text-light text-opacity-80 small mb-3 leading-relaxed">
                A seamless online platform that enhances the cinema experience by allowing users to browse movies, select showtimes, and reserve seats with real-time availability tracking. Built with <strong>Express.js</strong> and <strong>MongoDB</strong>, it leverages a robust client-server architecture with <strong>React.js</strong> and <strong>Bootstrap</strong> for ticket reservation and management.
              </p>
              <div className="d-flex flex-wrap gap-2 small">
                <span className="badge bg-dark border border-secondary text-light">Node.js (v24)</span>
                <span className="badge bg-dark border border-secondary text-light">Express RESTful API</span>
                <span className="badge bg-dark border border-secondary text-light">MongoDB &amp; Mongoose</span>
                <span className="badge bg-dark border border-secondary text-light">React 18 + Vite</span>
                <span className="badge bg-dark border border-secondary text-light">JWT Authentication</span>
                <span className="badge bg-dark border border-secondary text-light">Bootstrap 5 UI</span>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end">
              <div className="p-3 rounded-3 bg-black bg-opacity-40 border border-secondary border-opacity-25 d-inline-block text-start w-100" style={{ maxWidth: '300px' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary small">Total Epics:</span>
                  <span className="badge bg-primary">6 Epics</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary small">Total Tasks:</span>
                  <span className="badge bg-success">19 Verified</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary small">Progress:</span>
                  <span className="text-info fw-bold small">100% Implemented</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card p-3 p-md-4 mb-4">
          <div className="row g-3 align-items-center">
            {/* Status Tabs */}
            <div className="col-lg-4 col-md-5">
              <div className="btn-group w-100 p-1 bg-dark rounded-pill border border-secondary border-opacity-50" role="group">
                <button
                  type="button"
                  onClick={() => setActiveTab('now_showing')}
                  className={`btn btn-sm rounded-pill py-2 fw-semibold ${
                    activeTab === 'now_showing' ? 'btn-primary shadow' : 'btn-dark text-secondary'
                  }`}
                >
                  🎬 Now Showing ({movies.filter((m) => m.status === 'now_showing').length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upcoming')}
                  className={`btn btn-sm rounded-pill py-2 fw-semibold ${
                    activeTab === 'upcoming' ? 'btn-primary shadow' : 'btn-dark text-secondary'
                  }`}
                >
                  ✨ Coming Soon ({movies.filter((m) => m.status === 'upcoming').length})
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="col-lg-8 col-md-7">
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary border-opacity-50 text-secondary">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary border-opacity-50 text-light py-2"
                  placeholder="Search movies by title, director, or starring actors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="btn btn-dark border-secondary border-opacity-50 text-secondary"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Genre Filter Pills */}
          <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25 align-items-center">
            <span className="text-secondary small me-2 fw-medium">Genres:</span>
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`btn btn-sm rounded-pill px-3 py-1 text-nowrap transition-all ${
                  selectedGenre === genre
                    ? 'btn-cinema-primary shadow-sm'
                    : 'btn-outline-secondary border-opacity-50 text-light'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold text-white mb-0 brand-font">
                {activeTab === 'now_showing' ? 'In Theaters Now' : 'Upcoming Blockbusters'}
              </h3>
              <p className="text-secondary small mb-0">
                Showing {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading movies...</span>
              </div>
              <p className="text-secondary mt-3">Loading cinema schedule...</p>
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="glass-card text-center py-5 px-3">
              <Film size={48} className="text-secondary opacity-50 mb-3" />
              <h5 className="text-white fw-bold">No movies matched your criteria</h5>
              <p className="text-secondary small mb-3">
                Try adjusting your search terms or genre filter to see available showtimes.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGenre('All');
                }}
                className="btn btn-outline-primary btn-sm px-4 rounded-pill"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">
              {filteredMovies.map((movie) => (
                <div key={movie._id} className="col">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cinemas Showcase Section */}
        <div id="cinemas" className="pt-4 mb-5">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50">
              EXPERIENCE
            </span>
          </div>
          <h3 className="fw-bold text-white brand-font mb-2">Our Partner Theaters &amp; Screens</h3>
          <p className="text-secondary small mb-4">
            Equipped with IMAX with Laser, Dolby Atmos® 64-channel 3D audio, and luxury VIP recliners.
          </p>

          <div className="row g-4">
            {cinemas.map((cinema) => (
              <div key={cinema._id} className="col-lg-4 col-md-6">
                <div className="glass-card p-4 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="text-white fw-bold mb-0 brand-font">{cinema.name}</h5>
                    <span className="badge bg-primary bg-opacity-25 text-primary small">
                      {cinema.city}
                    </span>
                  </div>
                  <p className="text-secondary small d-flex align-items-center gap-1.5 mb-3">
                    <MapPin size={14} className="text-danger flex-shrink-0" />
                    <span>{cinema.address}</span>
                  </p>

                  <div className="mt-auto">
                    <h6 className="text-light small fw-bold mb-2">Theater Amenities:</h6>
                    <div className="d-flex flex-wrap gap-1.5">
                      {cinema.amenities?.map((amenity, i) => (
                        <span key={i} className="badge bg-dark border border-secondary text-secondary small">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

