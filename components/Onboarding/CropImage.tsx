"use client";

import { useState, useRef, useEffect } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import heic2any from "heic2any";
import { Loader2, X, Check, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fix for "JSX element class does not support attributes" error with React 19/Next.js 16
const ReactCropComponent = ReactCrop as unknown as React.FC<any>;

// --- Helper Functions ---

// Helper to center the crop initially
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

// --- Component Definition ---
interface CropImageProps {
  file: File;
  onCancel: () => void;
  onSave: (previewUrl: string, file: File) => void;
  aspectRatio?: number; // e.g., 1 for square, 16/9 for wide
}

const CropImage = ({
  file,
  onCancel,
  onSave,
  aspectRatio = 1,
}: CropImageProps) => {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Load and convert image
  useEffect(() => {
    const loadFile = async () => {
      setIsLoading(true);
      try {
        let imageFile = file;

        // --- HEIC Handling and Conversion ---
        if (
          file.type === "image/heic" ||
          file.name.toLowerCase().endsWith(".heic")
        ) {
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

    // Calculate scaling factors based on natural image size
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set final canvas dimensions based on the completed crop box
    const pixelRatio = window.devicePixelRatio;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    canvas.width = cropWidth * pixelRatio;
    canvas.height = cropHeight * pixelRatio;

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    const rotateRads = rotate * (Math.PI / 180);
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();

    // 1. Move canvas origin to the center of the original image
    ctx.translate(centerX, centerY);

    // 2. Apply rotation and scale around the center point
    ctx.rotate(rotateRads);
    ctx.scale(scale, scale);

    // 3. Move the canvas origin back
    ctx.translate(-centerX, -centerY);

    // 4. Translate to apply the crop (Shifts the image so the desired top-left corner is at canvas origin)
    ctx.translate(-crop.x * scaleX, -crop.y * scaleY);

    // Draw the entire (transformed) image
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    ctx.restore();

    // Generate Blob and URL
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        const previewUrl = URL.createObjectURL(blob);
        // Create a file from the blob for uploading
        const croppedFile = new File([blob], "profile-photo.jpg", {
          type: "image/jpeg",
        });
        onSave(previewUrl, croppedFile);
      },
      "image/jpeg",
      0.9 // Quality setting
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold text-lg text-[#073d44]">Edit Photo</h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50 flex items-center justify-center min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#073d44]" />
              <p>Loading image...</p>
            </div>
          ) : (
            <div className="relative">
              <ReactCropComponent
                crop={crop}
                onChange={(_: any, percentCrop: any) => setCrop(percentCrop)}
                onComplete={(c: any) => setCompletedCrop(c)}
                aspect={aspectRatio}
                circularCrop
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
                  className="block max-w-full"
                />
              </ReactCropComponent>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-gray-100 bg-white space-y-4">
          <div className="flex items-center gap-4 justify-center">
            <button
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
              className="w-32 accent-[#073d44] h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <button
              onClick={() => setScale((s) => Math.min(3, s + 0.1))}
              className="p-2 text-gray-500 hover:text-[#073d44] transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-2" />
            <button
              onClick={() => setRotate((r) => (r + 90) % 360)}
              className="p-2 text-gray-500 hover:text-[#073d44] transition-colors"
              title="Rotate"
            >
              <RotateCw size={20} />
            </button>
            <span className="text-sm text-gray-600">{rotate}°</span>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel} className="h-10 px-6">
              Cancel
            </Button>
            <Button
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
