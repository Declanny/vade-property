"use client";

import React from "react";
import { Check } from "lucide-react";
import { PaymentPlan, Property } from "@/lib/types";
import { paymentPlanOptions, calculateDiscountedPrice, formatCurrency } from "@/lib/data/mock";

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
  const availablePlans = paymentPlanOptions.filter((planOption) =>
    property.paymentPlans.includes(planOption.plan)
  );

  return (
    <div className="py-8 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Plans</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {availablePlans.map((planOption) => {
          const isSelected = selectedPlan === planOption.plan;
          const { totalPrice, discount } = calculateDiscountedPrice(
            property.price,
            planOption.plan
          );

          return (
            <button
              key={planOption.plan}
              onClick={() => onPlanSelect(planOption.plan)}
              className={`w-full text-left px-4 py-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-primary bg-primary" : "border-gray-300"
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {planOption.label}
                        {discount > 0 && (
                          <span className="ml-2 text-sm text-success font-medium">
                            Save {discount}%
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(totalPrice, property.currency)} total
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
