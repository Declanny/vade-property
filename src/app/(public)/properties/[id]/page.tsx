"use client";

import { useState, use } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Bed, Bath, Square, Star, Shield, CheckCircle, AlertCircle, ArrowLeft, Share2, Heart, Calendar } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PaymentPlanSelector } from "@/components/property/PaymentPlanSelector";
import { getPropertyById, formatCurrency, mockLawyers, calculateDiscountedPrice } from "@/lib/data/mock";
import { PaymentPlan } from "@/lib/types";

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const property = getPropertyById(propertyId);

  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<PaymentPlan | undefined>(
    property?.paymentPlans[0]
  );
  const [isFavorite, setIsFavorite] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Container>
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Not Found</h1>
            <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
            <Link href="/properties">
              <Button variant="primary">Back to Properties</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const verifyingLawyer = property.verifiedBy
    ? mockLawyers.find((l) => l.id === property.verifiedBy)
    : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <Container>
        {/* Back Button */}
        <Link href="/properties" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Properties</span>
        </Link>

        {/* Gallery */}
        <div className="mb-8">
          <PropertyGallery images={property.images} alt={property.title} />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Badges */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {property.verified && (
                  <Badge variant="success" icon={<Shield className="w-4 h-4" />}>
                    Lawyer Verified
                  </Badge>
                )}
                {property.featured && (
                  <Badge variant="accent" icon={<Star className="w-4 h-4 fill-current" />}>
                    Featured
                  </Badge>
                )}
                <Badge variant="gray" className="capitalize">
                  {property.type}
                </Badge>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {property.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{property.address}, {property.city}</span>
                </div>
                {property.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-warning fill-current" />
                    <span className="font-semibold">{property.rating.toFixed(2)}</span>
                    <span className="text-gray-500">({property.reviewCount} reviews)</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-[var(--radius-button)] hover:border-primary hover:text-primary transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-error text-error" : ""}`} />
                  <span>{isFavorite ? "Saved" : "Save"}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-[var(--radius-button)] hover:border-primary hover:text-primary transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Property Stats */}
            <div className="py-8 border-b border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{property.area}</div>
                  <div className="text-sm text-gray-600">{property.areaUnit}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {property.availableFrom ? new Date(property.availableFrom).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : "Now"}
                  </div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="py-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="py-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lawyer Verification */}
            {property.verified && verifyingLawyer && (
              <div className="py-8 border-b border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {verifyingLawyer.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified by Lawyer</h3>
                    <p className="text-gray-700 mb-2">
                      This property has been verified by <strong>{verifyingLawyer.name}</strong>, a licensed lawyer on our platform.
                    </p>
                    <p className="text-sm text-gray-600">
                      Verified on {property.verifiedAt ? new Date(property.verifiedAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Plans */}
            <PaymentPlanSelector
              property={property}
              onPlanSelect={setSelectedPaymentPlan}
              selectedPlan={selectedPaymentPlan}
            />
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card variant="elevated" padding="lg">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(property.price, property.currency)}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  {selectedPaymentPlan && selectedPaymentPlan !== "1_month" && (
                    <div className="text-sm text-success font-medium">
                      Save {calculateDiscountedPrice(property.price, selectedPaymentPlan).discount}% with {" "}
                      {selectedPaymentPlan.replace("_", " ")} plan
                    </div>
                  )}
                </div>

                {selectedPaymentPlan && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(
                        calculateDiscountedPrice(property.price, selectedPaymentPlan).totalPrice,
                        property.currency
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      for {selectedPaymentPlan.replace("_month", "").replace("_", " ")} {" "}
                      month{selectedPaymentPlan !== "1_month" ? "s" : ""}
                    </div>
                  </div>
                )}

                <Button variant="accent" size="lg" fullWidth>
                  Apply Now
                </Button>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span>Instant booking confirmation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span>Flexible cancellation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span>Secure payment</span>
                  </div>
                </div>
              </Card>

              {/* Contact Card */}
              <Card variant="bordered" padding="lg" className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about this property? Contact our support team.
                </p>
                <Link href="/contact">
                  <Button variant="ghost" size="md" fullWidth>
                    Contact Support
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>

        {/* Location Map - Full Width */}
        <div className="mt-12 py-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Where you'll be</h2>
          <div className="w-full h-[450px] rounded-lg overflow-hidden mb-6">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={`https://www.google.com/maps?q=${property.latitude},${property.longitude}&hl=es;z=14&output=embed`}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{property.city}, {property.state}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                {property.address}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                This property is located in {property.city}, a vibrant area with easy access to local amenities,
                transportation, and major business districts.
              </p>
            </div>
          </div>
        </div>

        {/* Meet Your Host */}
        <div className="mt-12 py-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Meet your host</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {property.ownerId.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Host</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-current" />
                  <span>{property.reviewCount} reviews</span>
                </div>
                {property.verified && (
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-success" />
                    <span>Verified host</span>
                  </div>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6">
                This property is managed by a verified host on TruVade. All properties are lawyer-verified
                to ensure legal compliance and authenticity. Your safety and satisfaction are our top priorities.
              </p>
              <Button variant="outline" size="md">
                Chat with host
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
