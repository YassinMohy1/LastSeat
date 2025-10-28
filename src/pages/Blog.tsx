import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AIAssistant from '../components/AIAssistant';

const blogPosts = [
  {
    id: 1,
    title: 'Top 10 Budget Travel Destinations for 2025',
    excerpt: 'Discover the most affordable and exciting destinations to visit this year without breaking the bank.',
    image: 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Sarah Johnson',
    date: 'November 15, 2025',
    category: 'Travel Tips'
  },
  {
    id: 2,
    title: 'How to Find Cheap Flights: Expert Tips',
    excerpt: 'Learn the insider secrets travel agents use to find the best flight deals for their clients.',
    image: 'https://images.pexels.com/photos/1309644/pexels-photo-1309644.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Michael Chen',
    date: 'November 12, 2025',
    category: 'Flight Deals'
  },
  {
    id: 3,
    title: 'Best Time to Book International Flights',
    excerpt: 'Timing is everything when it comes to booking international travel. Find out when to book for maximum savings.',
    image: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Emily Rodriguez',
    date: 'November 8, 2025',
    category: 'Travel Planning'
  },
  {
    id: 4,
    title: '7 Hidden Fees Airlines Charge and How to Avoid Them',
    excerpt: 'Uncover the hidden costs airlines add to your ticket and learn how to skip these unnecessary fees.',
    image: 'https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'David Thompson',
    date: 'November 5, 2025',
    category: 'Money Saving'
  },
  {
    id: 5,
    title: 'Last-Minute Flight Booking Strategies',
    excerpt: 'Need to book a flight quickly? Here are proven strategies to find great deals even at the last minute.',
    image: 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Jennifer Martinez',
    date: 'November 1, 2025',
    category: 'Travel Tips'
  },
  {
    id: 6,
    title: 'How to Upgrade to Business Class for Less',
    excerpt: 'Flying business class does not have to cost a fortune. Discover the tricks to affordable upgrades.',
    image: 'https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Robert Williams',
    date: 'October 28, 2025',
    category: 'Flight Deals'
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Travel Blog</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert tips, travel guides, and insider secrets to help you save money and travel smarter
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-brand-red to-brand-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-brand-red transition line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 text-brand-red font-semibold hover:gap-3 transition-all">
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-brand-red to-brand-blue rounded-2xl p-12 max-w-4xl mx-auto text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-xl mb-6 opacity-90">
                Call us now and let our experts find you the best flight deals
              </p>
              <Link
                to="/"
                className="inline-block bg-white text-brand-red font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
              >
                Book Your Flight Now
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AIAssistant />
    </div>
  );
}
