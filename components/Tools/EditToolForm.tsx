"use client";

import React, { useState, useRef, useEffect, use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import InputField from "@/components/Form/InputFeild";
import { SpraadaButton } from "@/components/ui/SpraadaButton";
import { toast } from "react-hot-toast";
import {
  addToolSchema,
  EditToolFormData,
} from "@/lib/validators/tools/tools.validator";
import { toolCategoriesForForms } from "@/lib/constants/tools";
import CropImage from "@/components/Onboarding/CropImage";
import {
  useProfile,
  useUpdateToolAction,
  useUser,
  Tool,
  ToolPhoto,
} from "@/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateTool } from "@/lib/actions/tools.actions";

const MAX_PHOTOS = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

interface EditToolFormProps {
  tool: Tool;
  onSuccess?: () => void;
}

export default function EditToolForm({ tool, onSuccess }: EditToolFormProps) {
  const Router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    tool.category,
  );

  // Separate state for existing photos (from DB), deleted and new photos (to upload)
  const [existingPhotos, setExistingPhotos] = useState<ToolPhoto[]>(
    tool.toolPhotos || [],
  );

  const [newPhotos, setNewPhotos] = useState<ToolPhoto[]>([]);
  const [deletedPhotos, setDeletedPhotos] = useState<ToolPhoto[]>([]);

  //pick new photos to upload
  const [selectedFileForCrop, setSelectedFileForCrop] = useState<File | null>(
    null,
  );
  const [photoError, setPhotoError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  //get profile and user, tools from store
  const profile = useProfile();
  const user = useUser();

  const updateToolInStore = useUpdateToolAction();

  const totalPhotoCount = existingPhotos.length + newPhotos.length;

  //form state
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, defaultValues },
  } = useForm<EditToolFormData>({
    resolver: zodResolver(addToolSchema),
    defaultValues: {
      name: tool.name,
      description: tool.description,
      category: tool.category,
      dailyPrice: tool.dailyPriceCents / 100,
      deposit: tool.depositCents / 100,
      replacementValue: tool.replacementValue / 100,
    },
  });

  const handleCategorySelect = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setValue("category", categoryValue, { shouldValidate: true });
  };

  const handleSetInitialDescriptionValue = () => {
    setValue("description", tool.description, { shouldValidate: true });
  };

  // Set initial description value on mount to ensure it populates the editor correctly
  useEffect(() => {
    handleSetInitialDescriptionValue();
  }, [tool.description, setValue]);

  //update the description value
  const handleDescriptionChange = (value: string) => {
    setValue("description", value);

    // Trigger validation after a short delay to allow state to update
    setTimeout(() => {
      trigger("description");
    }, 100);
  };

  const descriptionValue = watch("description");

  // Photo handling functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setPhotoError("");

    if (totalPhotoCount >= MAX_PHOTOS) {
      setPhotoError(`Maximum ${MAX_PHOTOS} photos allowed`);
      e.target.value = "";
      return;
    }

    const isHeic = file.name.toLowerCase().endsWith(".heic");
    if (!ALLOWED_TYPES.includes(file.type) && !isHeic) {
      setPhotoError("Only JPG, PNG, WebP, or HEIC images are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setPhotoError("File size must be less than 10MB");
      e.target.value = "";
      return;
    }

    setSelectedFileForCrop(file);
    e.target.value = "";
  };

  const handleCropSave = (previewUrl: string, croppedFile: File) => {
    const newPhoto: ToolPhoto = {
      id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      file: croppedFile,
      previewUrl,
    };
    setNewPhotos((prev) => [...prev, newPhoto]);
    setSelectedFileForCrop(null);
    setPhotoError("");
  };

  //Separate delete handlers for existing and new photos
  //remove existing photo if user chooses to remove it and add it to deleted list
  const handleRemoveExistingPhoto = (photoUrl: string) => {
    const deletedPhoto = existingPhotos.find((p) => p.photoUrl === photoUrl);
    if (deletedPhoto) {
      setDeletedPhotos((prev) => [...prev, deletedPhoto]);
    }
    setExistingPhotos((prev) => prev.filter((p) => p.photoUrl !== photoUrl));
  };

  //remove new photo if user chooses to remove it
  const handleRemoveNewPhoto = (photoId: string) => {
    setNewPhotos((prev) => {
      const photo = prev.find((p) => p.id === photoId);
      if (photo?.previewUrl) {
        URL.revokeObjectURL(photo.previewUrl);
      }
      return prev.filter((p) => p.id !== photoId);
    });
  };

  // Handle upload button click to check the total photo count
  const handleUploadClick = () => {
    if (totalPhotoCount >= MAX_PHOTOS) {
      setPhotoError(`Maximum ${MAX_PHOTOS} photos allowed`);
      return;
    }
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: EditToolFormData) => {
    if (totalPhotoCount === 0) {
      setPhotoError("Please add at least one photo of the tool.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        dailyPriceCents: Math.round(data.dailyPrice * 100),
        depositCents: Math.round(data.deposit * 100),
        replacementValue: Math.round(data.replacementValue * 100),
      };

      const updatedTool = await updateTool({
        toolId: tool.id,
        userId: Number(user!.id),
        toolInfo: {
          name: payload.name,
          description: payload.description,
          category: payload.category,
          dailyPriceCents: payload.dailyPriceCents,
          depositCents: payload.depositCents,
          replacementValue: payload.replacementValue,
          profileId: profile!.id,
        },
        newPhotos: newPhotos.filter((p) => p.file),
        existingPhotos,
        deletedPhotos,
      });

      // Update tool in the store
      updateToolInStore(tool.id, updatedTool);

      // Refresh the tools in the store to get the updated data
      //   if (profile?.id) {
      //     await fetchMyTools(profile.id);
      //   }

      toast.success("Tool updated successfully!");
      onSuccess?.();
      Router.push("/toolbox");
    } catch (error) {
      console.error("Failed to update tool:", error);
      toast.error("Failed to update tool. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full xl:max-w-280 mr-auto lg:px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Basic Information Section */}
        <section className="space-y-10">
          <div className="flex items-center gap-3 pb-2 dark:border-primary-700">
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
                Update your tool details
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            <InputField
              {...register("name")}
              name="name"
              className="border-[2.5px] h-11 border-primary-300"
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
        <section className="space-y-10">
          <div className="flex items-center gap-3 dark:border-primary-700">
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
            {toolCategoriesForForms.map((category) => (
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
        <section className="space-y-10">
          <div className="flex items-center gap-3 dark:border-primary-700">
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
                Update your rental rates and protection values
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

        {/* Photo Upload Section */}
        <section className="space-y-10">
          <div className="flex items-center gap-3 dark:border-primary-700">
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
                Manage your tool photos ({totalPhotoCount}/{MAX_PHOTOS})
              </p>
            </div>
          </div>

          {/* Crop Image Overlay */}
          {selectedFileForCrop && (
            <CropImage
              fileName={selectedFileForCrop.name}
              maxOutputSize={1200}
              file={selectedFileForCrop}
              onCancel={() => setSelectedFileForCrop(null)}
              onSave={handleCropSave}
              aspectRatio={4 / 3}
            />
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,.heic"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Photo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {/* Existing photos from database */}
            {existingPhotos.map((photo: ToolPhoto, index) => (
              <div
                key={photo.photoUrl}
                className="relative aspect-4/3 rounded-xl overflow-hidden border-2 border-primary-200 dark:border-primary-700 group"
              >
                <Image
                  src={photo.photoUrl!}
                  alt={`Tool photo ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {/* Primary badge for first photo */}
                {index === 0 && newPhotos.length === 0 && (
                  <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-md">
                    Primary
                  </div>
                )}
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveExistingPhoto(photo.photoUrl!)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Icon icon="solar:close-circle-bold" width={18} />
                </button>
                {/* Photo number */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-md">
                  {index + 1}/{MAX_PHOTOS}
                </div>
              </div>
            ))}

            {/* New photos to upload */}
            {newPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative aspect-4/3 rounded-xl overflow-hidden border-2 border-green-400 dark:border-green-600 group"
              >
                <img
                  src={photo.previewUrl}
                  alt={`New photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* New badge */}
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-md">
                  New
                </div>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveNewPhoto(photo.id!)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Icon icon="solar:close-circle-bold" width={18} />
                </button>
                {/* Photo number */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-md">
                  {existingPhotos.length + index + 1}/{MAX_PHOTOS}
                </div>
              </div>
            ))}

            {/* Add photo button */}
            {totalPhotoCount < MAX_PHOTOS && (
              <button
                type="button"
                onClick={handleUploadClick}
                className="aspect-4/3 rounded-xl border-2 border-dashed border-primary-300 dark:border-primary-600 
                         hover:border-primary-400 dark:hover:border-primary-500 
                         bg-primary-50/50 dark:bg-primary-900/50 
                         hover:bg-primary-100/50 dark:hover:bg-primary-800/50
                         transition-all duration-200 cursor-pointer
                         flex flex-col items-center justify-center gap-2"
              >
                <div className="p-3 bg-primary-100 dark:bg-primary-800 rounded-full">
                  <Icon
                    icon="solar:gallery-add-bold"
                    className="text-primary-500 dark:text-primary-400"
                    width={24}
                  />
                </div>
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  Add Photo
                </span>
              </button>
            )}
          </div>

          {/* Photo tips */}
          {totalPhotoCount === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-primary-500 dark:text-primary-400">
                PNG, JPG, WebP or HEIC up to 10MB each
              </p>
              <p className="text-xs text-primary-400 dark:text-primary-500 mt-1">
                First photo will be the primary image shown in listings
              </p>
            </div>
          )}

          {/* Photo error */}
          {photoError && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
              <Icon icon="solar:danger-circle-bold" width={16} />
              {photoError}
            </p>
          )}
        </section>

        {/* Submit Section */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-primary-200 dark:border-primary-700">
          <SpraadaButton
            type="button"
            variant="secondary"
            size="lg"
            leftIcon="solar:arrow-left-bold"
            onClick={() => Router.push("/toolbox")}
          >
            Cancel
          </SpraadaButton>
          <SpraadaButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            loadingText="Saving Changes..."
            leftIcon="solar:pen-bold"
          >
            Save Changes
          </SpraadaButton>
        </div>
      </form>
    </div>
  );
}
