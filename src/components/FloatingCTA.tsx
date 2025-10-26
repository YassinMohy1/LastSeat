import { Phone, X } from 'lucide-react';
import { useState } from 'react';
import { trackPhoneClick, trackButtonClick } from '../lib/analytics';

export default function FloatingCTA() {
  const [showPopup, setShowPopup] = useState(false);

  const handleCallNowClick = () => {
    trackButtonClick('Floating Call Now', 'Floating CTA');
    setShowPopup(true);
  };

  const handlePhoneClick = () => {
    trackPhoneClick('888-602-6667');
  };

  const handleWhatsAppClick = () => {
    trackButtonClick('WhatsApp Message', 'Floating CTA Popup');
  };

  return (
    <>
      <button
        onClick={handleCallNowClick}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-brand-red to-brand-red/90 text-white px-6 py-4 rounded-full shadow-2xl hover:from-brand-red/90 hover:to-brand-red/80 transition transform hover:scale-110 z-40 flex items-center gap-2 font-bold animate-bounce"
      >
        <Phone className="w-6 h-6" />
        <span className="hidden sm:inline">Call Now</span>
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-slideUp">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-red to-brand-red/90 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Ready to Book?
              </h3>
              <p className="text-gray-600 mb-6">
                Call our expert travel agents now and get the best deals!
              </p>

              <a
                href="tel:888-602-6667"
                onClick={handlePhoneClick}
                className="block w-full bg-gradient-to-r from-brand-red to-brand-red/90 text-white py-4 rounded-lg font-bold text-xl hover:from-brand-red/90 hover:to-brand-red/80 transition shadow-lg mb-4"
              >
                📞 888-602-6667
              </a>

              <a
                href="https://wa.me/18886026667"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="block w-full bg-gradient-to-r from-brand-blue to-brand-blue/90 text-white py-4 rounded-lg font-bold hover:from-brand-blue/90 hover:to-brand-blue/80 transition shadow-lg"
              >
                💬 Message on WhatsApp
              </a>

              <div className="mt-6 text-sm text-gray-500">
                Available 24/7 • Average wait time: &lt; 30 seconds
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
