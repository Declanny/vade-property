"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the map to avoid SSR issues
const ContactMap = dynamic(() => import("@/components/contact/ContactMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center min-h-[400px]">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    alert("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+234 801 234 5678", "+234 802 345 6789"],
      link: "tel:+2348012345678",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@truvade.com", "support@truvade.com"],
      link: "mailto:info@truvade.com",
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["15 Marina Road", "Lagos Island, Lagos, Nigeria"],
      link: null,
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-white/80">
              Have questions about finding your perfect property? Our team is here to help you every step of the way.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 -mt-20">
          {/* Contact Form Card */}
          <Card variant="elevated" padding="lg" className="h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Send Us a Message</h2>
                <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  fullWidth
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  fullWidth
                />
                <Input
                  label="Subject"
                  type="text"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="block w-full bg-white border border-gray-300 rounded-[var(--radius-button)] px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                rightIcon={<Send className="w-5 h-5" />}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>

          {/* Map and Contact Info */}
          <div className="space-y-6">
            {/* Map */}
            <Card variant="elevated" padding="none" className="overflow-hidden">
              <div className="h-[300px]">
                <ContactMap />
              </div>
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">TruVade Headquarters</p>
                    <p className="text-sm text-gray-600">15 Marina Road, Lagos Island, Lagos, Nigeria</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <Card key={info.title} variant="elevated" padding="md" className="hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm mb-1">{info.title}</h3>
                        <div className="space-y-0.5">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-sm text-gray-600 truncate">
                              {info.link && idx === 0 ? (
                                <a href={info.link} className="hover:text-primary transition-colors">
                                  {detail}
                                </a>
                              ) : (
                                detail
                              )}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600">Quick answers to common questions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                q: "How do I schedule a property viewing?",
                a: "You can schedule a viewing directly on any property listing page or contact us via phone or email."
              },
              {
                q: "What documents do I need to rent?",
                a: "Typically you'll need valid ID, proof of income, and references. Requirements may vary by property."
              },
              {
                q: "How long does the verification process take?",
                a: "Property verification usually takes 24-48 hours after all documents are submitted."
              },
            ].map((faq, idx) => (
              <Card key={idx} variant="bordered" padding="md">
                <h3 className="font-medium text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
