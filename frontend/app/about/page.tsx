'use client';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background-parchment">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-blue to-primary-teal text-white py-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            About Us
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            Your trusted guide to exploring Varanasi
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Mission Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-temple rounded-xl flex items-center justify-center shadow-temple">
                <span className="text-white font-bold text-2xl">🕉️</span>
              </div>
              <h2 className="text-3xl font-bold text-primary-dark">Our Mission</h2>
            </div>
            <p className="text-primary-dark/80 leading-relaxed text-lg">
              Varanasi Tourism Guide is dedicated to providing comprehensive, accurate, and inspiring information about Varanasi - one of the world's oldest continuously inhabited cities and a spiritual hub for millions. Our mission is to help travelers discover the rich cultural heritage, sacred sites, and unique experiences that make Varanasi a truly special destination.
            </p>
          </div>

          {/* What We Offer Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
            <h2 className="text-3xl font-bold text-primary-dark mb-6">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏛️</span>
                  <div>
                    <h3 className="font-semibold text-primary-dark text-lg">Comprehensive Guides</h3>
                    <p className="text-primary-dark/80">Detailed information about temples, ghats, monuments, and cultural sites</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🗺️</span>
                  <div>
                    <h3 className="font-semibold text-primary-dark text-lg">Route Planning</h3>
                    <p className="text-primary-dark/80">Easy-to-use transportation guides and route planners</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🛕</span>
                  <div>
                    <h3 className="font-semibold text-primary-dark text-lg">Spiritual Heritage</h3>
                    <p className="text-primary-dark/80">Information about Jyotirlingas and sacred pilgrimage sites</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <h3 className="font-semibold text-primary-dark text-lg">Booking Services</h3>
                    <p className="text-primary-dark/80">Convenient booking for temple visits and spiritual experiences</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Values Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
            <h2 className="text-3xl font-bold text-primary-dark mb-6">Our Values</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary-gold pl-4">
                <h3 className="font-semibold text-primary-dark text-xl mb-2">Respect for Culture</h3>
                <p className="text-primary-dark/80 leading-relaxed">
                  We honor and respect the deep spiritual and cultural significance of Varanasi, presenting information with reverence and accuracy.
                </p>
              </div>
              <div className="border-l-4 border-primary-saffron pl-4">
                <h3 className="font-semibold text-primary-dark text-xl mb-2">Accessibility</h3>
                <p className="text-primary-dark/80 leading-relaxed">
                  We believe travel information should be accessible to everyone, which is why we support multiple languages and provide comprehensive guides.
                </p>
              </div>
              <div className="border-l-4 border-primary-blue pl-4">
                <h3 className="font-semibold text-primary-dark text-xl mb-2">Accuracy</h3>
                <p className="text-primary-dark/80 leading-relaxed">
                  We strive to provide accurate, up-to-date information to help you plan your journey with confidence.
                </p>
              </div>
              <div className="border-l-4 border-primary-teal pl-4">
                <h3 className="font-semibold text-primary-dark text-xl mb-2">User Experience</h3>
                <p className="text-primary-dark/80 leading-relaxed">
                  We continuously work to improve our platform, making it easier and more enjoyable for travelers to discover Varanasi.
                </p>
              </div>
            </div>
          </div>

          {/* Why Varanasi Section */}
          <div className="bg-gradient-to-br from-primary-gold/10 to-primary-saffron/5 rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-primary-gold/20">
            <h2 className="text-3xl font-bold text-primary-dark mb-6">Why Varanasi?</h2>
            <p className="text-primary-dark/80 leading-relaxed text-lg mb-4">
              Varanasi, also known as Kashi or Banaras, is one of the seven holiest cities in Hinduism and Jainism. Situated on the banks of the sacred Ganges River, it has been a center of learning, culture, and spirituality for over 3,000 years.
            </p>
            <p className="text-primary-dark/80 leading-relaxed text-lg">
              The city is home to numerous temples, ghats, and sacred sites, including the famous Kashi Vishwanath Temple. It's a place where ancient traditions meet modern life, creating a unique atmosphere that draws millions of pilgrims and travelers each year.
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
            <h2 className="text-3xl font-bold text-primary-dark mb-6">Get in Touch</h2>
            <p className="text-primary-dark/80 leading-relaxed mb-6">
              Have questions, suggestions, or feedback? We'd love to hear from you!
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <h3 className="font-semibold text-primary-dark">Address</h3>
                  <p className="text-primary-dark/80">Varanasi Tourism Guide<br />Varanasi, Uttar Pradesh<br />India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Thank You Section */}
          <div className="text-center py-8">
            <p className="text-primary-dark/80 text-lg">
              Thank you for choosing Varanasi Tourism Guide for your journey. 🙏
            </p>
            <p className="text-primary-dark/60 mt-2">
              May your visit to Varanasi be filled with peace, discovery, and spiritual fulfillment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

