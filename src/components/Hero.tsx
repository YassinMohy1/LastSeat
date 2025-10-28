import SearchBar from './SearchBar';

export default function Hero() {
  return (
    <section className="pt-24 pb-12 px-3 relative overflow-hidden min-h-[80vh] sm:min-h-screen bg-gradient-to-b from-sky-900 via-sky-800 to-sky-700" id="home">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%230c4a6e;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%230e7490;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%230369a1;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23grad)'/%3E%3C/svg%3E"
        className="absolute inset-0 w-full h-full object-cover opacity-100 z-0"
      >
        <source src="https://cdn.discordapp.com/attachments/1036260892989456506/1431877637365825577/lv_0_.mp4?ex=69024f37&is=6900fdb7&hm=9debbc9a909b224799fb1d9d56aecfd638496993979b5312ba7f4d10b919a46c&" type="video/mp4" />
      </video>

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
            <img
              src="https://logos-world.net/wp-content/uploads/2020/03/Qatar-Airways-Logo.png"
              alt="Qatar Airways"
              loading="lazy"
              className="h-8 sm:h-10 md:h-12 object-contain opacity-90 hover:opacity-100 transition-opacity filter brightness-0 invert"
            />
            <img
              src="https://logos-world.net/wp-content/uploads/2020/03/Turkish-Airlines-Logo.png"
              alt="Turkish Airlines"
              loading="lazy"
              className="h-8 sm:h-10 md:h-12 object-contain opacity-90 hover:opacity-100 transition-opacity filter brightness-0 invert"
            />
            <img
              src="/image copy copy copy copy copy copy copy copy copy copy copy.png"
              alt="Singapore Airlines"
              loading="lazy"
              className="h-8 sm:h-10 md:h-12 object-contain opacity-90 hover:opacity-100 transition-opacity filter brightness-0 invert"
            />
            <img
              src="/image copy copy copy copy copy copy copy copy copy copy copy copy copy.png"
              alt="Ethiopian Airlines"
              loading="lazy"
              className="h-8 sm:h-10 md:h-12 object-contain opacity-90 hover:opacity-100 transition-opacity filter brightness-0 invert"
            />
            <span className="text-white text-sm sm:text-base font-medium opacity-90">and more...</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
