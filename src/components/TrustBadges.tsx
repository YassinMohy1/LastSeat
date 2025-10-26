import { Shield, Lock, Plane } from 'lucide-react';

export default function TrustBadges() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center gap-3 px-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Better_Business_Bureau_%28logo%29.svg/320px-Better_Business_Bureau_%28logo%29.svg.png"
                  alt="BCI Certified"
                  className="w-14 h-14 object-contain"
                />
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 text-sm">BCI</div>
                <div className="text-xs text-gray-600">Certified Business</div>
              </div>
            </div>

            <div className="w-px h-24 bg-gray-200"></div>

            <div className="flex flex-col items-center gap-3 px-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Lock-green.svg/240px-Lock-green.svg.png"
                  alt="Secure Payment"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 text-sm">Secure Payment</div>
                <div className="text-xs text-gray-600">SSL Encrypted</div>
              </div>
            </div>

            <div className="w-px h-24 bg-gray-200"></div>

            <div className="flex flex-col items-center gap-3 px-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-sky-50 rounded-full flex items-center justify-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/IATA_logo.svg/320px-IATA_logo.svg.png"
                  alt="IATA Certified"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900 text-sm">IATA Certified</div>
                <div className="text-xs text-gray-600">Travel Agency</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
