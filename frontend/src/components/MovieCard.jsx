import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className="movie-card glass-card h-100 d-flex flex-column p-2.5">
      {/* Poster */}
      <div
        className="movie-poster-wrapper cursor-pointer"
        onClick={() => navigate(`/movies/${movie._id}`)}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
          }}
        />
        
        {/* Top Badges */}
        <div className="position-absolute top-0 start-0 p-2 d-flex gap-1.5">
          <span className="badge bg-black bg-opacity-75 border border-secondary border-opacity-50 text-warning d-flex align-items-center gap-1 shadow-sm">
            <Star size={12} fill="#f59e0b" />
            <span className="fw-bold">{movie.rating?.toFixed(1) || '8.5'}</span>
          </span>
          {movie.status === 'upcoming' && (
            <span className="badge bg-info text-dark fw-bold">SOON</span>
          )}
        </div>

        <div className="position-absolute top-0 end-0 p-2">
          <span className="badge bg-dark bg-opacity-75 border border-secondary text-secondary small">
            {movie.censorRating || 'UA'}
          </span>
        </div>

        {/* Bottom Poster Gradient Info */}
        <div className="poster-overlay">
          <div className="w-100">
            <span className="text-secondary small d-flex align-items-center gap-1 mb-1">
              <Clock size={13} />
              {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
            </span>
          </div>
        </div>
      </div>

      {/* Details Body */}
      <div className="d-flex flex-column flex-grow-1 pt-3 pb-1 px-1">
        <h6
          className="text-white fw-bold mb-1 text-truncate cursor-pointer hover-text-primary"
          title={movie.title}
          onClick={() => navigate(`/movies/${movie._id}`)}
          style={{ cursor: 'pointer' }}
        >
          {movie.title}
        </h6>

        <div className="text-secondary small mb-2 text-truncate">
          {Array.isArray(movie.genre) ? movie.genre.slice(0, 2).join(' / ') : movie.genre}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-2">
          <button
            onClick={() => navigate(`/movies/${movie._id}`)}
            className={`btn w-100 d-flex align-items-center justify-content-center gap-2 py-2 small fw-semibold ${
              movie.status === 'upcoming' ? 'btn-outline-secondary' : 'btn-cinema-primary'
            }`}
          >
            <Ticket size={16} />
            <span>{movie.status === 'upcoming' ? 'View Details' : 'Book Seats'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

