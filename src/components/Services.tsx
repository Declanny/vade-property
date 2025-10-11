"use client";

import { motion } from "framer-motion";
import { Users, Wrench, DollarSign, FileText, Shield, Phone } from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Tenant Screening",
    description: "Comprehensive background checks, credit verification, and reference checks to find reliable tenants.",
  },
  {
    icon: Wrench,
    title: "Maintenance & Repairs",
    description: "24/7 maintenance coordination with trusted contractors and vendors for all property needs.",
  },
  {
    icon: DollarSign,
    title: "Rent Collection",
    description: "Automated rent collection, late fee management, and financial reporting for property owners.",
  },
  {
    icon: FileText,
    title: "Lease Management",
    description: "Complete lease preparation, renewal management, and legal compliance for all properties.",
  },
  {
    icon: Shield,
    title: "Property Protection",
    description: "Regular property inspections, security monitoring, and insurance claim assistance.",
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description: "Round-the-clock customer service for tenants and property owners with immediate response.",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-black mb-4">
            Property Management Services
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            We provide comprehensive property management solutions that maximize your investment returns while minimizing your stress and workload.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 bg-milk-yellow-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-milk-yellow-200 transition-colors"
              >
                <service.icon className="w-8 h-8 text-milk-yellow-600" />
              </motion.div>

              <h3 className="font-serif font-bold text-xl text-black mb-3">
                {service.title}
              </h3>

              <p className="text-black leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="font-serif text-2xl font-bold text-black mb-4">
              Ready to Maximize Your Property Investment?
            </h3>
            <p className="text-black mb-6 max-w-md mx-auto">
              Let our expert property management team handle all the details while you enjoy passive income from your investments.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-black text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all duration-300"
            >
              Start Managing Your Property
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
