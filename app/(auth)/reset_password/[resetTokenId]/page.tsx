"use client";
import { Icon } from "@iconify/react";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/components/Form/InputFeild";
import { AuthError } from "@/types/auth";
import {
  NewPasswordData,
  newPasswordSchema,
  signInSchema,
  userPasswordRequirements,
} from "@/lib/validators/Auth.validators";

const backendURL = "http://localhost:4444";

const SignInPage = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();

  const form = useForm<NewPasswordData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    setUrl(`${backendURL}/auth/google/login`);
  }, []);

  const password = form.watch("password") || "";

  const passwordRequirements = userPasswordRequirements(password);

  const onSubmit = async (data: NewPasswordData) => {
    try {
      setIsLoading(true);
      setError("");
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="auth-form-header">
        <h1 className="auth-form-title">Create New Password</h1>
        <p className="auth-form-subtitle text-[13px]">
          Enter your new password below to complete the reset process.Ensure
          that it is strong
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
                    label="Password"
                    placeholder="Create a password"
                    type="password"
                    className="h-[45px] pl-10 text-[13px]! bg-white"
                    error={fieldState.error}
                    disabled={isLoading}
                    icon={<Lock size={13} />}
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
                    className="h-[45px] pl-10 text-[13px]! bg-white"
                    placeholder="Confirm your password"
                    type="password"
                    error={fieldState.error}
                    disabled={isLoading}
                    icon={<Lock size={13} />}
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
                Signing in...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignInPage;
