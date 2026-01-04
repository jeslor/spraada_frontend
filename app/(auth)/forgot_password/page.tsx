"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";

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
  ResetPasswordData,
  resetPasswordSchema,
} from "@/lib/validators/Auth.validators";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { SpraadaButton } from "@/components/ui/SpraadaButton";
import { getEmailProviderUrl } from "@/lib/helpers/emailHelpers";

const SignUpPage = () => {
  const Router = useRouter();
  const [error, setError] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [emailProviderUrl, setEmailProviderUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordData) => {
    try {
      setEmailProviderUrl(null);
      setIsLoading(true);
      setError("");

      // const user = await signUp(data);
      // if (user && "error" in user) {
      //   throw new Error(user.error);
      // }

      console.log(data.email);

      setEmailProviderUrl(getEmailProviderUrl(data.email)!);
      setEmailSent(true);

      // Router.push("/");

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
          authError.message || "Failed to create account. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openEmailProvider = () => {
    console.log(emailProviderUrl);

    if (emailProviderUrl) {
      window.open(emailProviderUrl, "_blank");
    }
  };

  return emailSent ? (
    <div className="auth-form-header">
      <div className="flex item-center justify-center">
        <Icon
          icon="fa6-solid:envelope-open-text"
          className="text-primary-600 dark:text-primary-300 mb-4"
          width={40}
          height={40}
        />
      </div>
      <h1 className="auth-form-title">Check your email</h1>
      <p className="auth-form-subtitle text-[13px]">
        We have sent a password reset link to your email address. Please check
        your inbox and follow the instructions to reset your password.
      </p>
      <SpraadaButton className="mt-6 h-11 w-full" onClick={openEmailProvider}>
        Open Email
      </SpraadaButton>
      {/* footer */}
      <div className="mt-4 text-center text-sm text-primary-600 dark:text-primary-300">
        <span>Didn't receive the email? </span>
        <button
          onClick={() => setEmailSent(false)}
          className="auth-link underline hover:text-primary-700 cursor-pointer"
        >
          Resend
        </button>
      </div>
    </div>
  ) : (
    <>
      {/* Header */}
      <div className="auth-form-header">
        <Link
          className="w-fit justify-start flex items-center gap-x-2 text-primary-800 mb-4"
          href="/signin"
        >
          <Icon icon="fa7-solid:arrow-left" />
          <span>Back</span>
        </Link>
        <h1 className="auth-form-title ">Forgot Password</h1>
        <p className="auth-form-subtitle  text-[13px]">
          No worries! Enter you email address below and we'll send you a link to
          reset your password.
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

          <Button
            type="submit"
            className="spraada-primary-button h-11 w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting ...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignUpPage;
