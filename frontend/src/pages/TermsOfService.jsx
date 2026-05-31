import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-400 text-sm">Last updated: January 2025</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-8 text-sm text-gray-600 leading-relaxed">
          {[
            {
              title: '1. Acceptance of Terms',
              content: 'By accessing or using IPNS (Inter-Pharmacy Network System), you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.'
            },
            {
              title: '2. Use of the Platform',
              content: 'IPNS is intended for use by patients searching for medicines and pharmacy managers managing their inventory. You agree to use the platform only for lawful purposes and in a manner that does not infringe the rights of others.'
            },
            {
              title: '3. Pharmacy Registration',
              content: 'Pharmacies registering on IPNS must provide accurate and truthful information. IPNS reserves the right to suspend or remove any pharmacy account found to be providing false information.'
            },
            {
              title: '4. Accuracy of Information',
              content: 'Pharmacy managers are responsible for keeping their medicine stock, operating hours, and insurance information up to date. IPNS is not liable for any inconvenience caused by outdated information.'
            },
            {
              title: '5. Patient Use',
              content: 'Patients use the search feature at their own discretion. IPNS provides information about medicine availability but does not provide medical advice. Always consult a qualified healthcare professional before taking any medication.'
            },
            {
              title: '6. Intellectual Property',
              content: 'All content, logos, and software on IPNS are the property of IPNS and are protected by applicable intellectual property laws. You may not copy, reproduce, or distribute any content without written permission.'
            },
            {
              title: '7. Limitation of Liability',
              content: 'IPNS is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use or inability to use the platform, including but not limited to loss of data or business interruption.'
            },
            {
              title: '8. Changes to Terms',
              content: 'We reserve the right to modify these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new Terms.'
            },
            {
              title: '9. Contact',
              content: 'For questions about these Terms, contact us at info@ipns.rw.'
            },
          ].map((section, i) => (
            <div key={i}>
              <h2 className="text-gray-900 font-bold text-base mb-2">{section.title}</h2>
              <p>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
