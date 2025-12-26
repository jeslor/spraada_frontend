"use client";

import React from "react";
import { Icon } from "@iconify/react";

export type SpraadaButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "success"
  | "warning"
  | "link";

export type SpraadaButtonSize = "sm" | "md" | "lg" | "icon";

export interface SpraadaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: SpraadaButtonVariant;
  size?: SpraadaButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: string;
  rightIcon?: string;
  iconSize?: number;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const SpraadaButton = React.forwardRef<HTMLButtonElement, SpraadaButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      iconSize = 20,
      fullWidth = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClass = "spraada-btn";
    const variantClass = `spraada-btn-${variant}`;
    const sizeClass = `spraada-btn-${size}`;
    const widthClass = fullWidth ? "spraada-btn-full" : "";
    const loadingClass = isLoading ? "spraada-btn-loading" : "";

    const classes = [
      baseClass,
      variantClass,
      sizeClass,
      widthClass,
      loadingClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Icon
              icon="svg-spinners:ring-resize"
              className="spraada-btn-spinner"
              width={iconSize}
            />
            {loadingText && <span>{loadingText}</span>}
          </>
        ) : (
          <>
            {leftIcon && (
              <Icon icon={leftIcon} width={iconSize} className="shrink-0" />
            )}
            {children}
            {rightIcon && (
              <Icon icon={rightIcon} width={iconSize} className="shrink-0" />
            )}
          </>
        )}
      </button>
    );
  }
);

SpraadaButton.displayName = "SpraadaButton";

export { SpraadaButton };
