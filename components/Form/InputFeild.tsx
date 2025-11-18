import React, { forwardRef } from "react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { FieldError } from "react-hook-form";

interface InputFieldProps {
  name: string;
  label: string;
  placeholder: string;
  error?: FieldError;
  disabled?: boolean;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  className?: string;
  autoComplete?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
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
      onBlur,
      icon,
      showPasswordToggle = false,
      showPassword = false,
      onTogglePassword,
      className,
      autoComplete,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="auth-label">
          {label}
        </Label>
        <div className="auth-input-group">
          {icon && <div className="auth-input-icon">{icon}</div>}
          <Input
            {...props}
            ref={ref}
            type={showPasswordToggle && showPassword ? "text" : type}
            id={name}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onChange={onChange}
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
              className
            )}
          />
          {showPasswordToggle && (
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
        {error && <p className="text-red-500 text-sm">{error.message}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
