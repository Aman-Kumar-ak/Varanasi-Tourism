'use client';

export default function FeaturesSection() {
  const features = [
    {
      icon: '📅',
      title: 'Easy Online Booking',
      description: 'Simple and intuitive booking process. Book your Darshan in just a few clicks.',
    },
    {
      icon: '🔒',
      title: 'Secure Payment',
      description: 'Safe and secure payment gateway integration with Razorpay. Your transactions are protected.',
    },
    {
      icon: '🎫',
      title: 'Instant Receipt',
      description: 'Get your booking receipt instantly via email. Download PDF anytime from your account.',
    },
    {
      icon: '🗺️',
      title: 'City Guides',
      description: 'Comprehensive city information including hotels, restaurants, and places to visit.',
    },
  ];

  return (
    <section className="py-16 bg-background-parchment">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-primary-dark/70 max-w-2xl mx-auto">
            We make your spiritual journey smooth and hassle-free
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-primary-blue/5 hover:border-primary-blue/20"
            >
              <div className="text-6xl mb-6 text-center">{feature.icon}</div>
              <h3 className="text-xl font-bold text-primary-dark mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-primary-dark/70 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

