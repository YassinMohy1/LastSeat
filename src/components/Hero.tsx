import SearchBar from './SearchBar';

export default function Hero() {
  return (
    <section className="pt-24 pb-12 px-3 relative overflow-hidden min-h-[80vh] sm:min-h-screen bg-gradient-to-b from-sky-900 via-sky-800 to-sky-700" id="home">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%230c4a6e' width='1920' height='1080'/%3E%3C/svg%3E"
      >
        <source src="/WhatsApp Video 2025-10-26 at 3.57.56 AM.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

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
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
