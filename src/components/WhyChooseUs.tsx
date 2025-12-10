"use client";

import { motion } from "framer-motion";
import { Home, Users, Shield, TrendingUp, CheckCircle } from "lucide-react";

const stats = [
  { icon: Home, value: "500+", label: "Properties Listed" },
  { icon: Users, value: "2,000+", label: "Happy Tenants" },
  { icon: Shield, value: "50+", label: "Verified Lawyers" },
  { icon: TrendingUp, value: "98%", label: "Success Rate" },
];

const benefits = [
  "Every property verified by licensed lawyers",
  "Flexible payment plans with up to 10% discounts",
  "Secure payment processing with escrow protection",
  "Digital agreement signing for legal validity",
  "24/7 customer support for all users",
  "Transparent processes with no hidden fees",
  "Easy application and approval process",
  "Comprehensive property listings with detailed information",
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-20 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full text-sm font-medium text-accent mb-4">
            Our Track Record
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-black mb-12">
            Trusted by Thousands
          </h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors"
                >
                  <stat.icon className="w-8 h-8 text-primary" />
                </motion.div>
                <div className="font-serif font-bold text-4xl text-black mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-700">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
              About Vade Property
            </div>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-black">
              Making Property Rental
              <span className="block text-primary">Safe & Simple</span>
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed">
              Vade Property is revolutionizing property rental in Nigeria with lawyer-verified listings and flexible payment options. We ensure transparency, security, and peace of mind for both tenants and property owners.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Our platform connects verified users through a legally compliant process, protecting everyone involved while making the rental experience seamless and hassle-free.
            </p>
          </motion.div>

          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                <p className="text-gray-800 font-medium">{benefit}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
