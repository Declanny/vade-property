"use client";

import { motion } from "framer-motion";
import { Shield, CreditCard, FileCheck, Clock, Users, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Lawyer Verified",
    description: "Every property is verified by licensed lawyers for authenticity and legal compliance before listing.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Multiple payment options with escrow protection and transparent transactions for peace of mind.",
  },
  {
    icon: TrendingUp,
    title: "Flexible Payment Plans",
    description: "Choose from monthly, 3-month, 6-month, or annual plans with discounts up to 10% for longer commitments.",
  },
  {
    icon: FileCheck,
    title: "Digital Agreements",
    description: "Legally binding digital contracts reviewed and signed by lawyers for complete legal protection.",
  },
  {
    icon: Users,
    title: "Verified Tenants & Owners",
    description: "Background checks and KYC verification for all users ensure a safe and trustworthy community.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer service for tenants and property owners with immediate response times.",
  },
];

export default function TrustFeatures() {
  return (
    <section id="features" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-success/10 rounded-full text-sm font-medium text-success mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Trusted Platform
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-black mb-4">
            Why Choose Vade Property?
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We provide comprehensive security and convenience that protects both tenants and property owners throughout the rental process.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors"
              >
                <feature.icon className="w-8 h-8 text-primary" />
              </motion.div>

              <h3 className="font-serif font-bold text-xl text-black mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-700 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
