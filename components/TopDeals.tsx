'use client';

import { Phone, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const deals = [
  {
    destination: 'London',
    price: '$385',
    image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov - Dec 2025',
    airline: 'Multiple Airlines',
    savings: 'Save $180'
  },
  {
    destination: 'Tokyo',
    price: '$520',
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Year Round',
    airline: 'Multiple Airlines',
    savings: 'Save $200'
  },
  {
    destination: 'Paris',
    price: '$365',
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Oct - Jan 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $165'
  },
  {
    destination: 'Dubai',
    price: '$495',
    image: 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Dec - Mar 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $190'
  },
  {
    destination: 'Manila',
    price: '$485',
    image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov 2025 - Feb 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $220'
  },
  {
    destination: 'Barcelona',
    price: '$345',
    image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Oct - Dec 2025',
    airline: 'Multiple Airlines',
    savings: 'Save $155'
  },
  {
    destination: 'Cancun',
    price: '$225',
    image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov 2025 - Apr 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $120'
  },
  {
    destination: 'Bangkok',
    price: '$535',
    image: 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Dec 2025 - Mar 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $240'
  },
  {
    destination: 'Rome',
    price: '$395',
    image: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Oct - Dec 2025',
    airline: 'Multiple Airlines',
    savings: 'Save $175'
  },
  {
    destination: 'Bali',
    price: '$595',
    image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov 2025 - Apr 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $260'
  },
  {
    destination: 'Iceland',
    price: '$385',
    image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov 2025 - Jan 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $145'
  },
  {
    destination: 'Punta Cana',
    price: '$295',
    image: 'https://images.pexels.com/photos/6069831/pexels-photo-6069831.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Dec 2025 - Mar 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $135'
  },
  {
    destination: 'Maldives',
    price: '$685',
    image: 'https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov 2025 - Mar 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $280'
  },
  {
    destination: 'Santorini',
    price: '$465',
    image: 'https://images.pexels.com/photos/3264723/pexels-photo-3264723.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'May - Sep 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $210'
  },
  {
    destination: 'Prague',
    price: '$375',
    image: 'https://images.pexels.com/photos/161851/prague-czech-republic-city-architecture-161851.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Oct 2025 - Jan 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $160'
  },
  {
    destination: 'Sydney',
    price: '$775',
    image: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Dec 2025 - Feb 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $310'
  },
  {
    destination: 'Amsterdam',
    price: '$355',
    image: 'https://images.pexels.com/photos/2031706/pexels-photo-2031706.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Year Round',
    airline: 'Multiple Airlines',
    savings: 'Save $155'
  },
  {
    destination: 'Lisbon',
    price: '$395',
    image: 'https://images.pexels.com/photos/2570063/pexels-photo-2570063.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Sep 2025 - Nov 2025',
    airline: 'Multiple Airlines',
    savings: 'Save $170'
  },
  {
    destination: 'Singapore',
    price: '$625',
    image: 'https://images.pexels.com/photos/3152124/pexels-photo-3152124.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov 2025 - Mar 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $250'
  },
  {
    destination: 'Istanbul',
    price: '$455',
    image: 'https://images.pexels.com/photos/3401920/pexels-photo-3401920.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Oct 2025 - Dec 2025',
    airline: 'Multiple Airlines',
    savings: 'Save $195'
  },
  {
    destination: 'New Zealand',
    price: '$795',
    image: 'https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov 2025 - Feb 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $340'
  },
  {
    destination: 'Morocco',
    price: '$485',
    image: 'https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Oct 2025 - Jan 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $220'
  },
  {
    destination: 'Switzerland',
    price: '$525',
    image: 'https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Dec 2025 - Mar 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $230'
  },
  {
    destination: 'New York',
    price: '$195',
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Year Round',
    airline: 'Multiple Airlines',
    savings: 'Save $95'
  }
];

export default function TopDeals() {
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dealsPerPage = 4;
  const totalPages = Math.ceil(deals.length / dealsPerPage);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalPages]);

  const handleCallNow = () => {
    window.location.href = 'tel:888-602-6667';
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      goToNextPage();
    }
    if (touchStart - touchEnd < -75) {
      goToPrevPage();
    }
  };

  const currentDeals = deals.slice(
    currentPage * dealsPerPage,
    (currentPage + 1) * dealsPerPage
  );

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50" id="offers">
      <div className="container mx-auto px-3">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Today's Top Flight Deals
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-gray-600">
            Exclusive offers available now. Call to book before they're gone!
          </p>
        </div>

        <div className="relative">
          <button
            onClick={goToPrevPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition hidden lg:flex items-center justify-center"
            aria-label="Previous deals"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>

          <button
            onClick={goToNextPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition hidden lg:flex items-center justify-center"
            aria-label="Next deals"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>

          <div
            ref={containerRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {currentDeals.map((deal, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl flex flex-col"
            >
              <div className="relative h-40 overflow-hidden flex-shrink-0">
                <img
                  src={deal.image}
                  alt={deal.destination}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
                <div className="absolute top-2 right-2 bg-brand-red text-white px-2 py-1 rounded-full text-xs font-bold">
                  {deal.savings}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-blue" />
                  {deal.destination}
                </h3>

                <div className="space-y-1 mb-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5" />
                    {deal.airline}
                  </div>
                </div>

                <div className="mb-3 mt-auto">
                  <div className="text-xs text-gray-500">Starting from</div>
                  <div className="text-2xl font-bold text-brand-blue">
                    {deal.price}
                  </div>
                </div>

                <button
                  onClick={handleCallNow}
                  className="w-full bg-gradient-to-r from-brand-red to-brand-red/90 text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 hover:from-brand-red/90 hover:to-brand-red/80 transition shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  Call Now to Book
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentPage
                  ? 'w-6 bg-brand-blue'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleCallNow}
            className="bg-gradient-to-r from-brand-blue to-brand-blue/90 text-white px-6 py-3 rounded-lg font-bold text-sm sm:text-base hover:from-brand-blue/90 hover:to-brand-blue/80 transition shadow-lg"
          >
            View All Deals - Call 888-602-6667
          </button>
        </div>
      </div>
    </section>
  );
}

function Plane({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12h14M12 5l7 7-7 7"
      />
    </svg>
  );
}
