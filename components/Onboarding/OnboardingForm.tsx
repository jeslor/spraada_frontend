"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  User,
  MapPin,
  Phone,
  FileText,
  Camera,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import InputField from "@/components/Form/InputFeild";
import {
  onboardingSchema,
  OnboardingData,
} from "@/lib/validators/Onboarding.validators";
import { useRouter } from "next/navigation";
import customFetch from "@/lib/customFetch";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Profile Photo",
    description: "Add a photo to help others recognize you",
  },
  {
    id: 2,
    title: "About You",
    description: "Tell us a bit about yourself",
  },
];

const OnboardingForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      phone: "",
      country: "",
      city: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: OnboardingData) => {
    try {
      setIsLoading(true);
      setError("");

      console.log("Onboarding data collected:", data);

      // TODO: Upload photo logic here

      // Submit profile data
      const response = await customFetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4444"
        }/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create profile");
      }

      console.log("Profile created successfully");
      // Refresh the page or redirect to update session/UI
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // Validate step 1 if needed, for now just move to step 2
      // In future, check if photo is uploaded
      setCurrentStep(2);
    } else {
      // Trigger form submission
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden grid md:grid-cols-[300px_1fr] min-h-[600px] mt-7">
      {/* Left Sidebar */}
      <div className="w-full  bg-gray-50 p-8 border-r border-gray-100 flex flex-col">
        <div className="mb-10">
          <p className="text-sm text-gray-500 mt-2 font-semibold">
            Complete your profile
          </p>
        </div>

        <div className="space-y-6 flex-1">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={cn(
                "w-full text-left group flex items-start gap-4 p-3 rounded-lg transition-all",
                currentStep === step.id
                  ? "bg-white shadow-sm border border-gray-200"
                  : "hover:bg-gray-100"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-colors",
                  currentStep === step.id
                    ? "bg-[#073d44] text-white"
                    : currentStep > step.id
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {currentStep > step.id ? <CheckCircle2 size={16} /> : step.id}
              </div>
              <div>
                <h3
                  className={cn(
                    "font-medium text-sm",
                    currentStep === step.id ? "text-[#073d44]" : "text-gray-600"
                  )}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {step.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>
              Step {currentStep} of {steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-8 md:p-12 flex flex-col ">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-gray-500 mt-2">
            {steps[currentStep - 1].description}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-red-600"></div>
            {error}
          </div>
        )}

        <div className="flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 h-full flex flex-col"
            >
              {currentStep === 1 && (
                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className="relative group cursor-pointer">
                    <div className="w-40 h-40 rounded-full bg-gray-50 border-4 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group-hover:border-[#073d44] transition-all duration-300">
                      <User className="w-16 h-16 text-gray-300 group-hover:text-[#073d44] transition-colors" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-[#073d44] p-3 rounded-full text-white shadow-lg hover:bg-[#052c31] transition-colors">
                      <Camera size={20} />
                    </div>
                  </div>
                  <div className="text-center max-w-xs">
                    <h3 className="font-medium text-gray-900">
                      Upload your photo
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Photos help other members recognize you and build trust in
                      the community.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 border-[#073d44] text-[#073d44] hover:bg-[#073d44]/5"
                  >
                    Choose File
                  </Button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <InputField
                              {...field}
                              name="firstName"
                              label="First Name"
                              placeholder="John"
                              className="h-[50px] text-[14px]!"
                              error={fieldState.error}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <InputField
                              {...field}
                              name="lastName"
                              label="Last Name"
                              placeholder="Doe"
                              className="h-[50px] text-[14px]!"
                              error={fieldState.error}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex w-full">
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field, fieldState }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <InputField
                              {...field}
                              name="bio"
                              label="Bio"
                              placeholder="Tell us about yourself..."
                              className="pl-10 text-[14px]!"
                              error={fieldState.error}
                              disabled={isLoading}
                              icon={<FileText size={18} />}
                              multiline={true}
                              rows={6}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <InputField
                            {...field}
                            name="phone"
                            label="Phone Number"
                            placeholder="+1 234 567 8900"
                            className="h-[50px] pl-10 text-[14px]!"
                            error={fieldState.error}
                            disabled={isLoading}
                            icon={<Phone size={18} />}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <InputField
                              {...field}
                              name="country"
                              label="Country"
                              placeholder="USA"
                              className="h-[50px] pl-10 text-[14px]!"
                              error={fieldState.error}
                              disabled={isLoading}
                              icon={<MapPin size={18} />}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <InputField
                              {...field}
                              name="city"
                              label="City"
                              placeholder="New York"
                              className="h-[50px] pl-10 text-[14px]!"
                              error={fieldState.error}
                              disabled={isLoading}
                              icon={<MapPin size={18} />}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="mt-auto pt-8 flex justify-end gap-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="h-12 px-6"
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleNext}
                  className="spraada-primary-button py-6 min-w-[140px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : currentStep === steps.length ? (
                    "Complete Profile"
                  ) : (
                    <>
                      Next Step
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
