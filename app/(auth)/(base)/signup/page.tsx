"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, Mail, Lock, Check } from "lucide-react";

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
  FormData,
  signUpSchema,
  userPasswordRequirements,
} from "@/lib/validators/Auth.validators";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/actions/Auth.actions";
import { Icon } from "@iconify/react";

const SignUpPage = () => {
  const Router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password") || "";

  const passwordRequirements = userPasswordRequirements(password);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError("");

      const user = await signUp(data);
      if (user && "error" in user) {
        throw new Error(user.error);
      }

      Router.push("/");

      // Remove confirmPassword before sending to API
    } catch (err) {
      const authError = err as AuthError;
      if (
        authError.message.includes("already exists") ||
        authError.message.includes("409")
      ) {
        setError("An account with this email already exists.");
      } else {
        setError(
          authError.message || "Failed to create account. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="auth-form-header">
        <Link
          className="group self-start underline block mr-auto w-fit text-[13px] text-primary-800 hover:text-primary-600"
          href="/"
        >
          <Icon
            icon="mdi:arrow-left"
            className="inline-block mr-1 group-hover:translate-x-0.5 transition-transform"
            width={16}
            height={16}
          />
          Back To Home
        </Link>
        <h1 className="auth-form-title">Create your account</h1>
        <p className="auth-form-subtitle">
          Join the community and start renting tools to or from your neighbors
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
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <InputField
                    {...field}
                    name="email"
                    className="h-[45px] pl-10 text-[13px]! bg-white"
                    label="Email address"
                    placeholder="Enter your email"
                    type="email"
                    error={fieldState.error}
                    disabled={isLoading}
                    icon={<Mail size={13} />}
                    autoComplete="new-email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <div className="auth-form-info">
            <p>
              <strong>Welcome to Spraada!</strong> By creating an account, you
              agree to our{" "}
              <Link
                href="/terms"
                className="underline hover:text-primary-600 text-primary-600"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="underline hover:text-primary-600 text-primary-600"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <Button
            type="submit"
            className="spraada-primary-button h-11 w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <div className="auth-footer">
        <p>
          Already have an account?{" "}
          <Link href="/signin" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};

export default SignUpPage;
