"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/components/Form/InputFeild";
import { Profile } from "@/store/profile/profile.types";
import { cn } from "@/lib/utils";
import { editProfileSchema } from "@/lib/validators/profile/editProfile.validator";
import { updateUserProfile } from "@/lib/actions/profile.actions";
import { useUpdateProfile } from "@/store";
import toast from "react-hot-toast";

type EditProfileData = z.infer<typeof editProfileSchema>;

interface EditProfileModalProps {
  userId: number;
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  userId,
  profile,
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = useUpdateProfile();

  const form = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      bio: profile.bio || "",
      phone: profile.phone || "",
      country: profile.country || "",
      city: profile.city || "",
      address: profile.address || "",
    },
    mode: "onChange",
  });

  const saveProfileUpdates = async (data: EditProfileData) => {
    try {
      const profileUpdated = await updateUserProfile(profile.id, data);

      if (!profileUpdated.success) {
        throw new Error(profileUpdated.error || "Failed to update profile");
      }
      updateProfile({ ...profileUpdated.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      throw error;
    }
  };

  const handleSubmit = async (data: EditProfileData) => {
    setIsLoading(true);
    try {
      await saveProfileUpdates(data);
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 ">
          <div className="flex items-center gap-3 py-8">
            <div className="p-2 bg-primary-100 rounded-xl">
              <Icon
                icon="solar:user-pen-bold"
                className="text-xl text-primary-600"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <p className="text-sm text-gray-500">
                Update your personal information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <Icon icon="solar:close-circle-bold" className="text-2xl" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto h-[calc(75vh-160px)] px-6 py-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-14"
            >
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Icon icon="solar:user-bold" className="text-lg" />
                  <span>Personal Information</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <InputField
                            className="pl-8 font-normal text-primary-500"
                            {...field}
                            label="First Name"
                            placeholder="Enter your first name"
                            error={fieldState.error}
                            disabled={isLoading}
                            icon={
                              <Icon
                                icon="solar:user-linear"
                                className="text-lg text-gray-400"
                              />
                            }
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
                            className="pl-8 font-normal text-primary-500"
                            {...field}
                            label="Last Name"
                            placeholder="Enter your last name"
                            error={fieldState.error}
                            disabled={isLoading}
                            icon={
                              <Icon
                                icon="solar:user-linear"
                                className="text-lg text-gray-400"
                              />
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <InputField
                          className="pl-8 font-normal text-primary-500"
                          {...field}
                          label="Bio"
                          placeholder="Tell others about yourself..."
                          error={fieldState.error}
                          disabled={isLoading}
                          multiline
                          rows={9}
                          icon={
                            <Icon
                              icon="solar:document-text-linear"
                              className="text-lg text-gray-400"
                            />
                          }
                        />
                      </FormControl>
                      <div className="flex justify-end">
                        <span
                          className={cn(
                            "text-xs",
                            (field.value?.length || 0) > 450
                              ? "text-amber-500"
                              : "text-gray-400"
                          )}
                        >
                          {field.value?.length || 0}/500
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <InputField
                          className="pl-8 font-normal text-primary-500"
                          {...field}
                          label="Phone Number"
                          placeholder="+1 (555) 123-4567"
                          error={fieldState.error}
                          disabled={isLoading}
                          type="tel"
                          icon={
                            <Icon
                              icon="solar:phone-linear"
                              className="text-lg text-gray-400"
                            />
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location Section */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Icon icon="solar:map-point-bold" className="text-lg" />
                  <span>Location</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <InputField
                            className="pl-8 font-normal text-primary-500"
                            {...field}
                            label="Country"
                            placeholder="Enter your country"
                            error={fieldState.error}
                            disabled={isLoading}
                            icon={
                              <Icon
                                icon="solar:global-linear"
                                className="text-lg text-gray-400"
                              />
                            }
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
                            className="pl-8 font-normal text-primary-500"
                            {...field}
                            label="City"
                            placeholder="Enter your city"
                            error={fieldState.error}
                            disabled={isLoading}
                            icon={
                              <Icon
                                icon="solar:city-linear"
                                className="text-lg text-gray-400"
                              />
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <InputField
                          className="pl-8 font-normal text-primary-500"
                          {...field}
                          label="Address (Optional)"
                          placeholder="Enter your street address"
                          error={fieldState.error}
                          disabled={isLoading}
                          icon={
                            <Icon
                              icon="solar:home-linear"
                              className="text-lg text-gray-400"
                            />
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isLoading || !form.formState.isValid}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Icon icon="solar:check-circle-bold" className="mr-2 text-lg" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
