const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Cinema = require('../models/Cinema');
const Showtime = require('../models/Showtime');
const Booking = require('../models/Booking');

dotenv.config({ path: __dirname + '/../.env' });

const seedDatabase = async () => {
  try {
    console.log('🧹 Purging existing collections...');
    await User.deleteMany();
    await Movie.deleteMany();
    await Cinema.deleteMany();
    await Showtime.deleteMany();
    await Booking.deleteMany();

    console.log('👤 Seeding default users...');
    const salt = await bcrypt.genSalt(10);
    const userPassword = await bcrypt.hash('password123', salt);
    const adminPassword = await bcrypt.hash('admin123', salt);

    const users = await User.create([
      {
        name: 'Demo Moviegoer',
        email: 'user@imovies.com',
        password: userPassword,
        phone: '+1 (555) 382-9102',
        role: 'user',
        credits: 300,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
      },
      {
        name: 'IMovies Administrator',
        email: 'admin@imovies.com',
        password: adminPassword,
        phone: '+1 (555) 999-0001',
        role: 'admin',
        credits: 1000,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
      }
    ]);

    console.log('🏢 Seeding cinemas...');
    const cinemas = await Cinema.create([
      {
        name: 'IMovies Luxe Cinema - Times Square',
        chain: 'IMovies Premier',
        city: 'New York',
        address: '1560 Broadway, Times Square, New York, NY 10036',
        amenities: ['IMAX with Laser', 'Dolby Atmos', 'Recliner Loungers', 'Gourmet Dining', 'Wheelchair Accessible'],
        screens: [
          { screenNumber: 1, name: 'Screen 1 (IMAX Laser)', screenType: 'IMAX 3D', totalSeats: 80 },
          { screenNumber: 2, name: 'Screen 2 (Dolby Atmos)', screenType: 'Dolby Atmos', totalSeats: 80 }
        ]
      },
      {
        name: 'IMovies Grand Megaplex - Downtown',
        chain: 'IMovies Premier',
        city: 'New York',
        address: '250 Vesey Street, Downtown, New York, NY 10281',
        amenities: ['Dolby Atmos', '4K Laser Projection', 'Full Bar', 'Reserved Seating'],
        screens: [
          { screenNumber: 1, name: 'Screen 1 (Dolby Surround)', screenType: 'Dolby Atmos', totalSeats: 80 },
          { screenNumber: 2, name: 'Screen 2 (4K Laser)', screenType: '4K Laser', totalSeats: 80 }
        ]
      },
      {
        name: 'IMovies Cineplex - Brooklyn Heights',
        chain: 'IMovies Classic',
        city: 'New York',
        address: '70 Court Street, Brooklyn, NY 11201',
        amenities: ['4K Digital', 'Dolby 7.1', 'Snack Bar', 'Student Discounts'],
        screens: [
          { screenNumber: 1, name: 'Screen 1 (Main Hall)', screenType: 'Standard 2D', totalSeats: 80 }
        ]
      }
    ]);

    console.log('🎬 Seeding blockbuster movies...');
    const movies = await Movie.create([
      {
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
        title: 'Spider-Man: Across the Spider-Verse',
        tagline: 'It is how you wear the mask that matters.',
        description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
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
        title: 'Interstellar',
        tagline: 'Mankind was born on Earth. It was never meant to die here.',
        description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
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
          { name: 'Matthew McConaughey', role: 'Cooper', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
          { name: 'Anne Hathaway', role: 'Brand', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' }
        ],
        status: 'now_showing',
        isFeatured: false
      },
      {
        title: 'Deadpool & Wolverine',
        tagline: 'Come together.',
        description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool. They team up to defeat a common enemy in an irreverent, high-octane multiversal romp.',
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
          { name: 'Ryan Reynolds', role: 'Wade Wilson / Deadpool', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' },
          { name: 'Hugh Jackman', role: 'Logan / Wolverine', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
        ],
        status: 'now_showing',
        isFeatured: false
      },
      {
        title: 'Gladiator II',
        tagline: 'What we do in life echoes in eternity.',
        description: 'Years after witnessing the death of Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
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
          { name: 'Paul Mescal', role: 'Lucius Verus', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' },
          { name: 'Pedro Pascal', role: 'Marcus Acacius', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
        ],
        status: 'upcoming',
        isFeatured: false
      }
    ]);

    console.log('🎟️ Creating showtimes with realistic seat matrices...');
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const timeSlots = ['10:30 AM', '01:45 PM', '05:15 PM', '08:30 PM'];
    const showtimesToInsert = [];

    // Create showtimes for now_showing movies
    const nowShowingMovies = movies.filter(m => m.status === 'now_showing');

    for (const movie of nowShowingMovies) {
      for (const cinema of cinemas) {
        // First 3 dates
        for (const showDate of dates.slice(0, 3)) {
          // Select 2 time slots per cinema per movie
          for (let idx = 0; idx < 2; idx++) {
            const showTime = timeSlots[(movie.title.length + idx) % timeSlots.length];
            
            // Seed a few booked seats for realism
            const bookedSeats = ['A3', 'A4', 'C5', 'C6', 'D4', 'D5', 'E7'].filter(() => Math.random() > 0.4);

            showtimesToInsert.push({
              movie: movie._id,
              cinema: cinema._id,
              screenName: cinema.screens[0]?.name || 'Screen 1 (Dolby Atmos)',
              screenType: cinema.screens[0]?.screenType || 'Dolby Atmos',
              showDate,
              showTime,
              prices: {
                VIP: 22,
                Premium: 16,
                Standard: 12
              },
              rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
              cols: 10,
              bookedSeats
            });
          }
        }
      }
    }

    const insertedShowtimes = await Showtime.insertMany(showtimesToInsert);
    console.log(`✅ Created ${insertedShowtimes.length} showtimes!`);

    // Seed a sample booking for the demo user
    const sampleShowtime = insertedShowtimes[0];
    const sampleMovie = movies.find(m => m._id.toString() === sampleShowtime.movie.toString());
    const sampleCinema = cinemas.find(c => c._id.toString() === sampleShowtime.cinema.toString());

    await Booking.create({
      bookingReference: 'IMOV-CONF789',
      user: users[0]._id,
      movie: sampleMovie._id,
      cinema: sampleCinema._id,
      showtime: sampleShowtime._id,
      seats: [
        { seatNumber: 'D4', tier: 'Premium', price: 16 },
        { seatNumber: 'D5', tier: 'Premium', price: 16 }
      ],
      subtotal: 32,
      bookingFee: 2.50,
      totalAmount: 34.50,
      status: 'confirmed',
      paymentMethod: 'Credit Card (Simulated)',
      paymentStatus: 'completed',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=IMOV-CONF789'
    });

    console.log('🎉 Database seeding completed successfully!');
    console.log('----------------------------------------------------');
    console.log('Default Credentials:');
    console.log('👤 User:  user@imovies.com  / password123');
    console.log('👑 Admin: admin@imovies.com / admin123');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// If run directly via CLI: node seeder/seedData.js
if (require.main === module) {
  const connectDB = require('../config/db');
  connectDB().then(async () => {
    await seedDatabase();
    process.exit();
  });
}

module.exports = { seedDatabase };

