"use client";

import Link from "next/link";
import { ArrowRight, Shield, CheckCircle, Search, FileCheck, Key, TrendingUp, Users, Home as HomeIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PropertyCard } from "@/components/property/PropertyCard";
import { getFeaturedProperties, mockLawyers } from "@/lib/data/mock";

export default function HomePage() {
  const featuredProperties = getFeaturedProperties();

  const stats = [
    { label: "Properties Listed", value: "500+", icon: HomeIcon },
    { label: "Happy Tenants", value: "2,000+", icon: Users },
    { label: "Verified Lawyers", value: "50+", icon: Shield },
    { label: "Success Rate", value: "98%", icon: TrendingUp },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Browse Properties",
      description: "Explore our curated collection of lawyer-verified properties across Nigeria.",
      icon: Search,
    },
    {
      step: 2,
      title: "Apply & Get Verified",
      description: "Submit your application with required documents. Our lawyers verify everything.",
      icon: FileCheck,
    },
    {
      step: 3,
      title: "Sign Agreement",
      description: "Digital agreement signing with legal protection for both tenant and owner.",
      icon: CheckCircle,
    },
    {
      step: 4,
      title: "Move In Securely",
      description: "Pay securely with flexible plans and move into your verified property.",
      icon: Key,
    },
  ];

  const trustFeatures = [
    {
      title: "Lawyer Verified",
      description: "Every property is verified by licensed lawyers for authenticity and legal compliance.",
      icon: Shield,
    },
    {
      title: "Secure Payments",
      description: "Multiple payment options with escrow protection and transparent transactions.",
      icon: CheckCircle,
    },
    {
      title: "Flexible Plans",
      description: "Choose payment plans that work for you - monthly, quarterly, or annually with discounts.",
      icon: TrendingUp,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-primary pt-20 pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Badge */}
            <div className="flex justify-center mb-8">
              <Badge variant="accent" size="lg" icon={<Shield className="w-4 h-4" />}>
                All Properties Verified by Licensed Lawyers
              </Badge>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect Home with
              <span className="text-accent block mt-2">Legal Protection</span>
            </h1>

            <p className="text-xl text-gray-100 mb-10 max-w-2xl mx-auto">
              Secure, verified properties with flexible payment plans. Every listing is lawyer-verified for your peace of mind.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/properties">
                <Button variant="accent" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Browse Properties
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <div className="flex justify-center mb-2">
                      <Icon className="w-8 h-8 text-accent" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-200">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <Badge variant="primary" size="lg" className="mb-4">
              Featured Listings
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Handpicked Properties for You
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our selection of verified properties with flexible payment options
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredProperties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/properties">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                View All Properties
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Trust Section - Lawyer Verification */}
      <section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-12">
            <Badge variant="success" size="lg" icon={<Shield className="w-4 h-4" />} className="mb-4">
              Legal Verification
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Every Property is Lawyer Verified
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our network of licensed lawyers verifies every property listing to protect your investment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {trustFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} variant="elevated" padding="lg" className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>

          {/* Lawyer Profiles */}
          <Card variant="bordered" padding="lg" className="bg-primary/5">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Meet Our Legal Team</h3>
              <p className="text-gray-600">Licensed lawyers ensuring your property transactions are secure</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockLawyers.map((lawyer) => (
                <div key={lawyer.id} className="flex items-center gap-4 bg-white p-4 rounded-[var(--radius-button)]">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {lawyer.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{lawyer.name}</h4>
                    <p className="text-sm text-gray-600">{lawyer.email}</p>
                    <Badge variant="success" size="sm" icon={<CheckCircle className="w-3 h-3" />} className="mt-2">
                      Verified Lawyer
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <Badge variant="info" size="lg" className="mb-4">
              Simple Process
            </Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From browsing to moving in, we make renting secure and hassle-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative">
                  <Card variant="elevated" padding="lg" className="text-center h-full">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {step.step}
                    </div>
                    <div className="flex justify-center mb-4 mt-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </Card>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
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
                  Start Browsing
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
