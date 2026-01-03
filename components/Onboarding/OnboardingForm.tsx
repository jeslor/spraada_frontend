"use client";

import { useState, useRef, useEffect } from "react";
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
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/components/Form/InputFeild";
import {
  onboardingSchema,
  OnboardingData,
} from "@/lib/validators/profile/Onboarding.validators";
import customFetch from "@/lib/customFetch";
import { cn } from "@/lib/utils";
import CropImage from "./CropImage";
import { uploadResources } from "@/lib/actions/resources.actions";

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
  {
    id: 3,
    title: "All Set!",
    description: "Your profile is ready",
  },
];

const RESOURCE_FOLDER = "profile-images";

interface OnboardingFormProps {
  userRole: string;
  userId: string;
}

const OnboardingForm = ({ userRole, userId }: OnboardingFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Handle redirect after completion
  useEffect(() => {
    if (currentStep === 3) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      // Reset file input so same file can be selected again if needed
      e.target.value = "";
    }
  };

  const handleCropSave = (url: string, file: File) => {
    setPreviewUrl(url);
    setCroppedFile(file);
    setSelectedFile(null);
    setError(""); // Clear any previous errors about missing photo
  };

  const onSubmit = async (data: OnboardingData) => {
    if (!croppedFile) {
      setError("Please upload and crop your profile image.");
      return;
    }
    try {
      setIsLoading(true);
      let uploadedImage;
      setError("");

      // 1. Upload Image
      const formData = new FormData();
      formData.append("images", croppedFile);
      const uploadRes = await uploadResources(
        Number(userId),
        formData,
        RESOURCE_FOLDER
      );

      if (!uploadRes.success) {
        throw new Error(
          uploadRes.data?.message ||
            uploadRes.error ||
            "Failed to upload profile image"
        );
      }

      uploadedImage = uploadRes.data[0];

      // 2. Submit Profile Data
      const userProfileData = {
        ...data,
        avatarUrl: uploadedImage ? uploadedImage.url : null,
        avatarUrlKey: uploadedImage ? uploadedImage.key : null,
      };

      //save the user profile data

      // Move to completed step instead of refreshing immediately
      setCurrentStep(3);
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
      // Validate step 1: Check if photo is uploaded/previewed
      if (!previewUrl && !croppedFile) {
        setError("Please upload a profile photo to continue.");
        return;
      }
      setError("");
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Trigger form submission
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden grid md:grid-cols-[300px_1fr] min-h-[600px] mt-7">
      {/* Crop Image Overlay */}
      {selectedFile && (
        <CropImage
          fileName={selectedFile.name}
          maxOutputSize={800}
          file={selectedFile}
          onCancel={() => setSelectedFile(null)}
          onSave={handleCropSave}
          aspectRatio={1}
        />
      )}

      {/* Left Sidebar */}
      <div className="w-full  bg-primary-800 p-8 border-r border-gray-100 flex flex-col">
        <div className="mb-10">
          <p className="text-lg text-gray-300 mt-2 font-semibold">
            Complete your profile
          </p>
        </div>

        <div className="space-y-6 flex-1">
          {steps.map((step) => (
            <button
              key={step.id}
              // Only allow navigation to previous steps or current step
              // Disable navigation if on step 3 (completion)
              onClick={() => {
                if (currentStep !== 3 && step.id < currentStep) {
                  setCurrentStep(step.id);
                }
              }}
              disabled={currentStep === 3 || step.id > currentStep}
              className={cn(
                "w-full text-left group flex items-start gap-4 p-3 rounded-lg transition-all",
                currentStep === step.id
                  ? "bg-white shadow-sm border border-gray-200"
                  : step.id < currentStep
                  ? "hover:bg-gray-100 cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-colors",
                  currentStep === step.id
                    ? "bg-primary-600/90 text-white"
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
                    currentStep === step.id
                      ? "text-primary-600"
                      : "text-primary-400"
                  )}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-primary-200 mt-1 line-clamp-2">
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
          {currentStep === 3 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in zoom-in duration-500 py-10">
              <div className="relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 relative z-10">
                  <CheckCircle2 size={48} />
                </div>
                <Sparkles className="absolute -top-2 -right-2 text-yellow-400 w-8 h-8 animate-bounce" />
                <Sparkles className="absolute -bottom-2 -left-2 text-yellow-400 w-6 h-6 animate-pulse" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#073d44]">
                  Profile Updated!
                </h3>
                <p className="text-gray-500 mt-2">
                  Redirecting you to your profile...
                </p>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 h-full flex flex-col"
              >
                {currentStep === 1 && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-6">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/png, image/jpeg, image/jpg, image/heic"
                      onChange={handleFileSelect}
                    />

                    <div
                      className="relative group cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div
                        className={cn(
                          "w-40 h-40 rounded-full bg-gray-50 border-4 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group-hover:border-[#073d44] transition-all duration-300",
                          previewUrl && "border-solid border-[#073d44]"
                        )}
                      >
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-16 h-16 text-gray-300 group-hover:text-[#073d44] transition-colors" />
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-[#073d44] p-3 rounded-full text-white shadow-lg hover:bg-[#052c31] transition-colors">
                        <Camera size={20} />
                      </div>
                    </div>
                    <div className="text-center max-w-xs">
                      <h3 className="font-medium text-gray-900">
                        {previewUrl ? "Change photo" : "Upload your photo"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Photos help other members recognize you and build trust
                        in the community.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 border-[#073d44] text-[#073d44] hover:bg-[#073d44]/5"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {previewUrl ? "Change Image" : "Choose Image"}
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
                    ) : (
                      <>
                        {currentStep === 2 ? "Complete Profile" : "Next Step"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
