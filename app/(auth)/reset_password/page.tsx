"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, ArrowLeft, Check } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/components/Form/InputFeild";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordContent = () => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password") || "";

  const passwordRequirements = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: /[a-z]/.test(password), text: "One lowercase letter" },
    { met: /[A-Z]/.test(password), text: "One uppercase letter" },
    { met: /\d/.test(password), text: "One number" },
  ];

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        return;
      }

      try {
        // TODO: Implement token validation API call
        // const response = await validateResetToken(token);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsTokenValid(true);
      } catch (err) {
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordData) => {
    try {
      setIsLoading(true);
      setError("");

      // TODO: Implement reset password API call
      // const response = await resetPassword(token, data.password);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while validating token
  if (isTokenValid === null) {
    return (
      <>
        <div className="auth-form-header">
          <h1 className="auth-form-title">Validating link...</h1>
          <p className="auth-form-subtitle">
            Please wait while we verify your reset link
          </p>
        </div>
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
        </div>
      </>
    );
  }

  // Invalid or expired token
  if (!isTokenValid) {
    return (
      <>
        <div className="auth-form-header">
          <h1 className="auth-form-title">Link expired</h1>
          <p className="auth-form-subtitle">
            This password reset link is invalid or has expired
          </p>
        </div>

        <div className="auth-form-error">
          <p>
            Password reset links expire after 1 hour for security reasons.
            Please request a new link to reset your password.
          </p>
        </div>

        <Button
          type="button"
          className="spraada-primary-button h-11 w-full"
          onClick={() => router.push("/forgot_Password")}
        >
          Request new link
        </Button>

        <div className="auth-footer">
          <p>
            <Link
              href="/signin"
              className="auth-link inline-flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </p>
        </div>
      </>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <>
        <div className="auth-form-header">
          <h1 className="auth-form-title">Password reset</h1>
          <p className="auth-form-subtitle">
            Your password has been successfully updated
          </p>
        </div>

        <div className="auth-form-success">
          <p>You can now sign in with your new password.</p>
        </div>

        <Button
          type="button"
          className="spraada-primary-button h-11 w-full"
          onClick={() => router.push("/signin")}
        >
          Continue to sign in
        </Button>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="auth-form-header">
        <h1 className="auth-form-title">Set new password</h1>
        <p className="auth-form-subtitle">
          Your new password must be different from previously used passwords
        </p>
      </div>

      {/* Error Message */}
      {error && <div className="auth-form-error">{error}</div>}

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="auth-form"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <InputField
                    {...field}
                    name="password"
                    label="New password"
                    placeholder="Enter your new password"
                    className="h-[45px] pl-10 text-[13px]! bg-white"
                    type="password"
                    error={fieldState.error}
                    disabled={isLoading}
                    icon={<Lock size={15} />}
                    showPasswordToggle={true}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    autoComplete="new-password"
                  />
                </FormControl>
                {password && (
                  <div className="password-requirements">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="password-requirement">
                        <Check
                          size={12}
                          className={`mr-2 ${
                            req.met ? "text-green-500" : "text-gray-300"
                          }`}
                        />
                        <span
                          className={
                            req.met
                              ? "password-requirement-met"
                              : "password-requirement-unmet"
                          }
                        >
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <InputField
                    {...field}
                    name="confirmPassword"
                    label="Confirm password"
                    placeholder="Confirm your new password"
                    className="h-[45px] pl-10 text-[13px]! bg-white"
                    type="password"
                    error={fieldState.error}
                    disabled={isLoading}
                    icon={<Lock size={15} />}
                    showPasswordToggle={true}
                    showPassword={showConfirmPassword}
                    onTogglePassword={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="spraada-primary-button h-11 w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting password...
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <div className="auth-footer">
        <p>
          <Link
            href="/signin"
            className="auth-link inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </p>
      </div>
    </>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <>
          <div className="auth-form-header">
            <h1 className="auth-form-title">Loading...</h1>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
          </div>
        </>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
