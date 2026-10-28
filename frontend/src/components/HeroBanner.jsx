import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, Play, Ticket, ChevronLeft, ChevronRight, X } from 'lucide-react';

const HeroBanner = ({ movies = [] }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerModalUrl, setTrailerModalUrl] = useState(null);

  const featured = movies.length > 0 ? movies.slice(0, 4) : [];

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const current = featured[currentIndex] || featured[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  return (
    <>
      <div className="position-relative overflow-hidden mb-5 rounded-4 shadow-lg" style={{ minHeight: '480px', height: '62vh', maxHeight: '620px' }}>
        {/* Background Backdrop */}
        <div
          className="hero-backdrop"
          style={{ backgroundImage: `url(${current.backdropUrl || current.posterUrl})` }}
        />
        <div className="hero-gradient" />

        {/* Content Container */}
        <div className="position-relative h-100 container d-flex flex-column justify-content-end pb-5 pt-4">
          <div className="row">
            <div className="col-lg-8 col-xl-7">
              {/* Badges */}
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge bg-danger px-2.5 py-1 fw-bold tracking-wide">
                  FEATURED BLOCKBUSTER
                </span>
                <span className="badge bg-dark bg-opacity-75 border border-secondary text-light px-2.5 py-1">
                  {current.censorRating || 'PG-13'}
                </span>
                <div className="d-flex align-items-center gap-1 text-warning bg-black bg-opacity-60 px-2.5 py-1 rounded-pill small border border-warning border-opacity-25">
                  <Star size={14} fill="#f59e0b" className="text-warning" />
                  <span className="fw-bold">{current.rating?.toFixed(1) || '8.5'}</span>
                  <span className="text-secondary" style={{ fontSize: '0.7rem' }}>/ 10</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="display-4 fw-extrabold text-white text-shadow mb-1 brand-font">
                {current.title}
              </h1>

              {current.tagline && (
                <p className="lead text-primary fw-medium mb-3 fst-italic">
                  &ldquo;{current.tagline}&rdquo;
                </p>
              )}

              {/* Synopsis snippet */}
              <p className="text-light text-opacity-80 line-clamp-3 mb-4 d-none d-md-block" style={{ fontSize: '0.95rem' }}>
                {current.description}
              </p>

              {/* Movie Meta Information */}
              <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small mb-4">
                <span className="d-flex align-items-center gap-1.5 text-light">
                  <Clock size={15} className="text-primary" />
                  {Math.floor(current.duration / 60)}h {current.duration % 60}m
                </span>
                <span>•</span>
                <span className="d-flex align-items-center gap-1.5 text-light">
                  <Calendar size={15} className="text-primary" />
                  {new Date(current.releaseDate).getFullYear()}
                </span>
                <span>•</span>
                <span className="text-light">
                  {Array.isArray(current.genre) ? current.genre.join(', ') : current.genre}
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="d-flex flex-wrap align-items-center gap-3">
                <button
                  onClick={() => navigate(`/movies/${current._id}`)}
                  className="btn btn-cinema-primary px-4 py-2.5 d-flex align-items-center gap-2 shadow-lg"
                >
                  <Ticket size={18} />
                  <span>Book Tickets Now</span>
                </button>

                {current.trailerUrl && (
                  <button
                    onClick={() => setTrailerModalUrl(current.trailerUrl)}
                    className="btn btn-outline-light px-4 py-2.5 d-flex align-items-center gap-2 rounded-2"
                  >
                    <Play size={18} fill="white" />
                    <span>Watch Trailer</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Carousel Arrows & Dots */}
          <div className="position-absolute bottom-0 end-0 p-4 d-flex align-items-center gap-2">
            <div className="d-flex gap-1.5 me-3">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`border-0 rounded-pill transition-all ${
                    i === currentIndex ? 'bg-primary' : 'bg-secondary bg-opacity-50'
                  }`}
                  style={{ width: i === currentIndex ? '24px' : '8px', height: '8px', cursor: 'pointer' }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handlePrev}
              className="btn btn-dark btn-sm rounded-circle p-2 border border-secondary border-opacity-50 shadow"
              aria-label="Previous movie"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="btn btn-dark btn-sm rounded-circle p-2 border border-secondary border-opacity-50 shadow"
              aria-label="Next movie"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Video Trailer Modal */}
      {trailerModalUrl && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark border-secondary">
              <div className="modal-header border-secondary py-2">
                <h6 className="modal-title text-light fw-bold">Official Movie Trailer</h6>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setTrailerModalUrl(null)}
                />
              </div>
              <div className="modal-body p-0 ratio ratio-16x9">
                <iframe
                  src={`${trailerModalUrl}?autoplay=1`}
                  title="Movie Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroBanner;

