"use client";

import { motion } from "framer-motion";
import { Award, Users, Clock, TrendingUp } from "lucide-react";

const stats = [
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: Users, value: "10K+", label: "Happy Clients" },
  { icon: Clock, value: "24/7", label: "Support" },
  { icon: TrendingUp, value: "$500M+", label: "Properties Sold" },
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center px-4 py-2 bg-milk-yellow-100 rounded-full text-sm font-medium text-milk-yellow-800">
              About Vade Property
            </div>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-black">
              Your Trusted Partner in
              <span className="block text-black">Real Estate Excellence</span>
            </h2>

            <p className="text-lg text-black leading-relaxed">
              With over 15 years of experience in the real estate industry, Vade Property has been
              connecting people with their dream homes and investment opportunities. Our commitment
              to excellence, integrity, and personalized service has made us a trusted name in the market.
            </p>

            <p className="text-lg text-black leading-relaxed">
              We believe that finding the perfect property is more than just a transaction—it's about
              finding a place where memories are made and futures are built. Our expert team works
              tirelessly to ensure every client finds their ideal property match.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-black text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all duration-300"
            >
              Learn More About Us
            </motion.button>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-milk-yellow-50 rounded-2xl p-6 text-center group hover:bg-milk-yellow-100 transition-colors"
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-12 h-12 bg-milk-yellow-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-milk-yellow-300 transition-colors"
                >
                  <stat.icon className="w-6 h-6 text-milk-yellow-600" />
                </motion.div>
                <div className="font-serif font-bold text-2xl text-black mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-black">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-milk-yellow-50 rounded-2xl p-12">
            <h3 className="font-serif text-3xl font-bold text-black mb-6">
              Our Mission
            </h3>
            <p className="text-lg text-black max-w-3xl mx-auto leading-relaxed">
              To revolutionize the real estate experience by combining cutting-edge technology with
              personalized service, making property transactions seamless, transparent, and enjoyable
              for every client. We strive to build lasting relationships and create communities where
              people truly belong.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
