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
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-primary-orange mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-primary-dark/70 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

