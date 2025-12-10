"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Shield, User, LogIn } from "lucide-react";
import { Button } from "../ui/Button";
import Logo from "../ui/Logo";
import { Container } from "./Container";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <Container>
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Logo variant="colored" size="md" showTagline={false} className="group-hover:opacity-90 transition-opacity" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="md" leftIcon={<User className="w-4 h-4" />}>
              Sign In
            </Button>
            <Button variant="accent" size="md" leftIcon={<LogIn className="w-4 h-4" />}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 mt-4 px-4">
              <Button variant="ghost" size="md" fullWidth leftIcon={<User className="w-4 h-4" />}>
                Sign In
              </Button>
              <Button variant="accent" size="md" fullWidth leftIcon={<LogIn className="w-4 h-4" />}>
                Get Started
              </Button>
            </div>
          </div>
        )}
      </Container>

      {/* Trust Badge Bar */}
      <div className="bg-primary-light/10 border-t border-primary/10">
        <Container>
          <div className="flex items-center justify-center py-2 gap-6 text-sm">
            <div className="flex items-center gap-2 text-primary">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Lawyer Verified Properties</span>
            </div>
            <div className="hidden sm:block text-gray-400">|</div>
            <div className="hidden sm:flex items-center gap-2 text-gray-700">
              <span>Secure Payments</span>
            </div>
            <div className="hidden sm:block text-gray-400">|</div>
            <div className="hidden sm:flex items-center gap-2 text-gray-700">
              <span>Flexible Payment Plans</span>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};
