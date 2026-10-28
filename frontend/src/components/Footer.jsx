import React from 'react';
import { Film, Heart, ShieldCheck, Zap, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-top border-secondary border-opacity-25 bg-dark pt-5 pb-4">
      <div className="container">
        <div className="row g-4 justify-content-between mb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center">
                <Film size={20} />
              </div>
              <span className="brand-font fs-4 fw-bold text-white">IMOVIES</span>
            </div>
            <p className="text-secondary small leading-relaxed mb-3">
              The premier MERN movie ticket booking platform. Browse blockbuster releases, select luxury theater screens, and reserve seats in real time with seamless checkout and downloadable e-tickets.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-50">Express.js</span>
              <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-50">MongoDB</span>
              <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-50">React 18</span>
              <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-50">Bootstrap 5</span>
              <span className="badge bg-secondary bg-opacity-25 text-light border border-secondary border-opacity-50">JWT Auth</span>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3">Quick Navigation</h6>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-0">
              <li><a href="/" className="text-decoration-none text-secondary text-hover-primary">Now Showing</a></li>
              <li><a href="/#upcoming" className="text-decoration-none text-secondary text-hover-primary">Coming Soon</a></li>
              <li><a href="/#cinemas" className="text-decoration-none text-secondary text-hover-primary">IMAX Theaters</a></li>
              <li><a href="/my-bookings" className="text-decoration-none text-secondary text-hover-primary">Ticket History</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3">Features &amp; Tech</h6>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-0">
              <li className="d-flex align-items-center gap-1.5"><Zap size={14} className="text-warning" /> Real-time Seats</li>
              <li className="d-flex align-items-center gap-1.5"><ShieldCheck size={14} className="text-success" /> Concurrency Safe</li>
              <li className="d-flex align-items-center gap-1.5"><Sparkles size={14} className="text-info" /> QR Code Passes</li>
              <li className="d-flex align-items-center gap-1.5"><Film size={14} className="text-primary" /> Cinema Chains</li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Project Metadata</h6>
            <div className="p-3 rounded-3 bg-black bg-opacity-40 border border-secondary border-opacity-25 small">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-secondary">Project:</span>
                <span className="text-light fw-medium">IMovies Booking</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-secondary">Architecture:</span>
                <span className="text-success fw-medium">MERN Full-Stack</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-secondary">Epics:</span>
                <span className="text-light fw-medium">6 Completed</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Tasks:</span>
                <span className="text-primary fw-medium">19 Verified</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-secondary border-opacity-25 my-4" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small text-secondary">
          <div>
            &copy; {new Date().getFullYear()} IMovies Cinema Platform. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-1">
            <span>Crafted with</span>
            <Heart size={14} className="text-danger fill-danger" />
            <span>using Express, React, and MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

