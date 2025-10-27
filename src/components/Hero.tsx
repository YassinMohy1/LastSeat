import SearchBar from './SearchBar';

export default function Hero() {
  return (
    <section className="pt-24 pb-12 px-3 relative overflow-hidden min-h-[80vh] sm:min-h-screen" id="home">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://cdn.discordapp.com/attachments/1036260892989456506/1431877637365825577/lv_0_.mp4?ex=68ffac37&is=68fe5ab7&hm=af607192c54b40c6ef2a4bdcd429d16c4224c13bf6c532f2f4805203cbc5bf74&" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/30"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-6 animate-fadeIn">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg">
            Fly More & Save Much More
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-white mb-4 drop-shadow-lg">
            Book cheap flights and save up to 50% OFF
          </p>
          <div className="inline-block bg-gradient-to-r from-brand-red to-brand-red/90 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base shadow-lg animate-pulse">
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
