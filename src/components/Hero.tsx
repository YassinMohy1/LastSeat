import SearchBar from './SearchBar';

export default function Hero() {
  return (
    <section className="pt-32 pb-16 px-4 relative overflow-hidden min-h-screen" id="home">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/WhatsApp Video 2025-10-26 at 3.57.56 AM.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Fly More & Save Much More
          </h1>
          <p className="text-xl md:text-2xl text-white mb-6 drop-shadow-lg">
            Book cheap flights and save up to 50% OFF
          </p>
          <div className="inline-block bg-gradient-to-r from-brand-red to-brand-red/90 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg animate-pulse">
            🔥 Special Offer: Save up to $200 on International Flights!
          </div>
        </div>

        <SearchBar />

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-white drop-shadow-lg">1M+</div>
            <div className="text-white drop-shadow-md">Happy Travelers</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-white drop-shadow-lg">500+</div>
            <div className="text-white drop-shadow-md">Destinations</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-white drop-shadow-lg">24/7</div>
            <div className="text-white drop-shadow-md">Support</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
