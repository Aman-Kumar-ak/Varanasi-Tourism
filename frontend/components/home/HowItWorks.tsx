'use client';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Select Jyotirlinga & Darshan Type',
      description: 'Choose your preferred temple and darshan type (Sugam, Special, VIP)',
      icon: '🏛️',
    },
    {
      number: '2',
      title: 'Choose Date & Time Slot',
      description: 'Pick your preferred date and available time slot for Darshan',
      icon: '📅',
    },
    {
      number: '3',
      title: 'Login & Confirm Booking',
      description: 'Login with your phone number and confirm your booking details',
      icon: '📱',
    },
    {
      number: '4',
      title: 'Pay & Get Receipt',
      description: 'Complete payment securely and receive instant booking confirmation',
      icon: '💳',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
            How It Works
          </h2>
          <p className="text-lg text-primary-dark/70 max-w-2xl mx-auto">
            Book your Darshan in 4 simple steps
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-primary-blue/30" style={{ top: '3rem' }} />

            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center relative z-10 border border-primary-blue/5 hover:border-primary-blue/20">
                  {/* Step Number Circle */}
                  <div className="w-20 h-20 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <span className="text-3xl font-bold text-white">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className="text-5xl mb-6">{step.icon}</div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-primary-dark mb-4">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-primary-dark/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (Mobile) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <svg
                      className="w-6 h-6 text-primary-blue"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

