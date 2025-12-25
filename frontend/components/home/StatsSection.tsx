'use client';

export default function StatsSection() {
  const stats = [
    {
      number: '12',
      label: 'Jyotirlingas',
      icon: '🏛️',
    },
    {
      number: '1000+',
      label: 'Successful Bookings',
      icon: '✅',
    },
    {
      number: '5000+',
      label: 'Happy Devotees',
      icon: '🙏',
    },
    {
      number: '8',
      label: 'Cities Covered',
      icon: '🗺️',
    },
  ];

  return (
    <section className="py-16 bg-background-parchment">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-primary-blue/5 hover:border-primary-blue/20"
            >
              <div className="text-5xl mb-4">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-bold text-primary-orange mb-3">
                {stat.number}
              </div>
              <div className="text-base md:text-lg text-primary-dark/80 font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

