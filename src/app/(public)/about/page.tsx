import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Shield, Heart, TrendingUp, Users, CheckCircle } from "lucide-react";

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

  const stats = [
    { value: "500+", label: "Properties Listed" },
    { value: "2,000+", label: "Happy Tenants" },
    { value: "50+", label: "Verified Lawyers" },
    { value: "98%", label: "Success Rate" },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="accent" size="lg" className="mb-6">
              About TruVade
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
              Making Property Rental Safe, Secure, and Simple
            </h1>
            <p className="text-xl text-gray-100">
              We're revolutionizing property rental in Nigeria with lawyer-verified listings and flexible payment options.
            </p>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                TruVade was founded with a simple mission: to make property rental in Nigeria transparent, secure, and accessible to everyone. We recognized the challenges both tenants and property owners face - fraud, lack of legal protection, and complicated payment processes.
              </p>
              <p>
                By partnering with licensed lawyers to verify every property and offering flexible payment plans, we've created a platform that protects everyone involved. Our technology-driven approach ensures transparency while maintaining the human touch that's essential in real estate.
              </p>
              <p>
                Today, we're proud to serve thousands of tenants and property owners across Nigeria, providing a secure marketplace where trust is built into every transaction.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at TruVade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} variant="elevated" padding="lg" className="text-center">
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
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Why Choose Vade Property?
            </h2>
            <div className="space-y-4">
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
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
