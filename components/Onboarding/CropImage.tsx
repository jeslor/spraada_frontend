"use client";

import { useState, useRef, useEffect } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Loader2,
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Lock,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Fix for "JSX element class does not support attributes" error with React 19/Next.js 16
const ReactCropComponent = ReactCrop as unknown as React.FC<any>;

// --- Helper Functions ---

// Helper to center the crop initially
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

// --- Component Definition ---
interface CropImageProps {
  file: File;
  onCancel: () => void;
  onSave: (previewUrl: string, file: File) => void;
  aspectRatio?: number; // e.g., 1 for square, 16/9 for wide
  fileName: string;
  maxOutputSize?: number; // maximum width/height for output image
}

const CropImage = ({
  fileName,
  file,
  onCancel,
  onSave,
  maxOutputSize,
  aspectRatio = 1,
}: CropImageProps) => {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [isFixedAspect, setIsFixedAspect] = useState(true);

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Load and convert image
  useEffect(() => {
    const loadFile = async () => {
      setIsLoading(true);

      if (typeof window === "undefined") {
        return null;
      }
      try {
        let imageFile = file;

        // --- HEIC Handling and Conversion ---
        if (
          file.type === "image/heic" ||
          file.name.toLowerCase().endsWith(".heic")
        ) {
          // Dynamically import heic2any only when needed (client-side only)
          const heic2any = (await import("heic2any")).default;
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8,
          });

          // heic2any can return a Blob or Blob[]
          const blob = Array.isArray(convertedBlob)
            ? convertedBlob[0]
            : convertedBlob;

          // Create a new File object with the correct type and extension
          imageFile = new File([blob], file.name.replace(/\.heic$/i, ".jpg"), {
            type: "image/jpeg",
          });
        }

        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgSrc(reader.result?.toString() || "");
          setIsLoading(false);
        });
        reader.readAsDataURL(imageFile);
      } catch (error) {
        console.error("Error loading image:", error);
        setIsLoading(false);
      }
    };

    loadFile();
  }, [file]);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspectRatio));
  }

  // --- Core Cropping, Scaling, and Rotation Logic ---
  const handleSave = async () => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const originalCropWidth = crop.width * scaleX;
    const originalCropHeight = crop.height * scaleY;

    // ⭐ NEW: Read from prop or use default
    const MAX_SIZE = maxOutputSize || 1200;

    // Calculate reduced output size
    let outWidth = originalCropWidth;
    let outHeight = originalCropHeight;

    if (outWidth > MAX_SIZE || outHeight > MAX_SIZE) {
      const scaleFactor = Math.min(MAX_SIZE / outWidth, MAX_SIZE / outHeight);

      outWidth = outWidth * scaleFactor;
      outHeight = outHeight * scaleFactor;
    }

    canvas.width = outWidth;
    canvas.height = outHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingQuality = "high";

    // Draw the crop at the reduced resolution
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      originalCropWidth,
      originalCropHeight,
      0,
      0,
      outWidth,
      outHeight,
    );

    // Export compressed JPEG
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const previewUrl = URL.createObjectURL(blob);
        const croppedFile = new File([blob], `${fileName}.jpg`, {
          type: "image/jpeg",
        });

        onSave(previewUrl, croppedFile);
      },
      "image/jpeg",
      0.7, // compression quality
    );
  };

  const toggleAspect = () => {
    setIsFixedAspect((prev) => !prev);
    // Optionally reset crop to center when toggling, or just let it be
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      // If switching TO fixed, reset to aspect crop
      if (!isFixedAspect) {
        setCrop(centerAspectCrop(width, height, aspectRatio));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <h3 className="font-semibold text-lg text-[#073d44]">Edit Photo</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50 flex items-center justify-center min-h-[200px]">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#073d44]" />
              <p>Loading image...</p>
            </div>
          ) : (
            <div className="relative w-full flex justify-center">
              <ReactCropComponent
                crop={crop}
                onChange={(_: any, percentCrop: any) => setCrop(percentCrop)}
                onComplete={(c: any) => setCompletedCrop(c)}
                aspect={isFixedAspect ? aspectRatio : undefined}
                circularCrop={isFixedAspect && aspectRatio === 1} // Only circular if fixed square
                className="max-h-[60vh]"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  style={{
                    // Apply visual transformations (scale and rotate)
                    transform: `scale(${scale}) rotate(${rotate}deg)`,
                    maxHeight: "60vh",
                  }}
                  onLoad={onImageLoad}
                  className="block max-w-full h-auto"
                />
              </ReactCropComponent>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-gray-100 bg-white space-y-4 shrink-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
                className="p-2 text-gray-500 hover:text-[#073d44] transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={20} />
              </button>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-20 sm:w-32 accent-[#073d44] h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setScale((s) => Math.min(3, s + 0.1))}
                className="p-2 text-gray-500 hover:text-[#073d44] transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={20} />
              </button>
            </div>

            <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block" />

            {/* Rotate & Aspect Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRotate((r) => (r + 90) % 360)}
                className="p-2 text-gray-500 hover:text-[#073d44] transition-colors"
                title="Rotate"
              >
                <RotateCw size={20} />
              </button>

              <div className="w-px h-6 bg-gray-200 mx-2" />

              <button
                type="button"
                onClick={toggleAspect}
                className={`p-2 transition-colors rounded-md flex items-center gap-2 ${
                  isFixedAspect
                    ? "bg-gray-100 text-[#073d44]"
                    : "text-gray-500 hover:text-[#073d44]"
                }`}
                title={
                  isFixedAspect ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"
                }
              >
                {isFixedAspect ? <Lock size={20} /> : <Unlock size={20} />}
                <span className="text-xs font-medium hidden sm:inline">
                  {isFixedAspect ? "Fixed" : "Free"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 sm:pt-0">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-10 px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="h-10 px-6 bg-[#073d44] hover:bg-[#052c31] text-white gap-2"
              disabled={isLoading || !completedCrop}
            >
              <Check size={16} />
              Save Photo
            </Button>
          </div>
        </div>

        {/* Hidden Canvas for processing */}
        <canvas
          ref={previewCanvasRef}
          style={{
            display: "none",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
};

export default CropImage;
