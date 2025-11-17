'use client';

import { Shield, Scale, AlertTriangle, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AIAssistant from '@/components/AIAssistant';

export default function TermsConditions() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white pt-24">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-brand-red to-brand-blue rounded-full mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-600">
            Rules & Conditions of LastSeatTickets
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Disputes</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                The exclusive means of resolving any dispute or claim arising out of or relating to this Agreement (including any alleged breach thereof), the Service, or the Website shall be BINDING ARBITRATION administered by the American Arbitration Association. The one exception to the exclusivity of arbitration is that you have the right to bring an individual claim against the Company in a small-claims court of competent jurisdiction. But whether you choose arbitration or small-claims court, you may not under any circumstances commence or maintain against the Company any class action, class arbitration, or other representative action or proceeding.
              </p>
              <p>
                By using the Website or the Service in any manner, you agree to the above arbitration agreement. In doing so, <strong>YOU GIVE UP YOUR RIGHT TO GO TO COURT</strong> to assert or defend any claims between you and the Company (except for matters that may be taken to small-claims court). <strong>YOU ALSO GIVE UP YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION OR OTHER CLASS PROCEEDING.</strong> Your rights will be determined by a NEUTRAL ARBITRATOR, NOT A JUDGE OR JURY.
              </p>
              <p>
                You are entitled to a fair hearing before the arbitrator. The arbitrator can grant any relief that a court can, but you should note that arbitration proceedings are usually simpler and more streamlined than trials and other judicial proceedings. Decisions by the arbitrator are enforceable in court and may be overturned by a court only for very limited reasons.
              </p>
              <p>
                Any proceeding to enforce this arbitration agreement, including any proceeding to confirm, modify, or vacate an arbitration award, may be commenced in any court of competent jurisdiction. In the event that this arbitration agreement is for any reason held to be unenforceable, any litigation against the Company (except for small-claims court actions) may be commenced only in the federal or state courts located in San Francisco, California. You hereby irrevocably consent to the jurisdiction of those courts for such purposes.
              </p>
              <p>
                This Agreement, and any dispute between you and the Company, shall be governed by the laws of the state of California without regard to principles of conflicts of law, provided that this arbitration agreement shall be governed by the Federal Arbitration Act.
              </p>
              <p>
                If a suit is brought to enforce any of the provisions of this Agreement, the Service or this Website, the prevailing party shall be paid by the other party all of the prevailing party's costs and expenses of prosecuting and/or defending the suit, including, without limitation, the reasonable attorneys' fees, court costs and expenses of the prevailing party.
              </p>
              <p>
                You can decline this agreement to arbitrate by sending an arbitration opt-out letter to our email <a href="mailto:support@LastSeatTickets.com" className="text-brand-blue hover:underline">support@LastSeatTickets.com</a> within 30 days of first accepting these Terms.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-brand-red" />
              <h2 className="text-2xl font-bold text-gray-900">Lowest Fare Guarantee</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                We are so sure that our bulk private fares are unbeatable that we will give you a Low Fare Guarantee! As long as you call us within 24 hours from the purchase of your ticket and you provide us with a copy of the itinerary from any of our competitors which will include identical itinerary, including the fare basis and fare calculation information, we will match the price and send you $50 voucher to use towards your next purchase of any bulk private fares.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-brand-red" />
              <h2 className="text-2xl font-bold text-gray-900">Advertised Fare Guarantee</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                All the fares advertised on this website are guaranteed to be reasonably available within the specified travel period in the fare restrictions. If the fare is not available, LastSeatTickets will honor the advertised fare and sell the fare at the advertised level. All clients unable to book any advertised special through one of LastSeatTickets travel agents or seeking for a "Lowest Fare Guarantee" $50-voucher, can email LastSeatTickets at <a href="mailto:support@LastSeatTickets.com" className="text-brand-blue hover:underline">support@LastSeatTickets.com</a> or call toll-free at <a href="tel:+18886026667" className="text-brand-blue hover:underline">+1 888-602-6667</a>.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Fraud Prevention Measures</h2>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                LastSeatTickets LLC, as a leading consolidator to Africa, is committed to offer competitive fares to our customers residing in the US. We know many of our customers have relatives and friends abroad who may want to visit our customers in the US or even relocate permanently. That is why we offer competitive one-way and round-trip fares from a wide selection of departure points abroad. Recently, some of our customers have become victims of a scam.
              </p>
              <p>
                Scammers are increasingly sophisticated, and it no longer takes a "fool" to be a victim. Perpetrators of fraudulent campaigns invest careful time with their victims, setting up a relationship of trust, confidence and if possible, even romantic involvement. Once a close relationship is established, a request or plea for help is usually made. Typically, a state of emergency is created and our clients are asked for help with visa, airline ticket, a large inheritance, or other legal problems.
              </p>
              <p>
                It is possible to have a real, honest and lasting relationship with someone from abroad. Nevertheless, no matter where you met and what the circumstances are, we strongly encourage all our customers to be cautious when purchasing tickets for individuals residing abroad. Due to the extreme level of scam activity in some countries, we strongly advise a background check.
              </p>
              <p>
                LastSeatTickets LLC requires credit card verifications for all third party credit card transactions. It protects us against daily fraud attempts. We are very unhappy to learn about any fraud that affects our customers. This is why we are sharing this recent experience with you – our customers. We hope that this information is helpful and wish your friends and relatives a safe flight and satisfying stay in the US.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Billing Information</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                Please note: The billing address must match exactly the address on the credit card statement. Those customers who wish to purchase tickets for relatives or friends will be contacted by an LastSeatTickets LLC billing support representative to initiate a three way call to authorise the purchase directly with the issuing bank. Some credit and/or debit cards may have daily limits; please ensure with your bank that you have sufficient funds for the purchase of your ticket(s). The fares are not guaranteed until the tickets are issued.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Itinerary Information</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                The names of the passengers provided must match the names shown on the passports. Once the tickets are issued, they are non-transferable. Even a small mistake in the name can cause a major inconvenience for the passengers during their travel. Sometimes this mistake can even prevent the passengers from using their tickets. Remember that many of the deeply discounted fares are non-refundable.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Collecting Personal Data</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                The TSA (TRANSPORTATION SECURITY ADMINISTRATION) requires us to transmit information collected from you. Providing this information is mandatory. Issuing your tickets will not be possible without this information. TSA may share information you provide with law enforcement or intelligence agencies or others under its records notice. For more on TSA privacy policies or to view the records notice and the privacy impact assessment, see TSA's web site at <a href="https://www.tsa.gov" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">TSA.gov</a>.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Change Of Aircraft En Route</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                Sometimes you must change aircraft en route even though your ticket may show only one flight number and have only one coupon for that flight. Further, in the case of some travel, one of your flights may not be identified at the airport by the number on your ticket, or it may be identified by other flight numbers in addition to the one on your ticket. At your request, the seller of this ticket will give you details of your change of aircraft, such as where it will occur and what aircraft types are involved.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Travel Documents</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                Travel documents required for all tickets (paper, e-tickets, or paperless) include a valid Passport, which must be presented for all international flights. Some countries may require a visa and/or health card. It is the passenger's responsibility to have all necessary travel documents in possession at check-in. The passengers shall verify the visa requirements for all the stops as some of the countries may require a transit visa. Those passengers transiting via or connecting between the airports within the European Union – Schengen Zone may need a Schengen Entry visa. Travelling on a one-way ticket may be restricted. If you are travelling on a one-way ticket, it is your responsibility to make sure you are eligible. LastSeatTickets LLC agents do not advise passengers on visa requirements. Please contact the embassy of the country you are going to visit or transit through to get the up-to-date requirements.
              </p>
              <p>
                In addition, passport and visa information may be obtained by contacting the Travel Advisory Section of the U.S. State Department at +1 202 647 5225 or by visiting the State Department's Web site at <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">Travel.State.Gov</a>. Non-U.S. passport holders should be sure to contact the embassies of their destination and transit countries to obtain entrance requirements. To obtain medical information, you may contact the centres for Disease Control at +1 404 332 4559 or visit the CDC's Web site at <a href="https://www.cdc.gov" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">CDC.gov</a>.
              </p>
              <p>
                LastSeatTickets LLC has partnered with VisaHQ to help you with Visas and Passports at discount rates. If you need a Visa or a Passport, please, use VisaHQ services. Please note: LastSeatTickets and LastSeatTickets LLC will not be responsible for any services and information provided by VisaHQ as we are not a source or supplier of these services and acts solely as an agent for the actual suppliers of such services.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">General Rules and Conditions</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Fare Restrictions and Rules</h3>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <h4 className="font-semibold text-gray-900 mb-2">Cancellations and Refunds</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Cancellation and refunds before departure not permitted.</li>
                <li>Cancellation and refunds after departure not permitted.</li>
              </ul>

              <h4 className="font-semibold text-gray-900 mb-2">Exchanges</h4>
              <ul className="list-disc pl-6 mb-4">
                <li>Changes before departure not permitted.</li>
                <li>Changes after departure not permitted.</li>
                <li>The above confirmed tickets are non-reroutable and non-transferable.</li>
              </ul>

              <p>
                If fare rules allow refunds and/or exchanges, a $250.00 LastSeatTickets LLC fee will be charged to process any refund and/or exchange request. This fee will be collected in addition to the penalties charged directly by the airline and/or recalled by the airline from LastSeatTickets LLC (recalled commissions). Reservations for tickets to be refunded and/or exchanged must be cancelled at least 24 hours prior to scheduled departure – NO SHOW ticket(s) will not be processed for refund and/or exchange. Cancellation of reservation does not automatically initiate refund. All exchanges can be made only prior to scheduled departure. All exchanges are subject to fare difference and fare rules applicable on the date of change.
              </p>
              <p>
                After the tickets are issued, any changes or refunds are subject to the restrictions of the fares used. Generally speaking, discounted fares are more restrictive and in many cases, they are non-refundable and non-exchangeable. Please pay attention to the fare restrictions of your tickets. If you need more flexibility with your tickets in terms of refunds and exchanges, please consult your agent and request a less restrictive fare. Airlines offer a wide range of fares, including those that offer exchanges and refunds without any restrictions and penalties. The airlines strictly follow their policies and do not permit exchanges or refunds in case the fare restrictions do not allow it. The airlines determine the restrictions of the fares, and LastSeatTickets LLC has no power to override these restrictions.
              </p>
              <p>
                The airlines change their fares and the availability of the seats on a daily basis. Most airlines file their fares with the Airline Tariff Publishing Company. These file updates can occur several times a day. The airlines manage their seat inventory through their reservation systems. In most cases, they decrease or increase the seat inventory (and thus the fare availability) based on many factors which may include for example reservation cancellations or load factor on certain flights. LastSeatTickets LLC cannot predict the fare value nor can it guarantee that the airlines will not release cheaper seat inventory. Once the tickets are issued, they are subject to fare restrictions.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Baggage Information</h3>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                The airline(s) may require you to pay additional fees at the airport if your baggage exceeds certain limitations, such as the number, weight, size, and dimensions of your bags. Some airlines do not offer any free baggage allowance. Baggage allowance policies and baggage fees associated with checked or carry-on baggage vary widely and are subject to change by the airlines at any time. Be advised to check directly with the airline for the latest baggage allowance information.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Conditions</h3>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                LastSeatTickets LLC strongly recommends travel insurance. At this time the flight departure and arrival times are correct. However, airlines frequently change times and/or flight numbers. LastSeatTickets LLC is not responsible for any schedule changes. Please, contact the airlines to verify the current flight information and reconfirm your flights 72 hours prior to your scheduled departure. Failure to use any reservations may result in an automatic cancellation of all continuing and return reservations and suspension of the tickets; contact LastSeatTickets LLC or the airline prior to your scheduled departure to cancel your existing reservation and retain the original value of the ticket if applicable. Check-in time recommended for all international flights is a minimum of 3 hours, even if you are travelling on a domestic carrier to another airport and connecting to your international flight. Travel documents required for all tickets (paper, e-tickets, or paperless) include a valid Passport, which must be presented for all international flights. Some countries may require a Visa and/or health card. It is the passenger's responsibility to have all necessary travel documents in the possession at check-in. In the event of non-reconfirmation, or visa/passport issues, LastSeatTickets LLC shall not be responsible for denied boarding. LastSeatTickets LLC is not responsible for transportation to and from airports and between airports and does not provide hotel accommodation.
              </p>
              <p>
                Once the tickets are issued, LastSeatTickets LLC is unable to make any changes. All changes are subject to fare restrictions and rules once the tickets are issued. LastSeatTickets LLC reserves the right to charge service fees already included in the above total. The customer understands all the stipulations, rules and conditions pertaining to the purchased tickets. The fares are not guaranteed until ticketed. To view your itinerary at any time, please use the following link <a href="https://viewtrip.travelport.com/" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">https://viewtrip.travelport.com/</a> and your confirmation.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Liability Waiver</h3>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                I understand that LastSeatTickets LLC is not the source or supplier of the travel services I have requested, and acts solely as an agent for the actual suppliers of such services. I have been advised that the suppliers whose names appear in the information supplied to me are those who are actually responsible for providing the travel services I have purchased. I consent to and request the use of those suppliers and agree not to hold LastSeatTickets LLC responsible should any of these suppliers:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Fail to provide the travel services I have purchased;</li>
                <li>Fail to comply with any applicable law;</li>
                <li>Engage in any negligent act or omission that causes me any sort of injury, damage, delay or inconvenience.</li>
              </ul>
              <p>
                I accept that LastSeatTickets LLC is not responsible for, nor will I attempt to hold it liable for, any injury, damage or loss I may suffer on account of any conditions, actions or omissions that are beyond its reasonable control. I have been advised to use a credit card as this may offer me the opportunity to dispute the charge should a vendor cease operating. I understand that I may purchase travel insurance to cover certain risks inherent in travel such as supplier bankruptcy and the inability to travel due to a medical or personal emergency. LastSeatTickets LLC does not provide or sell travel insurance.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Credit Card Chargebacks</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                You have the ability to dispute charges with credit card companies ("chargebacks"). If you have a question about a charge on your credit card statement, we encourage you to call LastSeatTickets prior to disputing a charge with your credit card company so we may discuss and answer any questions or concerns you may have about our charges. In all cases, LastSeatTickets will work with you in resolving your concerns. LastSeatTickets retains the right to dispute any chargeback that it believes is improper, as described more fully below. LastSeatTickets also retains the right to fully cancel any booking in the event of a chargeback related to that booking. LastSeatTickets deems the following chargeback scenarios as improper and retains the right to investigate and rebut any such chargeback claims and to recover costs of such chargeback claims from you.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Chargebacks resulting from non-cancellable bookings in the event that LastSeatTickets or the airline cannot provide a refund, whether or not the booking is used.</li>
                <li>Chargebacks resulting from charges authorized by family, friends, associates or other third parties with direct access to your credit card.</li>
                <li>Chargebacks arising from the airline's failure to deliver a product or service in a manner that's consistent with the airline's product description.</li>
                <li>Chargebacks resulting from force majeure or other circumstances that are beyond the control of LastSeatTickets.</li>
                <li>Chargebacks related to the services or products that have been used fully or partially by you.</li>
              </ul>
              <p>
                For greater certainty, we may, in accordance with the Privacy Policy, use information relating to you, including recordings of customer service calls, to dispute chargeback claims from you. You hereby unconditionally authorize LastSeatTickets LLC to charge your credit card (and / or retain from your customer's account) with the amount of any chargeback processed by the bank and related to the services or products that have been used fully or partially by you. You hereby unconditionally authorize LastSeatTickets LLC to charge your credit card (and / or retain from your customer's account) with the amount of any chargeback fees applied by the bank to the chargeback requested by you without merits and subsequently rejected by the bank.
              </p>
            </div>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">COVID-19 WAIVER OF LIABILITY</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p>
                You agree that it is your personal decision to travel, and you are doing so with full knowledge of current travel recommendations and travel restrictions with regards to the risks of COVID-19. We assume no responsibility for and shall not be liable for unsafe conditions or health hazards including pandemics or other illnesses. We have no special knowledge of dangers during travel or at destinations. For information related to such dangers, we recommend going to the State Department travel website at <a href="http://www.travel.state.gov" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">www.travel.state.gov</a>, click on "Find International travel Information" then click on "Country Information", and fill in the name of the destination country. For medical and health information, we recommend going to the Centers for Disease Control website at <a href="http://www.cdc.gov/travel" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">www.cdc.gov/travel</a>, then click on "Destinations" and scroll to the name of the destination country.
              </p>
              <p>
                We have no responsibility for COVID-19-related requirements that travel suppliers and governments may impose from time to time, such as health affidavit forms, health screenings prior to departure or upon arrival, face coverings, or quarantines. For the latest COVID-19 government travel regulations, we recommend going to IATA's website at <a href="https://www.iatatravelcentre.com/international-travel-document-news/1580226297.htm" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">https://www.iatatravelcentre.com/international-travel-document-news/1580226297.htm</a>. For the latest travel supplier requirements, check the supplier's home page.
              </p>
              <p>
                We are not responsible for the acts or omissions of travel suppliers or their failure to adhere to their own schedules, provide services or refunds, financial default, or failure to honor future trip credits. We have no special knowledge regarding the financial condition of the suppliers, and we have no liability for recommending a trip credit in lieu of a refund. If requested, we will assist with obtaining any refunds due or rebooking trips using future credits, but we may charge a nonrefundable fee for such services. You agree to hold us harmless for your election not to purchase travel insurance or for any denial of claim by travel insurer as it relates to COVID-19 or any other claim under the policy.
              </p>
              <p className="font-bold uppercase">
                YOU HEREBY EXPRESSLY ASSUME ALL OF THE RISKS AND DANGERS DESCRIBED ABOVE, AND YOU HEREBY EXPRESSLY AGREE TO FOREVER RELEASE, DISCHARGE AND HOLD US, AND OUR AGENTS, EMPLOYEES, OFFICERS, DIRECTORS, ASSOCIATES, AFFILIATED COMPANIES, GUIDES, GROUP LEADERS, AND SUBCONTRACTORS HARMLESS AGAINST ANY AND ALL LIABILITY, ACTIONS, CAUSES OF ACTIONS, SUITS, CLAIMS, AND DEMANDS OF ANY AND EVERY KIND AND NATURE WHATSOEVER WHICH YOU NOW HAVE OR WHICH MAY HEREAFTER ARISE OUT OF OR IN CONNECTION WITH THESE RISKS AND DANGERS.
              </p>
            </div>
          </section>

          <div className="border-t pt-8 text-center">
            <p className="text-gray-600 text-sm">
              Last updated: October 28, 2025
            </p>
            <p className="text-gray-600 text-sm mt-2">
              For questions about these Terms & Conditions, please contact us at{' '}
              <a href="mailto:support@LastSeatTickets.com" className="text-brand-blue hover:underline">
                support@LastSeatTickets.com
              </a>
            </p>
          </div>
        </div>
      </div>
      </div>
      <AIAssistant />
      <Footer />
    </>
  );
}
