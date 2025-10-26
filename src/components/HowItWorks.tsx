import { Search, Phone, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-white" id="how-to-book">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How to Book Your Flight
          </h2>
          <p className="text-xl text-gray-600">
            Simple, fast, and hassle-free booking process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center group">
            <div className="mb-6 inline-block p-6 bg-gradient-to-br from-brand-blue/20 to-brand-blue/40 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Search className="w-12 h-12 text-brand-blue" />
            </div>
            <div className="bg-brand-blue text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              1
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Search Your Flight
            </h3>
            <p className="text-gray-600">
              Use our search tool to find flights to your desired destination. Browse through hundreds of options.
            </p>
          </div>

          <div className="text-center group">
            <div className="mb-6 inline-block p-6 bg-gradient-to-br from-brand-red/20 to-brand-red/40 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Phone className="w-12 h-12 text-brand-red" />
            </div>
            <div className="bg-brand-red text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              2
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Call Our Experts
            </h3>
            <p className="text-gray-600">
              Speak directly with our travel agents. Get personalized recommendations and exclusive deals.
            </p>
          </div>

          <div className="text-center group">
            <div className="mb-6 inline-block p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-12 h-12 text-gray-600" />
            </div>
            <div className="bg-gray-600 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              3
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Confirm & Fly
            </h3>
            <p className="text-gray-600">
              Complete your booking over the phone. Receive instant confirmation and prepare for your journey.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-brand-blue to-brand-blue/90 rounded-2xl p-8 text-center text-white max-w-3xl mx-auto shadow-xl">
          <h3 className="text-2xl font-bold mb-3">
            Why Book by Phone?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold">Exclusive Phone-Only Deals</div>
                <div className="text-white/80 text-sm">Access special rates not available online</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold">Expert Guidance</div>
                <div className="text-white/80 text-sm">Get personalized recommendations</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold">Instant Support</div>
                <div className="text-white/80 text-sm">Resolve issues in real-time</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold">Flexible Payment Options</div>
                <div className="text-white/80 text-sm">Multiple payment methods accepted</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
