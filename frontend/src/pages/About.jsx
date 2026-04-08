import React from 'react';
import { Heart, Users, Target, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About IPNS</h1>
          <p className="text-xl text-gray-600">
            Connecting Rwandans with Life-Saving Medications
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            The Inter-Pharmacy Network System (IPNS) is designed to bridge the communication gap 
            between multiple pharmacy outlets and provide patients with real-time access to medicine 
            availability across Rwanda's districts.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            We believe that every Rwandan citizen deserves quick, reliable, and cost-effective 
            access to essential medicines. By eliminating "blind searches" and reducing unnecessary 
            travel between pharmacies, IPNS improves healthcare delivery and patient outcomes.
          </p>
        </div>

        {/* Core Values */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            {
              icon: <Heart className="text-emerald-600" size={32} />,
              title: 'Patient-Centered',
              description: 'We put patient needs first, making medicine access easy and accessible.',
            },
            {
              icon: <Zap className="text-emerald-600" size={32} />,
              title: 'Real-Time Data',
              description: 'Instant, accurate information about medicine availability and pharmacy status.',
            },
            {
              icon: <Users className="text-emerald-600" size={32} />,
              title: 'Collaboration',
              description: 'Fostering partnership between pharmacies to serve the community better.',
            },
            {
              icon: <Target className="text-emerald-600" size={32} />,
              title: 'Innovation',
              description: 'Using technology to solve real healthcare challenges in Rwanda.',
            },
          ].map((value, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-8"
            >
              <div className="mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Problem Section */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem We Solve</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex gap-3">
              <span className="text-red-600 font-bold mt-1">•</span>
              <span><strong>Stock Invisibility:</strong> Patients don't know which pharmacy has the medicine they need</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-600 font-bold mt-1">•</span>
              <span><strong>Emergency Delays:</strong> Time spent searching for unavailable medicines in critical situations</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-600 font-bold mt-1">•</span>
              <span><strong>Insurance Confusion:</strong> Patients visit pharmacies only to find they don't accept their insurance</span>
            </li>
            <li className="flex gap-3">
              <span className="text-red-600 font-bold mt-1">•</span>
              <span><strong>Wasted Resources:</strong> High transport costs and time spent on "blind searches"</span>
            </li>
          </ul>
        </div>

        {/* Solution Section */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Solution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-emerald-700 mb-3">🔍 Real-Time Search</h3>
              <p className="text-gray-600">Instantly find medicines and check pharmacy stock levels</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-700 mb-3">📍 Location-Based</h3>
              <p className="text-gray-600">Search by Province, District, or Sector for personalized results</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-700 mb-3">⏰ Status Updates</h3>
              <p className="text-gray-600">Know if pharmacies are open, closing soon, or closed in real-time</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-700 mb-3">💳 Insurance Integration</h3>
              <p className="text-gray-600">Filter results by insurance providers you're enrolled with</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">The Vision</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-12">
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              We envision a Rwanda where every citizen has instant access to medicine information, 
              where pharmacies collaborate seamlessly, and where "failed journeys" in search of 
              life-saving medications become a thing of the past.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              By 2025, we aim to reduce medicine search time by over 70% and establish IPNS as 
              the standard platform for medicine discovery across Rwanda's healthcare system.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">Join millions of Rwandans finding medicines faster</p>
          <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg transition-colors">
            Start Searching Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
