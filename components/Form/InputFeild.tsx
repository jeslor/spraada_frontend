"use client";
import React, { forwardRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { FieldError } from "react-hook-form";

// Dynamically import QuillEditor to avoid SSR issues
const QuillEditor = dynamic(() => import("./QuillEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] border-2 border-primary-200 dark:border-primary-700 rounded-lg animate-pulse bg-primary-50 dark:bg-primary-900" />
  ),
});

interface InputFieldProps {
  name: string;
  label: string;
  placeholder: string;
  error?: FieldError;
  disabled?: boolean;
  type?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onValueChange?: (value: string) => void;
  onBlur?: (event: any) => void;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  className?: string;
  autoComplete?: string;
  multiline?: boolean;
  richText?: boolean;
  rows?: number;
  minHeight?: string;
}

const InputField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputFieldProps
>(
  (
    {
      name,
      label,
      placeholder,
      error,
      disabled = false,
      type = "text",
      value,
      onChange,
      onValueChange,
      onBlur,
      icon,
      showPasswordToggle = false,
      showPassword = false,
      onTogglePassword,
      className,
      autoComplete,
      multiline = false,
      richText = false,
      rows = 4,
      minHeight = "150px",
      ...props
    },
    ref,
  ) => {
    const [toolDescription, setToolDescription] = React.useState<any>(null);
    // Handle rich text editor changes
    const handleRichTextChange = (htmlValue: string) => {
      onValueChange?.(htmlValue);
    };

    useEffect(() => {
      if (richText && typeof value === "string") {
        setToolDescription(value);
      }
    }, [value, richText]);

    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="auth-label">
          {label}
        </Label>
        {richText ? (
          <QuillEditor
            value={toolDescription || ""}
            onChange={handleRichTextChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            error={!!error}
            minHeight={minHeight}
            className={className}
          />
        ) : (
          <div className="auth-input-group relative">
            {icon && (
              <div
                className={cn(
                  "auth-input-icon",
                  multiline && "top-5 transform-none",
                )}
              >
                {icon}
              </div>
            )}
            {multiline ? (
              <Textarea
                {...props}
                ref={ref as React.Ref<HTMLTextAreaElement>}
                id={name}
                name={name}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                onChange={
                  onChange as (
                    e: React.ChangeEvent<HTMLTextAreaElement>,
                  ) => void
                }
                onBlur={onBlur}
                rows={rows || 4}
                className={cn(
                  icon
                    ? "pl-10"
                    : "border-gray-200 focus:border-blue-500 focus:ring-blue-500",
                  {
                    "opacity-50 cursor-not-allowed": disabled,
                    "border-red-500 focus:border-red-500": error,
                  },
                  " min-h-[100px] w-full ",
                  className,
                )}
              />
            ) : (
              <Input
                {...props}
                ref={ref as React.Ref<HTMLInputElement>}
                type={showPasswordToggle && showPassword ? "text" : type}
                id={name}
                name={name}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                onChange={
                  onChange as (e: React.ChangeEvent<HTMLInputElement>) => void
                }
                onBlur={onBlur}
                autoComplete={autoComplete || "off"}
                className={cn(
                  icon
                    ? "auth-input"
                    : "h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500",
                  showPasswordToggle ? "auth-input-with-toggle" : "",
                  {
                    "opacity-50 cursor-not-allowed": disabled,
                    "border-red-500 focus:border-red-500": error,
                  },
                  className,
                )}
              />
            )}
            {showPasswordToggle && !multiline && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="auth-input-toggle"
                onClick={onTogglePassword}
                disabled={disabled}
              >
                {showPassword ? (
                  <EyeOff className="text-gray-400" size={18} />
                ) : (
                  <Eye className="text-gray-400" size={18} />
                )}
              </Button>
            )}
          </div>
        )}
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">
            {error.message}
          </p>
        )}
      </div>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;
