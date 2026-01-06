"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/about#team" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ],
  properties: [
    { name: "Browse Properties", href: "/properties" },
    { name: "Featured Listings", href: "/properties?featured=true" },
    { name: "Verified Properties", href: "/properties?verified=true" },
    { name: "List Your Property", href: "/list-property" },
  ],
  support: [
    { name: "Help Center", href: "/faq" },
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
  ],
};

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: '#D4F1E8' }}>
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Bronze Accent Wave */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: '#B87333' }}></div>

      <div className="max-w-[1760px] mx-auto px-6 sm:px-10 lg:px-20 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h3 className="font-serif font-bold text-3xl mb-4">
              <span className="text-gray-900">Tru</span>
              <span style={{ color: '#B87333' }}>Vade</span>
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed text-sm">
              Your trusted platform for secure, lawyer-verified property rentals in Nigeria.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Linkedin, href: "#" },
              ].map(({ Icon, href }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  whileHover={{ scale: 1.1, backgroundColor: '#B87333' }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gray-900/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Icon className="w-4 h-4 text-gray-900" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-base mb-6" style={{ color: '#B87333' }}>Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors inline-block hover:translate-x-1 transform duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Properties Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-base mb-6" style={{ color: '#B87333' }}>Properties</h4>
            <ul className="space-y-3">
              {footerLinks.properties.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors inline-block hover:translate-x-1 transform duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-base mb-6" style={{ color: '#B87333' }}>Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors inline-block hover:translate-x-1 transform duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Contact Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-300 pt-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#B87333' }}>
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Call us</p>
                <a href="tel:+2348012345678" className="text-gray-900 text-sm hover:text-gray-700 transition-colors">
                  +234 801 234 5678
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#B87333' }}>
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Email us</p>
                <a href="mailto:info@truvade.com" className="text-gray-900 text-sm hover:text-gray-700 transition-colors">
                  info@truvade.com
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#B87333' }}>
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Visit us</p>
                <span className="text-gray-900 text-sm">Marina Road, Lagos Island</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </footer>
  );
};
