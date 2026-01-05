"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  userPasswordRequirements,
} from "@/lib/validators/Auth.validators";
import { tokenExpiryCheck } from "@/lib/actions/Auth.actions";
import { SpraadaButton } from "../ui/SpraadaButton";

const backendURL = process.env.BACKEND_API_URL;

const ResetPassword = ({
  token,
  email,
  tokenValid = false,
  message = "",
}: {
  token: string;
  email: string;
  tokenValid: boolean;
  message: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(tokenValid);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();

  //check whether the token is still valid

  useEffect(() => {
    if (!tokenValid) {
      setError(message || "The reset token is invalid or has expired.");
    }
  }, []);

  const form = useForm<NewPasswordData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

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

  console.log("token valid frontend", tokenValid);

  return (
    <>
      {/* Header */}
      <div className="auth-form-header">
        <h1 className="auth-form-title">
          {tokenValid ? "Create New Password" : "Reset Token Expired"}
        </h1>
        <p className="auth-form-subtitle text-[13px]">
          {tokenValid
            ? "Enter your new password below to complete the reset process. Ensure that it is strong"
            : "The password reset link has expired. Please request a new one."}
        </p>
      </div>

      {/* Error Message */}
      {error && <div className="auth-form-error">{error}</div>}
      {!tokenValid ? (
        <SpraadaButton
          variant="link"
          className="text-sm mt-2"
          onClick={() => Router.push("/forgot_password")}
        >
          Request New Password Reset Link
        </SpraadaButton>
      ) : (
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
      )}
    </>
  );
};

export default ResetPassword;
