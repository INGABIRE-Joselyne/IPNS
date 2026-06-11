import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Have a question or want to get in touch? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reach Us Directly</h2>
              <p className="text-gray-500 leading-relaxed">
                Whether you're a pharmacy looking to join the network, a patient with a question,
                or a partner interested in collaboration — we're here to help.
              </p>
            </div>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex-shrink-0">
                  <Mail size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-500 text-sm mt-0.5">support@ipns.rw</p>
                  <p className="text-gray-500 text-sm">info@ipns.rw</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex-shrink-0">
                  <Phone size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <p className="text-gray-500 text-sm mt-0.5">+250 789 862 505</p>
                  <p className="text-gray-500 text-sm">Mon – Fri, 8am – 6pm</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex-shrink-0">
                  <MapPin size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Office</p>
                  <p className="text-gray-500 text-sm mt-0.5">KG 7 Ave, Kigali</p>
                  <p className="text-gray-500 text-sm">Rwanda</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <CheckCircle size={52} className="text-emerald-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-6 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Send a Message</h2>
                {[
                  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                  { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                  { id: 'subject', label: 'Subject', type: 'text', placeholder: 'How can we help?' },
                ].map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={field.id}>
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      required
                      value={form[field.id]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg font-semibold transition-colors text-sm"
                >
                  {loading ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <><Send size={16} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
