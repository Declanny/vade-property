import React from "react";
import Link from "next/link";
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Container } from "./Container";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

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
      { name: "Safety", href: "/safety" },
      { name: "Report Issue", href: "/report" },
    ],
    legal: [
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Legal Notice", href: "/legal" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-primary text-white">
      <Container>
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 group mb-4">
                <div className="bg-accent p-2 rounded-lg group-hover:bg-accent-light transition-colors">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl font-bold text-white">Vade Property</span>
                  <span className="text-xs text-primary-light">Verified by Lawyers</span>
                </div>
              </Link>
              <p className="text-gray-300 text-sm mb-6">
                Your trusted platform for secure, lawyer-verified property rentals. Find your perfect home with flexible payment plans and peace of mind.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">15 Marina Road, Lagos Island, Lagos, Nigeria</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a href="tel:+2348012345678" className="text-gray-300 hover:text-accent transition-colors">
                    +234 801 234 5678
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a href="mailto:info@vadeproperty.com" className="text-gray-300 hover:text-accent transition-colors">
                    info@vadeproperty.com
                  </a>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-300 hover:text-accent transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Properties Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Properties</h3>
              <ul className="space-y-2">
                {footerLinks.properties.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-300 hover:text-accent transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-300 hover:text-accent transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-300 hover:text-accent transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-light py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-300">
              © {currentYear} Vade Property. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-300 hover:text-accent transition-colors"
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
