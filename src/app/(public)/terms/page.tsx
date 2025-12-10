import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { FileText } from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "December 10, 2025";

  return (
    <div className="bg-gray-50 py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="primary" size="lg" icon={<FileText className="w-4 h-4" />} className="mb-4">
              Legal
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms & Conditions
            </h1>
            <p className="text-lg text-gray-600">Last updated: {lastUpdated}</p>
          </div>

          <Card variant="elevated" padding="lg">
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using TruVade's platform, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Platform Services</h2>
                <p className="text-gray-700 mb-4">
                  TruVade provides a platform connecting property owners and tenants. We facilitate:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Lawyer-verified property listings</li>
                  <li>Secure payment processing</li>
                  <li>Digital agreement signing</li>
                  <li>Dispute mediation services</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
                <p className="text-gray-700 mb-4">
                  You are responsible for maintaining the confidentiality of your account credentials. You agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Update your information as needed</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Property Listings</h2>
                <p className="text-gray-700 mb-4">
                  Property owners must ensure all information provided is accurate and complete. TruVade reserves the right to remove listings that violate our policies or contain false information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payments and Fees</h2>
                <p className="text-gray-700 mb-4">
                  All payments are processed securely through our payment partners. Fees are clearly disclosed before transaction completion. Refunds are subject to our refund policy and applicable terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Lawyer Verification</h2>
                <p className="text-gray-700 mb-4">
                  While we engage licensed lawyers to verify properties, verification does not guarantee the condition or suitability of a property. Users are encouraged to conduct their own due diligence.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Prohibited Activities</h2>
                <p className="text-gray-700 mb-4">
                  Users must not:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Post false or misleading information</li>
                  <li>Engage in fraudulent activities</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Interfere with platform operations</li>
                  <li>Harass or discriminate against other users</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Dispute Resolution</h2>
                <p className="text-gray-700 mb-4">
                  In the event of disputes, parties agree to first attempt resolution through our mediation services. If mediation fails, disputes will be resolved through arbitration or courts in Lagos, Nigeria.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  TruVade is not liable for any indirect, incidental, or consequential damages arising from platform use. Our liability is limited to the amount of fees paid by you in the past 12 months.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated date. Continued use after changes constitutes acceptance of new terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
                <p className="text-gray-700">
                  For questions about these Terms & Conditions, contact us at:
                  <br />
                  Email: legal@vadeproperty.com
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
