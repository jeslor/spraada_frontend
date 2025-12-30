"use client";
import { Icon } from "@iconify/react";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/components/Form/InputFeild";
import { SignInData, AuthError } from "@/types/auth";
import { signInSchema } from "@/lib/validators/Auth.validators";
import { signIn } from "@/lib/actions/Auth.actions";

const backendURL = "http://localhost:4444";

const SignInPage = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const Router = useRouter();

  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInData) => {
    try {
      setIsLoading(true);
      setError("");

      const user = await signIn(data);
      if (user && "error" in user) {
        throw new Error(user.error);
      }
      Router.push("/");
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setUrl(`${backendURL}/auth/google/login`);
  }, []);

  return (
    <>
      {/* Header */}
      <div className="auth-form-header">
        <h1 className="auth-form-title">Welcome back</h1>
        <p className="auth-form-subtitle">
          Sign in to your account to continue renting tools
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
                    label="Email address"
                    placeholder="Enter your email"
                    className="h-[45px] pl-10 text-[13px]! bg-white "
                    type="email"
                    error={fieldState.error}
                    disabled={isLoading}
                    icon={<Mail size={15} />}
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
                    className="h-[45px] pl-10 text-[13px]! bg-white"
                    placeholder="Enter your password"
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
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end">
            <Link href="/forgot-password" className="auth-link text-sm">
              Forgot your password?
            </Link>
          </div>

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
              "Sign in"
            )}
          </Button>
        </form>
      </Form>

      {url && (
        <div>
          <p className="text-center text-sm text-gray-600">or</p>
          <a
            href={url}
            className="spraada-google-button h-11 w-full bg-slate-50 text-slate-700 hover:text-slate-50 hover:bg-primary-300 mt-4 border-white shadow-sm flex items-center justify-center gap-2 transition-all text-[14px] font-semibold"
          >
            <Icon icon="devicon:google" className="h-6 w-6"></Icon>
            Continue with Google
          </a>
        </div>
      )}
      {/* Footer */}
      <div className="auth-footer">
        <p>
          Don't have an account?{" "}
          <Link href="/signup" className="auth-link">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
};

export default SignInPage;
