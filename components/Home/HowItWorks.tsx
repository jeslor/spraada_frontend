"use client";

import { benefits, howItWorks } from "@/lib/constants/tools";
import { Icon } from "@iconify/react";
import Link from "next/link";

export const HowItWorks = () => {
  return (
    <section className="py-12 w-full max-w-[1400px] mx-auto px-4 ">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
          <Icon icon="solar:info-circle-bold" width={16} />
          How It Works
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Rent Tools in 4 Easy Steps
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          Spraada makes it simple to borrow tools from your neighbors. Here's
          how it works.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {howItWorks.map((step, index) => (
          <div
            key={step.title}
            className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
          >
            {/* Step Number */}
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>

            {/* Icon */}
            <div
              className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${step.color} mb-4`}
            >
              <Icon icon={step.icon} width={28} />
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-gray-500">{step.description}</p>

            {/* Connector Arrow */}
            {index < howItWorks.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <Icon
                  icon="solar:arrow-right-linear"
                  className="text-gray-300"
                  width={24}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="bg-linear-to-br from-primary-50 to-primary-100 rounded-3xl p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4">
                <Icon
                  icon={benefit.icon}
                  className="text-primary-600"
                  width={32}
                />
              </div>
              <div className="text-3xl font-bold text-primary-700 mb-1">
                {benefit.stat}
              </div>
              <div className="text-sm text-primary-600 font-medium mb-3">
                {benefit.statLabel}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Ready to get started?
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Icon icon="ic:baseline-search" width={20} />
            Browse Tools
          </Link>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Icon icon="solar:add-circle-bold" width={20} />
            List Your Tools
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
