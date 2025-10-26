import { Phone, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const deals = [
  {
    destination: 'London',
    price: '$459',
    image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov - Dec 2025',
    airline: 'Multiple Airlines',
    savings: 'Save $200'
  },
  {
    destination: 'Tokyo',
    price: '$599',
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Year Round',
    airline: 'Multiple Airlines',
    savings: 'Save $180'
  },
  {
    destination: 'Paris',
    price: '$429',
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Oct - Jan 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $150'
  },
  {
    destination: 'Dubai',
    price: '$689',
    image: 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Dec - Mar 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $220'
  },
  {
    destination: 'Manila',
    price: '$549',
    image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov 2025 - Feb 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $250'
  },
  {
    destination: 'Barcelona',
    price: '$399',
    image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Oct - Dec 2025',
    airline: 'Multiple Airlines',
    savings: 'Save $190'
  },
  {
    destination: 'Cancun',
    price: '$299',
    image: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov 2025 - Apr 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $140'
  },
  {
    destination: 'Bangkok',
    price: '$629',
    image: 'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Dec 2025 - Mar 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $280'
  },
  {
    destination: 'Rome',
    price: '$479',
    image: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Oct - Dec 2025',
    airline: 'Multiple Airlines',
    savings: 'Save $210'
  },
  {
    destination: 'Bali',
    price: '$699',
    image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov 2025 - Apr 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $300'
  },
  {
    destination: 'Iceland',
    price: '$449',
    image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov 2025 - Jan 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $170'
  },
  {
    destination: 'Punta Cana',
    price: '$379',
    image: 'https://images.pexels.com/photos/6069831/pexels-photo-6069831.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Dec 2025 - Mar 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $160'
  },
  {
    destination: 'Maldives',
    price: '$799',
    image: 'https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov 2025 - Mar 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $320'
  },
  {
    destination: 'Santorini',
    price: '$559',
    image: 'https://images.pexels.com/photos/3264723/pexels-photo-3264723.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'May - Sep 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $240'
  },
  {
    destination: 'Prague',
    price: '$449',
    image: 'https://images.pexels.com/photos/161851/prague-czech-republic-city-architecture-161851.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Oct 2025 - Jan 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $190'
  },
  {
    destination: 'Sydney',
    price: '$879',
    image: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Dec 2025 - Feb 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $350'
  },
  {
    destination: 'Amsterdam',
    price: '$419',
    image: 'https://images.pexels.com/photos/2031706/pexels-photo-2031706.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Year Round',
    airline: 'Multiple Airlines',
    savings: 'Save $180'
  },
  {
    destination: 'Lisbon',
    price: '$469',
    image: 'https://images.pexels.com/photos/2570063/pexels-photo-2570063.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Sep 2025 - Nov 2025',
    airline: 'Multiple Airlines',
    savings: 'Save $200'
  },
  {
    destination: 'Singapore',
    price: '$729',
    image: 'https://images.pexels.com/photos/3152124/pexels-photo-3152124.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov 2025 - Mar 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $290'
  },
  {
    destination: 'Istanbul',
    price: '$539',
    image: 'https://images.pexels.com/photos/3401920/pexels-photo-3401920.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Oct 2025 - Dec 2025',
    airline: 'Multiple Airlines',
    savings: 'Save $230'
  },
  {
    destination: 'New Zealand',
    price: '$899',
    image: 'https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Nov 2025 - Feb 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $380'
  },
  {
    destination: 'Morocco',
    price: '$589',
    image: 'https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Oct 2025 - Jan 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $260'
  },
  {
    destination: 'Switzerland',
    price: '$619',
    image: 'https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Dec 2025 - Mar 2026',
    airline: 'Multiple Airlines',
    savings: 'Save $270'
  },
  {
    destination: 'New York',
    price: '$329',
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
    dates: 'Year Round',
    airline: 'Multiple Airlines',
    savings: 'Save $150'
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
    <section className="py-16 bg-gradient-to-b from-white to-gray-50" id="offers">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Today's Top Flight Deals
          </h2>
          <p className="text-xl text-gray-600">
            Exclusive offers available now. Call to book before they're gone!
          </p>
        </div>

        <div className="relative">
          <button
            onClick={goToPrevPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition hidden lg:flex items-center justify-center"
            aria-label="Previous deals"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            onClick={goToNextPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition hidden lg:flex items-center justify-center"
            aria-label="Next deals"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          <div
            ref={containerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {currentDeals.map((deal, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl flex flex-col"
            >
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <img
                  src={deal.image}
                  alt={deal.destination}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
                <div className="absolute top-3 right-3 bg-brand-red text-white px-3 py-1 rounded-full text-sm font-bold">
                  {deal.savings}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-blue" />
                  {deal.destination}
                </h3>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4" />
                    {deal.airline}
                  </div>
                </div>

                <div className="mb-4 mt-auto">
                  <div className="text-sm text-gray-500">Starting from</div>
                  <div className="text-3xl font-bold text-brand-blue">
                    {deal.price}
                  </div>
                </div>

                <button
                  onClick={handleCallNow}
                  className="w-full bg-gradient-to-r from-brand-red to-brand-red/90 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:from-brand-red/90 hover:to-brand-red/80 transition shadow-md"
                >
                  <Phone className="w-5 h-5" />
                  Call Now to Book
                </button>
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

        <div className="text-center mt-10">
          <button
            onClick={handleCallNow}
            className="bg-gradient-to-r from-brand-blue to-brand-blue/90 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-brand-blue/90 hover:to-brand-blue/80 transition shadow-lg"
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
