import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'What is IPNS?',
    answer: 'IPNS (Inter-Pharmacy Network System) is a platform that connects patients with pharmacies across Rwanda in real-time, allowing you to search for medicine availability, check pharmacy hours, and verify insurance acceptance.'
  },
  {
    question: 'Do I need to create an account to search for medicines?',
    answer: 'No. Patients can search for medicines freely without creating an account. Login is only required for pharmacy managers who need to manage their inventory.'
  },
  {
    question: 'How do I register my pharmacy?',
    answer: 'Click the "Register Pharmacy" button in the top navigation. Fill in your pharmacy details across 4 simple steps — basic info, location, operating hours & insurance, and password creation.'
  },
  {
    question: 'How do I update my pharmacy\'s medicine stock?',
    answer: 'After logging in as a pharmacist, go to your Dashboard and click "Manage Inventory". From there you can add, update, or remove medicines from your stock.'
  },
  {
    question: 'Which insurance providers are supported?',
    answer: 'IPNS currently supports RSSB, MMI, MIS UR, and Medicore. More insurance providers will be added over time.'
  },
  {
    question: 'What if a medicine I need is not found?',
    answer: 'If a medicine is not found, it means no connected pharmacy currently has it in stock. Try searching with a different name or the generic name of the medicine.'
  },
  {
    question: 'How do I contact support?',
    answer: 'You can reach us via the Contact page, by email at support@ipns.rw, or by phone at +250 788 000 000 during business hours (Mon–Fri, 8am–6pm).'
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">Help Center</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-500 text-lg">Everything you need to know about IPNS.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-sm pr-4">{faq.question}</span>
                {openIndex === i
                  ? <ChevronUp size={18} className="text-emerald-500 flex-shrink-0" />
                  : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                }
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-emerald-50 border border-emerald-100 rounded-2xl p-8">
          <p className="text-gray-700 font-semibold mb-2">Still have questions?</p>
          <p className="text-gray-500 text-sm mb-4">We're happy to help. Reach out to our support team.</p>
          <a
            href="/contact"
            className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
