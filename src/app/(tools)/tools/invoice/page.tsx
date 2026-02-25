"use client";

import { useState } from "react";

interface LineItem {
  id: string;
  description: string;
  amount: number;
}

interface InvoiceData {
  // Sender details
  name: string;
  streetAddress: string;
  stateCountry: string;
  phone: string;
  email: string;
  tinNin: string;

  // Invoice metadata
  date: string;
  invoiceNo: string;

  // Service details
  servicePeriodStart: string;
  servicePeriodEnd: string;
  currency: string;
  currencySymbol: string;

  // Bill to
  billToName: string;
  billToRc: string;
  billToEmail: string;

  // Line items
  lineItems: LineItem[];

  // Tax
  taxRate: number;

  // Bank details
  bankName: string;
  accountName: string;
  accountNumber: string;

  // Remarks
  remarks: string;
}

const defaultInvoiceData: InvoiceData = {
  name: "Godwin Chisom Henry",
  streetAddress: "No. 44 Glover Street, Yaba",
  stateCountry: "Lagos, Nigeria",
  phone: "07083089127",
  email: "chisomhenryg@gmail.com",
  tinNin: "3793 608 4437",

  date: "31/01/2026",
  invoiceNo: "JAN-2026-01",

  servicePeriodStart: "01/01/2026",
  servicePeriodEnd: "31/01/2026",
  currency: "Nigerian Naira (₦)",
  currencySymbol: "₦",

  billToName: "McGrocer Nigeria Limited",
  billToRc: "8694345",
  billToEmail: "invoicequeries@mcgrocer.com",

  lineItems: [
    {
      id: "1",
      description:
        "Frontend Engineering Services for January 2026 — Contributed to McGrocer platform with primary focus on B2B project development as part of the McGrocer team.",
      amount: 400000,
    },
  ],

  taxRate: 0,

  bankName: "",
  accountName: "Godwin Chisom Henry",
  accountNumber: "",

  remarks: "Payment due upon receipt.",
};

export default function InvoicePage() {
  const [data, setData] = useState<InvoiceData>(defaultInvoiceData);

  const updateField = (field: keyof InvoiceData, value: string | number) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const updateLineItem = (
    id: string,
    field: "description" | "amount",
    value: string | number
  ) => {
    setData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addLineItem = () => {
    setData((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        { id: Date.now().toString(), description: "", amount: 0 },
      ],
    }));
  };

  const removeLineItem = (id: string) => {
    if (data.lineItems.length > 1) {
      setData((prev) => ({
        ...prev,
        lineItems: prev.lineItems.filter((item) => item.id !== id),
      }));
    }
  };

  const subtotal = data.lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = (subtotal * data.taxRate) / 100;
  const total = subtotal + taxAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header - hidden when printing */}
      <div className="no-print bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Invoice Generator</h1>
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Panel - hidden when printing */}
          <div className="no-print lg:w-1/3 space-y-6">
            {/* Sender Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Your Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={data.streetAddress}
                    onChange={(e) => updateField("streetAddress", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State, Country
                  </label>
                  <input
                    type="text"
                    value={data.stateCountry}
                    onChange={(e) => updateField("stateCountry", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={data.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    TIN/NIN
                  </label>
                  <input
                    type="text"
                    value={data.tinNin}
                    onChange={(e) => updateField("tinNin", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Metadata */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Invoice Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={data.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice No.
                  </label>
                  <input
                    type="text"
                    value={data.invoiceNo}
                    onChange={(e) => updateField("invoiceNo", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Period Start
                    </label>
                    <input
                      type="text"
                      value={data.servicePeriodStart}
                      onChange={(e) =>
                        updateField("servicePeriodStart", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Period End
                    </label>
                    <input
                      type="text"
                      value={data.servicePeriodEnd}
                      onChange={(e) =>
                        updateField("servicePeriodEnd", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={data.currency}
                    onChange={(e) => updateField("currency", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={data.currencySymbol}
                    onChange={(e) => updateField("currencySymbol", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Bill To</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={data.billToName}
                    onChange={(e) => updateField("billToName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RC Number
                  </label>
                  <input
                    type="text"
                    value={data.billToRc}
                    onChange={(e) => updateField("billToRc", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.billToEmail}
                    onChange={(e) => updateField("billToEmail", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Line Items</h2>
                <button
                  onClick={addLineItem}
                  className="px-3 py-1 text-sm bg-teal-100 text-teal-700 rounded-md hover:bg-teal-200 transition-colors"
                >
                  + Add Item
                </button>
              </div>
              <div className="space-y-4">
                {data.lineItems.map((item, index) => (
                  <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Item {index + 1}
                      </span>
                      {data.lineItems.length > 1 && (
                        <button
                          onClick={() => removeLineItem(item.id)}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={item.description}
                          onChange={(e) =>
                            updateLineItem(item.id, "description", e.target.value)
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount
                        </label>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              "amount",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Tax</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={data.taxRate}
                  onChange={(e) =>
                    updateField("taxRate", parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Bank Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={data.bankName}
                    onChange={(e) => updateField("bankName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your bank name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={data.accountName}
                    onChange={(e) => updateField("accountName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={data.accountNumber}
                    onChange={(e) => updateField("accountNumber", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your account number"
                  />
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Remarks</h2>
              <textarea
                value={data.remarks}
                onChange={(e) => updateField("remarks", e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Invoice Preview */}
          <div className="lg:w-2/3">
            <div className="bg-white shadow-lg print:shadow-none" id="invoice-preview">
              {/* A4 Invoice */}
              <div className="invoice-a4 w-full max-w-[210mm] mx-auto bg-white">
                {/* Teal Header */}
                <div className="bg-[#1A7F7F] text-white px-8 py-6">
                  <h1 className="text-4xl font-bold">INVOICE</h1>
                </div>

                {/* Main Content */}
                <div className="px-8 py-6">
                  {/* Top Section - Sender & Date */}
                  <div className="flex justify-between mb-6">
                    {/* Sender Details */}
                    <div className="text-sm text-gray-700 space-y-1">
                      <p className="font-medium text-gray-900">{data.name}</p>
                      <p>{data.streetAddress}</p>
                      <p>{data.stateCountry}</p>
                      <p>{data.phone}</p>
                      <p>{data.email}</p>
                      {data.tinNin && <p>TIN/NIN: {data.tinNin}</p>}
                    </div>

                    {/* Date & Invoice No */}
                    <div className="text-right text-sm">
                      <div className="mb-2">
                        <p className="font-semibold text-gray-900 border-b border-gray-300 pb-1">
                          DATE
                        </p>
                        <p className="pt-1">{data.date}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A7F7F]">
                          INVOICE NO.{" "}
                          <span className="text-[#1A7F7F]">{data.invoiceNo}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service Period & Bill To */}
                  <div className="flex justify-between mb-6 border-t border-gray-200 pt-4">
                    {/* Service Period */}
                    <div className="text-sm">
                      <p>
                        <span className="font-semibold">Service Period:</span>{" "}
                        <span className="text-[#1A7F7F]">
                          {data.servicePeriodStart} to {data.servicePeriodEnd}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold">Currency:</span>{" "}
                        <span className="text-[#1A7F7F]">{data.currency}</span>
                      </p>
                    </div>

                    {/* Bill To */}
                    <div className="text-sm text-right">
                      <p className="font-semibold text-gray-900 mb-1">BILL TO</p>
                      <p>{data.billToName}</p>
                      <p>RC: {data.billToRc}</p>
                      <p className="text-[#1A7F7F]">{data.billToEmail}</p>
                    </div>
                  </div>

                  {/* Description Table */}
                  <div className="mb-6">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#1A7F7F] text-white">
                          <th className="text-left px-4 py-2 font-semibold">
                            DESCRIPTION
                          </th>
                          <th className="text-right px-4 py-2 font-semibold">
                            GROSS AMOUNT
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.lineItems.map((item, index) => (
                          <tr key={item.id} className="border-b border-gray-200">
                            <td className="px-4 py-3 text-sm text-[#1A7F7F]">
                              {item.description || "(No description)"}
                            </td>
                            <td className="px-4 py-3 text-right text-sm">
                              {formatCurrency(item.amount)}
                            </td>
                          </tr>
                        ))}
                        {/* Empty rows for spacing */}
                        {data.lineItems.length < 3 &&
                          Array.from({ length: 3 - data.lineItems.length }).map(
                            (_, i) => (
                              <tr key={`empty-${i}`} className="border-b border-gray-200">
                                <td className="px-4 py-3">&nbsp;</td>
                                <td className="px-4 py-3">&nbsp;</td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                  </div>

                  {/* Bottom Section - Bank Details & Totals */}
                  <div className="flex justify-between">
                    {/* Bank Details */}
                    <div className="text-sm">
                      <p className="font-medium text-gray-700 mb-2">
                        Remarks / Payment Instructions:
                      </p>
                      <p className="text-gray-600 mb-4">{data.remarks}</p>
                      <div className="space-y-1">
                        <p>
                          <span className="font-semibold">Bank Name:</span>{" "}
                          {data.bankName || "(Add your bank)"}
                        </p>
                        <p>
                          <span className="font-semibold">Account Name:</span>{" "}
                          {data.accountName}
                        </p>
                        <p>
                          <span className="font-semibold">Account Number:</span>{" "}
                          {data.accountNumber || "(Add account number)"}
                        </p>
                      </div>
                    </div>

                    {/* Totals */}
                    <div className="text-sm w-64">
                      <div className="space-y-2">
                        <div className="flex justify-between border-b border-gray-200 pb-1">
                          <span className="font-semibold">SUBTOTAL</span>
                          <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-1">
                          <span>&nbsp;</span>
                          <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-1">
                          <span className="font-semibold">TAX RATE</span>
                          <span>{data.taxRate.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-1">
                          <span className="font-semibold">TOTAL TAX</span>
                          <span>{formatCurrency(taxAmount)}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-1">
                          <span className="font-semibold">NET PAYABLE</span>
                          <span>{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                          <span className="font-semibold text-lg">Balance Due</span>
                          <span className="font-bold text-lg">
                            {data.currencySymbol} {formatCurrency(total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teal Footer */}
                <div className="bg-[#1A7F7F] h-4 mt-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
