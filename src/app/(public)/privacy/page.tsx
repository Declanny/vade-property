import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "December 10, 2025";

  return (
    <div className="bg-gray-50 py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="success" size="lg" icon={<Shield className="w-4 h-4" />} className="mb-4">
              Privacy
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">Last updated: {lastUpdated}</p>
          </div>

          <Card variant="elevated" padding="lg">
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  TruVade ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
                <p className="text-gray-700 mb-4">We collect information you provide directly:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Name, email address, phone number</li>
                  <li>Identification documents (for verification)</li>
                  <li>Employment and income information</li>
                  <li>Payment information</li>
                  <li>Property details (for owners)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 Automatically Collected Information</h3>
                <p className="text-gray-700 mb-4">When you use our platform, we automatically collect:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Device information and IP address</li>
                  <li>Browser type and version</li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and similar technologies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">We use collected information to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Provide and maintain our services</li>
                  <li>Process transactions and send confirmations</li>
                  <li>Verify user identity and prevent fraud</li>
                  <li>Communicate about services, updates, and promotions</li>
                  <li>Improve platform functionality and user experience</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
                <p className="text-gray-700 mb-4">We may share your information with:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Lawyers:</strong> For property verification and legal services</li>
                  <li><strong>Payment Processors:</strong> To process transactions securely</li>
                  <li><strong>Service Providers:</strong> Who assist in platform operations</li>
                  <li><strong>Law Enforcement:</strong> When required by law</li>
                  <li><strong>Other Users:</strong> Necessary information to facilitate transactions (e.g., property owners see tenant applications)</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Secure payment processing through certified providers</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Access controls and authentication</li>
                  <li>Staff training on data protection</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
                <p className="text-gray-700 mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data (subject to legal requirements)</li>
                  <li>Object to processing of your information</li>
                  <li>Withdraw consent where processing is based on consent</li>
                  <li>Export your data in a portable format</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  To exercise these rights, contact us at privacy@vadeproperty.com.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to enhance user experience, analyze usage, and deliver personalized content. You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
                <p className="text-gray-700 mb-4">
                  We retain your information for as long as necessary to provide services and comply with legal obligations. After account closure, we may retain certain information for audit, legal, or regulatory purposes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Our services are not intended for individuals under 18 years of age. We do not knowingly collect information from children. If you believe we have inadvertently collected such information, contact us immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
                <p className="text-gray-700 mb-4">
                  Your information may be transferred to and processed in countries other than Nigeria. We ensure appropriate safeguards are in place for such transfers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Privacy Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy periodically. Changes will be posted on this page with an updated date. Significant changes will be communicated via email or platform notification.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
                <p className="text-gray-700">
                  For questions about this Privacy Policy or our data practices:
                  <br />
                  Email: privacy@vadeproperty.com
                  <br />
                  Phone: +234 801 234 5678
                  <br />
                  Address: 15 Marina Road, Lagos Island, Lagos, Nigeria
                </p>
              </section>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
