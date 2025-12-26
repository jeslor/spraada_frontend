"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import InputField from "@/components/Form/InputFeild";
import { SpraadaButton } from "@/components/ui/SpraadaButton";
import { toast } from "react-hot-toast";
import { addToolSchema } from "@/lib/validators/tools/tools.validator";
import { toolCategories } from "@/lib/constants/tools";

type AddToolFormData = z.infer<typeof addToolSchema>;

interface AddToolFormProps {
  onSuccess?: () => void;
}

export default function AddToolForm({ onSuccess }: AddToolFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<AddToolFormData>({
    resolver: zodResolver(addToolSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      dailyPrice: undefined,
      deposit: undefined,
      replacementValue: undefined,
    },
  });

  const handleCategorySelect = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setValue("category", categoryValue, { shouldValidate: true });
  };

  const handleDescriptionChange = (value: string) => {
    setValue("description", value, { shouldValidate: true });
  };

  const descriptionValue = watch("description");

  const onSubmit = async (data: AddToolFormData) => {
    setIsSubmitting(true);
    try {
      // Convert to cents for API
      const payload = {
        ...data,
        dailyPriceCents: Math.round(data.dailyPrice * 100),
        depositCents: Math.round(data.deposit * 100),
        replacementValue: Math.round(data.replacementValue * 100),
      };

      console.log("Submitting tool:", payload);

      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Tool added successfully!");
      reset();
      setSelectedCategory("");
      onSuccess?.();
    } catch (error) {
      console.error("Failed to add tool:", error);
      toast.error("Failed to add tool. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mr-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-2  dark:border-primary-700">
            <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
              <Icon
                icon="solar:info-circle-bold"
                className="text-primary-600 dark:text-primary-400"
                width={24}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-800 dark:text-primary-100">
                Basic Information
              </h2>
              <p className="text-sm text-primary-500 dark:text-primary-400">
                Tell us about your tool
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <InputField
              {...register("name")}
              name="name"
              label="Tool Name"
              placeholder="e.g., DeWalt 20V Cordless Drill"
              error={errors.name}
              icon={
                <Icon
                  icon="solar:hammer-bold"
                  className="text-primary-400"
                  width={20}
                />
              }
            />

            <InputField
              name="description"
              label="Description"
              placeholder="Describe your tool's condition, features, and what it's best used for..."
              error={errors.description}
              richText
              value={descriptionValue}
              onValueChange={handleDescriptionChange}
              minHeight="180px"
            />
          </div>
        </section>

        {/* Category Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-primary-200 dark:border-primary-700">
            <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
              <Icon
                icon="solar:widget-2-bold"
                className="text-primary-600 dark:text-primary-400"
                width={24}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-800 dark:text-primary-100">
                Category
              </h2>
              <p className="text-sm text-primary-500 dark:text-primary-400">
                Select the category that best fits your tool
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {toolCategories.map((category) => (
              <button
                key={category.value}
                type="button"
                onClick={() => handleCategorySelect(category.value)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                  ${
                    selectedCategory === category.value
                      ? "border-primary-500 bg-primary-100 dark:bg-primary-900 shadow-md"
                      : "border-primary-200 dark:border-primary-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-100/50 dark:hover:bg-primary-800/50"
                  }
                `}
              >
                <Icon
                  icon={category.icon}
                  width={28}
                  className={
                    selectedCategory === category.value
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-primary-400 dark:text-primary-500"
                  }
                />
                <span
                  className={`text-xs font-medium text-center leading-tight ${
                    selectedCategory === category.value
                      ? "text-primary-700 dark:text-primary-300"
                      : "text-primary-600 dark:text-primary-400"
                  }`}
                >
                  {category.label}
                </span>
              </button>
            ))}
          </div>
          {errors.category && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
              <Icon icon="solar:danger-circle-bold" width={16} />
              {errors.category.message}
            </p>
          )}
          <input type="hidden" {...register("category")} />
        </section>

        {/* Pricing Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-primary-200 dark:border-primary-700">
            <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
              <Icon
                icon="solar:dollar-bold"
                className="text-primary-600 dark:text-primary-400"
                width={24}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-800 dark:text-primary-100">
                Pricing
              </h2>
              <p className="text-sm text-primary-500 dark:text-primary-400">
                Set your rental rates and protection values
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="auth-label flex items-center gap-2">
                <Icon
                  icon="solar:calendar-bold"
                  className="text-primary-400"
                  width={18}
                />
                Daily Rate
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 font-medium">
                  $
                </span>
                <input
                  {...register("dailyPrice", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="25.00"
                  className={`
                    w-full h-12 pl-8 pr-4 rounded-lg border-2 bg-white dark:bg-primary-900
                    text-primary-800 dark:text-primary-100 placeholder:text-primary-400
                    transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20
                    ${
                      errors.dailyPrice
                        ? "border-red-500 focus:border-red-500"
                        : "border-primary-200 dark:border-primary-700 focus:border-primary-500"
                    }
                  `}
                />
              </div>
              {errors.dailyPrice && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <Icon icon="solar:danger-circle-bold" width={14} />
                  {errors.dailyPrice.message}
                </p>
              )}
              <p className="text-xs text-primary-500 dark:text-primary-400">
                Amount charged per day
              </p>
            </div>

            <div className="space-y-2">
              <label className="auth-label flex items-center gap-2">
                <Icon
                  icon="solar:shield-check-bold"
                  className="text-primary-400"
                  width={18}
                />
                Security Deposit
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 font-medium">
                  $
                </span>
                <input
                  {...register("deposit", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="50.00"
                  className={`
                    w-full h-12 pl-8 pr-4 rounded-lg border-2 bg-white dark:bg-primary-900
                    text-primary-800 dark:text-primary-100 placeholder:text-primary-400
                    transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20
                    ${
                      errors.deposit
                        ? "border-red-500 focus:border-red-500"
                        : "border-primary-200 dark:border-primary-700 focus:border-primary-500"
                    }
                  `}
                />
              </div>
              {errors.deposit && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <Icon icon="solar:danger-circle-bold" width={14} />
                  {errors.deposit.message}
                </p>
              )}
              <p className="text-xs text-primary-500 dark:text-primary-400">
                Refundable when tool returned
              </p>
            </div>

            <div className="space-y-2">
              <label className="auth-label flex items-center gap-2">
                <Icon
                  icon="solar:tag-price-bold"
                  className="text-primary-400"
                  width={18}
                />
                Replacement Value
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 font-medium">
                  $
                </span>
                <input
                  {...register("replacementValue", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="200.00"
                  className={`
                    w-full h-12 pl-8 pr-4 rounded-lg border-2 bg-white dark:bg-primary-900
                    text-primary-800 dark:text-primary-100 placeholder:text-primary-400
                    transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20
                    ${
                      errors.replacementValue
                        ? "border-red-500 focus:border-red-500"
                        : "border-primary-200 dark:border-primary-700 focus:border-primary-500"
                    }
                  `}
                />
              </div>
              {errors.replacementValue && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <Icon icon="solar:danger-circle-bold" width={14} />
                  {errors.replacementValue.message}
                </p>
              )}
              <p className="text-xs text-primary-500 dark:text-primary-400">
                Tool&apos;s current market value
              </p>
            </div>
          </div>
        </section>

        {/* Photo Upload Section - Placeholder */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-primary-200 dark:border-primary-700">
            <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-lg">
              <Icon
                icon="solar:camera-bold"
                className="text-primary-600 dark:text-primary-400"
                width={24}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-800 dark:text-primary-100">
                Photos
              </h2>
              <p className="text-sm text-primary-500 dark:text-primary-400">
                Add photos to showcase your tool
              </p>
            </div>
          </div>

          <div className="border-2 border-dashed border-primary-300 dark:border-primary-600 rounded-xl p-8 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-colors cursor-pointer bg-primary-50/50 dark:bg-primary-900/50">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-primary-100 dark:bg-primary-800 rounded-full">
                <Icon
                  icon="solar:gallery-add-bold"
                  className="text-primary-500 dark:text-primary-400"
                  width={32}
                />
              </div>
              <div>
                <p className="font-medium text-primary-700 dark:text-primary-300">
                  Click to upload photos
                </p>
                <p className="text-sm text-primary-500 dark:text-primary-400 mt-1">
                  PNG, JPG up to 10MB (max 5 photos)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Submit Section */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-primary-200 dark:border-primary-700">
          <SpraadaButton
            type="button"
            variant="secondary"
            size="lg"
            leftIcon="solar:arrow-left-bold"
            onClick={() => window.history.back()}
          >
            Cancel
          </SpraadaButton>
          <SpraadaButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            loadingText="Adding Tool..."
            leftIcon="solar:add-circle-bold"
          >
            Add Tool to Listing
          </SpraadaButton>
        </div>
      </form>
    </div>
  );
}
