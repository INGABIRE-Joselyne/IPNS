import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-sm">Last updated: January 2025</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-8 text-sm text-gray-600 leading-relaxed">
          {[
            {
              title: '1. Information We Collect',
              content: 'For pharmacy managers, we collect registration information including pharmacy name, email address, phone number, and location details. For patients using the search feature, we do not collect any personal information — searches are anonymous.'
            },
            {
              title: '2. How We Use Your Information',
              content: 'Pharmacy information is used to display your pharmacy on the network, manage your inventory, and connect you with patients searching for medicines. We do not sell or share your personal information with third parties.'
            },
            {
              title: '3. Data Security',
              content: 'We use industry-standard security measures including token-based authentication and encrypted connections (HTTPS) to protect your data. Passwords are hashed and never stored in plain text.'
            },
            {
              title: '4. Cookies',
              content: 'IPNS uses minimal cookies only for session management and authentication. We do not use tracking or advertising cookies.'
            },
            {
              title: '5. Patient Privacy',
              content: 'Patients using the medicine search feature do not need to create an account. No personal data is collected from patients during a search. Search queries are not linked to any individual.'
            },
            {
              title: '6. Data Retention',
              content: 'Pharmacy account data is retained as long as the account is active. You may request deletion of your account and associated data at any time by contacting support@ipns.rw.'
            },
            {
              title: '7. Changes to This Policy',
              content: 'We may update this Privacy Policy from time to time. We will notify registered pharmacy managers of significant changes via email.'
            },
            {
              title: '8. Contact',
              content: 'If you have any questions about this Privacy Policy, please contact us at info@ipns.rw or visit our Contact page.'
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

export default PrivacyPolicy;
