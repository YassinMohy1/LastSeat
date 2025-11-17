'use client';

import SearchBar from './SearchBar';
import { useEffect, useRef, useState } from 'react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
    };

    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  return (
    <section className="pt-24 pb-12 px-3 relative overflow-hidden min-h-[80vh] sm:min-h-screen bg-black" id="home">
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={() => setIsVideoLoaded(false)}
        >
          <source src="/lv_0_.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-[1]"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-6 animate-fadeIn">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-2 drop-shadow-lg">
            Fly More & Save Much More
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-white mb-3 drop-shadow-lg">
            Book cheap flights and save up to 50% OFF
          </p>
          <div className="inline-block bg-gradient-to-r from-brand-red to-brand-red/90 text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm shadow-lg animate-pulse">
            🔥 Special Offer: Save up to $200!
          </div>
        </div>

        <SearchBar />

        <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="text-xl sm:text-3xl font-bold text-white drop-shadow-lg">1M+</div>
            <div className="text-white text-xs sm:text-base drop-shadow-md">Happy Travelers</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl sm:text-3xl font-bold text-white drop-shadow-lg">500+</div>
            <div className="text-white text-xs sm:text-base drop-shadow-md">Destinations</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl sm:text-3xl font-bold text-white drop-shadow-lg">24/7</div>
            <div className="text-white text-xs sm:text-base drop-shadow-md">Support</div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12">
          <p className="text-white text-center text-xs sm:text-sm font-medium mb-3 drop-shadow-md">Trusted Partner Airlines</p>
          <div className="flex items-center justify-center gap-8 md:gap-12 px-4">
            <div className="h-8 sm:h-10 md:h-12 flex items-center">
              <img
                src="https://logos-world.net/wp-content/uploads/2020/03/Qatar-Airways-Logo.png"
                alt="Qatar Airways"
                width="120"
                height="48"
                loading="eager"
                fetchPriority="high"
                className="h-full w-auto object-contain opacity-90 hover:opacity-100 transition-opacity filter brightness-0 invert"
              />
            </div>
            <div className="h-8 sm:h-10 md:h-12 flex items-center">
              <img
                src="https://logos-world.net/wp-content/uploads/2020/03/Turkish-Airlines-Logo.png"
                alt="Turkish Airlines"
                width="120"
                height="48"
                loading="eager"
                fetchPriority="high"
                className="h-full w-auto object-contain opacity-90 hover:opacity-100 transition-opacity filter brightness-0 invert"
              />
            </div>
            <div className="h-8 sm:h-10 md:h-12 flex items-center">
              <img
                src="/image copy copy copy copy copy copy copy copy copy copy copy.png"
                alt="Singapore Airlines"
                width="120"
                height="48"
                loading="eager"
                fetchPriority="high"
                className="h-full w-auto object-contain opacity-90 hover:opacity-100 transition-opacity filter brightness-0 invert"
              />
            </div>
            <div className="h-8 sm:h-10 md:h-12 flex items-center">
              <img
                src="/image copy copy copy copy copy copy copy copy copy copy copy copy copy.png"
                alt="Ethiopian Airlines"
                width="120"
                height="48"
                loading="eager"
                fetchPriority="high"
                className="h-full w-auto object-contain opacity-90 hover:opacity-100 transition-opacity filter brightness-0 invert"
              />
            </div>
            <span className="text-white text-sm sm:text-base font-medium opacity-90">and more...</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
