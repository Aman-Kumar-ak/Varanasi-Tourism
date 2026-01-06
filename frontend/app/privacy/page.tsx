'use client';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background-parchment">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-blue to-primary-teal text-white py-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            Your privacy is important to us
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 space-y-6">
            <div className="border-l-4 border-primary-gold pl-4">
              <p className="text-sm text-primary-dark/60">
                Last updated: January 2026
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary-dark">1. Introduction</h2>
              <p className="text-primary-dark/80 leading-relaxed">
                Welcome to Varanasi Tourism Guide. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary-dark">2. Information We Collect</h2>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-primary-dark">2.1 Information You Provide</h3>
                <p className="text-primary-dark/80 leading-relaxed">
                  We may collect information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside space-y-2 text-primary-dark/80 ml-4">
                  <li>Register for an account</li>
                  <li>Make a booking or reservation</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us through our contact forms</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
              </div>
              <div className="space-y-3 mt-4">
                <h3 className="text-xl font-semibold text-primary-dark">2.2 Automatically Collected Information</h3>
                <p className="text-primary-dark/80 leading-relaxed">
                  When you visit our website, we may automatically collect certain information about your device, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-primary-dark/80 ml-4">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Pages you visit and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Device information</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary-dark">3. How We Use Your Information</h2>
              <p className="text-primary-dark/80 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-primary-dark/80 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your bookings and transactions</li>
                <li>Send you updates, newsletters, and promotional materials</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Monitor and analyze usage patterns and trends</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary-dark">4. Information Sharing and Disclosure</h2>
              <p className="text-primary-dark/80 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-primary-dark/80 ml-4">
                <li>With service providers who assist us in operating our website and conducting our business</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary-dark">5. Data Security</h2>
              <p className="text-primary-dark/80 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary-dark">6. Your Rights</h2>
              <p className="text-primary-dark/80 leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-primary-dark/80 ml-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary-dark">7. Cookies and Tracking Technologies</h2>
              <p className="text-primary-dark/80 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary-dark">8. Third-Party Links</h2>
              <p className="text-primary-dark/80 leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary-dark">9. Children&apos;s Privacy</h2>
              <p className="text-primary-dark/80 leading-relaxed">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary-dark">10. Changes to This Privacy Policy</h2>
              <p className="text-primary-dark/80 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary-dark">11. Contact Us</h2>
              <p className="text-primary-dark/80 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-primary-gold/10 border-l-4 border-primary-gold p-4 rounded-lg">
                  <p className="text-primary-dark font-medium mt-2">Address: Varanasi Tourism Guide, Varanasi, Uttar Pradesh, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

