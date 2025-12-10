"use client";

import React, { useState } from "react";
import { Check, Info } from "lucide-react";
import { PaymentPlan, Property } from "@/lib/types";
import { paymentPlanOptions, calculateDiscountedPrice, formatCurrency } from "@/lib/data/mock";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

export interface PaymentPlanSelectorProps {
  property: Property;
  onPlanSelect: (plan: PaymentPlan) => void;
  selectedPlan?: PaymentPlan;
}

export const PaymentPlanSelector: React.FC<PaymentPlanSelectorProps> = ({
  property,
  onPlanSelect,
  selectedPlan,
}) => {
  const [hoveredPlan, setHoveredPlan] = useState<PaymentPlan | null>(null);

  const availablePlans = paymentPlanOptions.filter((planOption) =>
    property.paymentPlans.includes(planOption.plan)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Select Payment Plan</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Info className="w-4 h-4" />
          <span>Save more with longer plans</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {availablePlans.map((planOption) => {
          const isSelected = selectedPlan === planOption.plan;
          const isHovered = hoveredPlan === planOption.plan;
          const { totalPrice, discount, monthlyEquivalent } = calculateDiscountedPrice(
            property.price,
            planOption.plan
          );

          return (
            <button
              key={planOption.plan}
              onClick={() => onPlanSelect(planOption.plan)}
              onMouseEnter={() => setHoveredPlan(planOption.plan)}
              onMouseLeave={() => setHoveredPlan(null)}
              className="text-left"
            >
              <Card
                variant="bordered"
                padding="md"
                className={`relative transition-all h-full ${
                  isSelected
                    ? "border-2 border-primary shadow-lg scale-105"
                    : isHovered
                    ? "border-primary/50 shadow-md"
                    : "hover:shadow-md"
                }`}
              >
                {/* Selected Checkmark */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="mb-3">
                    <Badge variant="success" size="sm">
                      Save {discount}%
                    </Badge>
                  </div>
                )}

                {/* Plan Label */}
                <div className="mb-2">
                  <h4 className="text-base font-semibold text-gray-900">
                    {planOption.label}
                  </h4>
                  <p className="text-xs text-gray-600">
                    Pay for {planOption.totalMonths} month{planOption.totalMonths !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Pricing */}
                <div className="space-y-1">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(totalPrice, property.currency)}
                    </span>
                  </div>
                  {discount > 0 ? (
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 line-through">
                        {formatCurrency(property.price * planOption.totalMonths, property.currency)}
                      </div>
                      <div className="text-sm text-gray-700">
                        {formatCurrency(monthlyEquivalent, property.currency)}/month
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">/month</div>
                  )}
                </div>

                {/* Benefits */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Check className="w-3 h-3 text-success" />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Check className="w-3 h-3 text-success" />
                    <span>Flexible cancellation</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center gap-2 text-xs text-success font-medium">
                      <Check className="w-3 h-3" />
                      <span>Save {formatCurrency(property.price * planOption.totalMonths - totalPrice, property.currency)}</span>
                    </div>
                  )}
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Selected Plan Summary */}
      {selectedPlan && (
        <Card variant="elevated" padding="md" className="bg-primary/5 border-l-4 border-primary">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Selected Plan</h4>
              <p className="text-sm text-gray-700">
                {paymentPlanOptions.find((p) => p.plan === selectedPlan)?.label} -{" "}
                {formatCurrency(
                  calculateDiscountedPrice(property.price, selectedPlan).totalPrice,
                  property.currency
                )}
              </p>
              {calculateDiscountedPrice(property.price, selectedPlan).discount > 0 && (
                <p className="text-sm text-success font-medium mt-1">
                  You save {calculateDiscountedPrice(property.price, selectedPlan).discount}%!
                </p>
              )}
            </div>
            <Badge variant="success" icon={<Check className="w-3 h-3" />}>
              Selected
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
};
