import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Shield, Heart, TrendingUp, Users, CheckCircle, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Every property is verified by licensed lawyers to ensure legal compliance and authenticity.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "We prioritize your needs with transparent processes and dedicated support.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Leveraging technology to make property rental simple, secure, and accessible.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a trusted network of tenants, owners, and legal professionals.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero - Clean without background */}
      <section className="pt-16 pb-12">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="primary" size="lg" className="mb-6">
              About TruVade
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Making Property Rental{" "}
              <span className="text-primary">Safe, Secure, and Simple</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing property rental in Nigeria with lawyer-verified listings and flexible payment options.
            </p>
          </div>
        </Container>
      </section>

      {/* Image Section with Story */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div>
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/aboutusvade.png"
                  alt="TruVade Team"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Story Content */}
            <div>
              <Badge variant="success" size="lg" className="mb-4">
                Our Story
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Building Trust in Nigerian Real Estate
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  TruVade was founded with a simple mission: to make property rental in Nigeria transparent, secure, and accessible to everyone.
                </p>
                <p>
                  We recognized the challenges both tenants and property owners face - fraud, lack of legal protection, and complicated payment processes. By partnering with licensed lawyers to verify every property, we've created a platform that protects everyone involved.
                </p>
                <p>
                  Today, we're proud to serve thousands of tenants and property owners across Nigeria, providing a secure marketplace where trust is built into every transaction.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/properties">
                  <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Explore Properties
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <Badge variant="info" size="lg" className="mb-4">
              What Drives Us
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at TruVade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} variant="elevated" padding="lg" className="text-center hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="success" size="lg" icon={<CheckCircle className="w-4 h-4" />} className="mb-4">
                Why TruVade
              </Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose TruVade?
              </h2>
              <p className="text-lg text-gray-600">
                We go above and beyond to ensure your property rental experience is seamless
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Every property is verified by licensed lawyers for legal compliance",
                "Flexible payment plans with discounts for longer commitments",
                "Secure payment processing with escrow protection",
                "Digital agreement signing for convenience and legal validity",
                "24/7 customer support for tenants and property owners",
                "Transparent processes with no hidden fees",
                "Easy application and approval process",
                "Comprehensive property listings with detailed information",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(to right, var(--color-primary-dark) 0%, var(--color-primary) 15%, var(--color-primary) 85%, var(--color-primary-dark) 100%)" }}
      >
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-xl text-gray-100 mb-8">
              Join thousands of satisfied tenants who found their homes through our lawyer-verified platform
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/properties">
                <Button variant="accent" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Browse Properties
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
