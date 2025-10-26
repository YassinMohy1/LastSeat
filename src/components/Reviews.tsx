import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const reviews = [
  {
    name: 'Sarah Johnson',
    location: 'New York, NY',
    rating: 5,
    text: 'Incredible service! The agent helped me find a flight $300 cheaper than what I found online. Booking over the phone was so easy and personal.',
    date: 'October 2025'
  },
  {
    name: 'Michael Chen',
    location: 'Los Angeles, CA',
    rating: 5,
    text: 'I was skeptical at first, but calling was the best decision. They got me upgraded to business class for less than I would have paid for economy online!',
    date: 'September 2025'
  },
  {
    name: 'Emily Rodriguez',
    location: 'Miami, FL',
    rating: 5,
    text: 'Fast, professional, and they saved me so much money. The 24/7 support is real - I called at midnight and got help immediately!',
    date: 'October 2025'
  },
  {
    name: 'David Thompson',
    location: 'Chicago, IL',
    rating: 5,
    text: 'Best travel booking experience ever. The agent knew exactly what I needed and found me the perfect flight. Will definitely use again!',
    date: 'September 2025'
  },
  {
    name: 'Jennifer Martinez',
    location: 'Houston, TX',
    rating: 5,
    text: 'Amazing experience! Saved over $400 on my family vacation. The agent was patient and helped us find the perfect flights with our budget.',
    date: 'November 2025'
  },
  {
    name: 'Robert Williams',
    location: 'Seattle, WA',
    rating: 5,
    text: 'Called at 3am before my trip and got immediate help. These folks are true professionals. Better than any online booking site!',
    date: 'October 2025'
  },
  {
    name: 'Lisa Anderson',
    location: 'Boston, MA',
    rating: 5,
    text: 'Phenomenal service! They found me a last-minute flight that fit my tight budget. Will never book online again!',
    date: 'September 2025'
  },
  {
    name: 'James Taylor',
    location: 'Phoenix, AZ',
    rating: 5,
    text: 'Best decision ever! The agent found hidden deals I never would have found myself. Saved $250 and got better seats!',
    date: 'November 2025'
  },
  {
    name: 'Maria Garcia',
    location: 'San Diego, CA',
    rating: 5,
    text: 'Incredible value and service. They handled all the details and got me upgrades I did not expect. Highly recommend!',
    date: 'October 2025'
  },
  {
    name: 'Kevin Brown',
    location: 'Denver, CO',
    rating: 5,
    text: 'Called them skeptical, ended up booking my entire trip through them. Saved money and time. Customer service is outstanding!',
    date: 'September 2025'
  },
  {
    name: 'Amanda White',
    location: 'Atlanta, GA',
    rating: 5,
    text: 'I had a complex itinerary and they handled it perfectly. Found the best connections and saved me hundreds. True professionals!',
    date: 'November 2025'
  },
  {
    name: 'Daniel Harris',
    location: 'Las Vegas, NV',
    rating: 5,
    text: 'Outstanding! They worked with my schedule and budget to find perfect flights. The personal touch makes all the difference!',
    date: 'October 2025'
  }
];

export default function Reviews() {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 4;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of happy travelers who booked with us
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-lg font-semibold">4.9/5 from 12,450+ reviews</span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={goToPrevPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition hidden lg:flex items-center justify-center"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            onClick={goToNextPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition hidden lg:flex items-center justify-center"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentReviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl relative"
            >
              <Quote className="w-10 h-10 text-brand-blue/30 absolute top-4 right-4" />

              <div className="flex mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                "{review.text}"
              </p>

              <div className="border-t pt-4">
                <div className="font-bold text-gray-900">{review.name}</div>
                <div className="text-sm text-gray-600">{review.location}</div>
                <div className="text-xs text-gray-500 mt-1">{review.date}</div>
              </div>
            </div>
          ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-10">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-3 rounded-full transition-all ${
                idx === currentPage
                  ? 'w-8 bg-brand-blue'
                  : 'w-3 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://www.trustpilot.com/review/lastseatticket.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#00B67A] hover:bg-[#009963] text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Star className="w-5 h-5 fill-white" />
            <span>View All Reviews on Trustpilot</span>
          </a>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-8 bg-white rounded-xl shadow-lg p-6">
            <div className="text-center border-r pr-8">
              <img
                src="https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=200&h=200"
                alt="BCI Accredited"
                className="w-20 h-20 mx-auto mb-2 rounded-lg object-cover"
              />
              <div className="font-semibold text-sm">BCI Accredited</div>
            </div>
            <div className="text-center border-r pr-8">
              <img
                src="https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=200&h=200"
                alt="Secure Payments"
                className="w-20 h-20 mx-auto mb-2 rounded-lg object-cover"
              />
              <div className="font-semibold text-sm">Secure Payments</div>
            </div>
            <div className="text-center">
              <img
                src="https://images.pexels.com/photos/1309644/pexels-photo-1309644.jpeg?auto=compress&cs=tinysrgb&w=200&h=200"
                alt="IATA Certified"
                className="w-20 h-20 mx-auto mb-2 rounded-lg object-cover"
              />
              <div className="font-semibold text-sm">IATA Certified</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
