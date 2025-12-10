"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs: FAQItem[] = [
    {
      category: "General",
      question: "What is TruVade?",
      answer: "TruVade is a lawyer-verified property rental platform in Nigeria. We ensure every property listing is legally verified by licensed lawyers, offering secure transactions and flexible payment plans for tenants and property owners.",
    },
    {
      category: "General",
      question: "How does lawyer verification work?",
      answer: "Every property listed on our platform undergoes verification by licensed lawyers. They review ownership documents, title deeds, and ensure legal compliance before a property can be listed as 'verified'. This protects both tenants and owners from fraud.",
    },
    {
      category: "For Tenants",
      question: "How do I apply for a property?",
      answer: "Browse our verified properties, select one you like, choose your preferred payment plan, and click 'Apply Now'. You'll need to provide identification documents and employment information. Our team will review your application and get back to you within 24-48 hours.",
    },
    {
      category: "For Tenants",
      question: "What payment plans are available?",
      answer: "We offer flexible payment plans: monthly, 3-month, 6-month, and 12-month options. Longer payment plans come with discounts - save up to 10% with annual payment! Choose the plan that works best for your budget.",
    },
    {
      category: "For Tenants",
      question: "Are payments secure?",
      answer: "Yes, all payments are processed through secure payment gateways (Stripe, Paystack). We offer escrow protection where applicable, and you'll receive official receipts for all transactions. Your financial information is encrypted and never stored on our servers.",
    },
    {
      category: "For Owners",
      question: "How do I list my property?",
      answer: "Sign up as a property owner, submit your property details along with ownership documents. Our team will assign a lawyer to verify your property. Once verified (usually 3-5 business days), your property will be live on our platform.",
    },
    {
      category: "For Owners",
      question: "What documents do I need to list a property?",
      answer: "You'll need: property ownership documents (title deed or certificate of occupancy), valid ID, recent utility bills, property images, and any relevant permits. Our lawyers will guide you through the specific requirements based on your property type and location.",
    },
    {
      category: "For Owners",
      question: "How do I receive payments?",
      answer: "Tenant payments are processed securely and transferred to your registered bank account. You can set up automatic payouts or withdraw manually. We deduct a small service fee and provide detailed transaction reports.",
    },
    {
      category: "Legal & Safety",
      question: "What happens if there's a dispute?",
      answer: "Our legal team mediates disputes between tenants and owners. We have clear terms and conditions, and all agreements are digitally signed. If necessary, our lawyers can provide legal notices and assist with the resolution process.",
    },
    {
      category: "Legal & Safety",
      question: "Is the rental agreement legally binding?",
      answer: "Yes, all rental agreements on our platform are reviewed by lawyers and digitally signed using secure methods. They are legally binding and can be used as evidence in court if needed. You'll receive a copy for your records.",
    },
    {
      category: "Payments",
      question: "What payment methods do you accept?",
      answer: "We accept card payments (Visa, Mastercard), bank transfers, USSD, and mobile money. All payment methods are secure and you'll receive instant confirmation upon successful payment.",
    },
    {
      category: "Payments",
      question: "Can I get a refund?",
      answer: "Refunds are handled according to our refund policy and the specific terms of your rental agreement. Generally, refunds are available if a property becomes unavailable before move-in or if there are significant misrepresentations. Contact support for specific cases.",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  return (
    <div className="bg-gray-50 py-12">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="info" size="lg" icon={<HelpCircle className="w-4 h-4" />} className="mb-4">
            FAQ
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions about TruVade
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-[var(--radius-button)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* FAQs by Category */}
        <div className="max-w-4xl mx-auto space-y-8">
          {categories.map((category) => {
            const categoryFAQs = filteredFAQs.filter((faq) => faq.category === category);
            if (categoryFAQs.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{category}</h2>
                <div className="space-y-3">
                  {categoryFAQs.map((faq, index) => {
                    const globalIndex = faqs.indexOf(faq);
                    const isOpen = openIndex === globalIndex;

                    return (
                      <Card key={globalIndex} variant="bordered" padding="none" className="overflow-hidden">
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                            {faq.answer}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Still Have Questions? */}
        <Card variant="elevated" padding="lg" className="mt-12 max-w-3xl mx-auto text-center bg-primary/5">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Contact Support
            </Button>
          </Link>
        </Card>
      </Container>
    </div>
  );
}
