// In-memory fallback dataset for seamless operation when MongoDB daemon is not running
const mockStore = {
  movies: [
    {
      _id: '661a00010000000000000001',
      title: 'Dune: Part Two',
      tagline: 'Long live the fighters.',
      description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
      genre: ['Sci-Fi', 'Adventure', 'Action'],
      duration: 166,
      rating: 8.6,
      censorRating: 'PG-13',
      languages: ['English', 'Spanish', 'Hindi'],
      releaseDate: new Date('2024-03-01'),
      director: 'Denis Villeneuve',
      cast: [
        { name: 'Timothée Chalamet', role: 'Paul Atreides', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
        { name: 'Zendaya', role: 'Chani', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
        { name: 'Rebecca Ferguson', role: 'Lady Jessica', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' }
      ],
      status: 'now_showing',
      isFeatured: true
    },
    {
      _id: '661a00010000000000000002',
      title: 'Oppenheimer',
      tagline: 'The world forever changes.',
      description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the moral complexity and seismic historical impact of the Manhattan Project.',
      posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
      genre: ['Biography', 'Drama', 'History'],
      duration: 180,
      rating: 8.9,
      censorRating: 'R',
      languages: ['English', 'German'],
      releaseDate: new Date('2023-07-21'),
      director: 'Christopher Nolan',
      cast: [
        { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' },
        { name: 'Emily Blunt', role: 'Katherine Oppenheimer', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
        { name: 'Robert Downey Jr.', role: 'Lewis Strauss', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
      ],
      status: 'now_showing',
      isFeatured: true
    },
    {
      _id: '661a00010000000000000003',
      title: 'Spider-Man: Across the Spider-Verse',
      tagline: 'It is how you wear the mask that matters.',
      description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
      posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
      trailerUrl: 'https://www.youtube.com/embed/cqGjhVJWtEg',
      genre: ['Animation', 'Action', 'Sci-Fi'],
      duration: 140,
      rating: 8.7,
      censorRating: 'PG',
      languages: ['English', 'Spanish'],
      releaseDate: new Date('2023-06-02'),
      director: 'Joaquim Dos Santos, Kemp Powers',
      cast: [
        { name: 'Shameik Moore', role: 'Miles Morales (voice)', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
        { name: 'Hailee Steinfeld', role: 'Gwen Stacy (voice)', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' }
      ],
      status: 'now_showing',
      isFeatured: true
    },
    {
      _id: '661a00010000000000000004',
      title: 'Interstellar',
      tagline: 'Mankind was born on Earth. It was never meant to die here.',
      description: 'When Earth becomes uninhabitable, a team of explorers undertakes the most important mission in human history: traveling beyond this galaxy.',
      posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
      trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
      genre: ['Sci-Fi', 'Adventure', 'Drama'],
      duration: 169,
      rating: 8.7,
      censorRating: 'PG-13',
      languages: ['English'],
      releaseDate: new Date('2014-11-07'),
      director: 'Christopher Nolan',
      cast: [
        { name: 'Matthew McConaughey', role: 'Cooper', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
      ],
      status: 'now_showing',
      isFeatured: false
    },
    {
      _id: '661a00010000000000000005',
      title: 'Deadpool & Wolverine',
      tagline: 'Come together.',
      description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool. They team up to defeat a common enemy.',
      posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      trailerUrl: 'https://www.youtube.com/embed/73_1biulkYk',
      genre: ['Action', 'Comedy', 'Sci-Fi'],
      duration: 128,
      rating: 8.1,
      censorRating: 'R',
      languages: ['English'],
      releaseDate: new Date('2024-07-26'),
      director: 'Shawn Levy',
      cast: [
        { name: 'Ryan Reynolds', role: 'Wade Wilson / Deadpool', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' }
      ],
      status: 'now_showing',
      isFeatured: false
    },
    {
      _id: '661a00010000000000000006',
      title: 'Gladiator II',
      tagline: 'What we do in life echoes in eternity.',
      description: 'Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered.',
      posterUrl: 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=600&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      trailerUrl: 'https://www.youtube.com/embed/4rgYUipGJNo',
      genre: ['Action', 'Drama', 'Adventure'],
      duration: 148,
      rating: 8.4,
      censorRating: 'R',
      languages: ['English'],
      releaseDate: new Date('2024-11-22'),
      director: 'Ridley Scott',
      cast: [
        { name: 'Paul Mescal', role: 'Lucius Verus', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' }
      ],
      status: 'upcoming',
      isFeatured: false
    }
  ],

  cinemas: [
    {
      _id: '661c00010000000000000001',
      name: 'IMovies Luxe Cinema - Times Square',
      chain: 'IMovies Premier',
      city: 'New York',
      address: '1560 Broadway, Times Square, New York, NY 10036',
      amenities: ['IMAX with Laser', 'Dolby Atmos', 'Recliner Loungers', 'Gourmet Dining', 'Wheelchair Accessible'],
      screens: [
        { screenNumber: 1, name: 'Screen 1 (IMAX Laser)', screenType: 'IMAX 3D', totalSeats: 80 }
      ]
    },
    {
      _id: '661c00010000000000000002',
      name: 'IMovies Grand Megaplex - Downtown',
      chain: 'IMovies Premier',
      city: 'New York',
      address: '250 Vesey Street, Downtown, New York, NY 10281',
      amenities: ['Dolby Atmos', '4K Laser Projection', 'Full Bar', 'Reserved Seating'],
      screens: [
        { screenNumber: 1, name: 'Screen 1 (Dolby Surround)', screenType: 'Dolby Atmos', totalSeats: 80 }
      ]
    },
    {
      _id: '661c00010000000000000003',
      name: 'IMovies Cineplex - Brooklyn Heights',
      chain: 'IMovies Classic',
      city: 'New York',
      address: '70 Court Street, Brooklyn, NY 11201',
      amenities: ['4K Digital', 'Dolby 7.1', 'Snack Bar', 'Student Discounts'],
      screens: [
        { screenNumber: 1, name: 'Screen 1 (Main Hall)', screenType: 'Standard 2D', totalSeats: 80 }
      ]
    }
  ],

  showtimes: [],
  bookings: [],

  initShowtimes() {
    if (this.showtimes.length > 0) return;
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const times = ['10:30 AM', '01:45 PM', '05:15 PM', '08:30 PM'];
    let idCounter = 1;

    for (const movie of this.movies.filter(m => m.status === 'now_showing')) {
      for (const cinema of this.cinemas) {
        for (const showDate of dates) {
          for (let t = 0; t < 2; t++) {
            const showTime = times[(movie.title.length + t) % times.length];
            const hexId = (idCounter++).toString(16).padStart(24, '0');
            this.showtimes.push({
              _id: hexId,
              movie: movie._id,
              cinema: cinema._id,
              screenName: cinema.screens[0]?.name || 'Screen 1 (Dolby Atmos)',
              screenType: cinema.screens[0]?.screenType || 'Dolby Atmos',
              showDate,
              showTime,
              prices: { VIP: 22, Premium: 16, Standard: 12 },
              rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
              cols: 10,
              bookedSeats: ['A3', 'C5', 'D4', 'D5']
            });
          }
        }
      }
    }
  }
};

mockStore.initShowtimes();

module.exports = mockStore;

