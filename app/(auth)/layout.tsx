import Image from "next/image";
import { Wrench, Hammer, Drill, Settings } from "lucide-react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="auth-layout fixed w-full">
      {/* Left Side - Branding & Image */}
      <div className="auth-brand-side">
        {/* Background Pattern */}
        {/* <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 transform rotate-12">
            <Wrench size={40} className="text-white" />
          </div>
          <div className="absolute top-32 right-20 transform -rotate-12">
            <Hammer size={48} className="text-white" />
          </div>
          <div className="absolute bottom-32 left-16 transform rotate-45">
            <Drill size={44} className="text-white" />
          </div>
          <div className="absolute bottom-20 right-32 transform -rotate-45">
            <Settings size={42} className="text-white" />
          </div>
          <div className="absolute top-1/2 left-1/3 transform -rotate-12">
            <Wrench size={36} className="text-white" />
          </div>
          <div className="absolute top-1/4 right-1/3 transform rotate-45">
            <Hammer size={38} className="text-white" />
          </div>
        </div> */}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center text-white p-12 w-full">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="auth-brand-icon mb-4">
                <img
                  className="size-[70px] filter brightness-0 invert"
                  src="/spraada_logo.webp"
                  alt="logo"
                />
              </div>
            </div>
            <h1 className="auth-brand-title">Spraada</h1>
            <p className="auth-brand-tagline">Rent. Share. Build.</p>
          </div>

          <div className="max-w-md">
            <h2 className="text-2xl font-semibold mb-4">
              Borrow Tools from Your Community
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Need a drill for the weekend? Looking to rent out your unused
              tools? Connect with neighbors and get the job done together.
            </p>

            <div className="auth-feature-grid">
              <div className="auth-feature-card">
                <Hammer size={24} className="text-blue-200 mb-2" />
                <span className="font-medium">Power Tools</span>
              </div>
              <div className="auth-feature-card">
                <Drill size={24} className="text-blue-200 mb-2" />
                <span className="font-medium">Hand Tools</span>
              </div>
              <div className="auth-feature-card">
                <Settings size={24} className="text-blue-200 mb-2" />
                <span className="font-medium">Garden Tools</span>
              </div>
              <div className="auth-feature-card">
                <Wrench size={24} className="text-blue-200 mb-2" />
                <span className="font-medium">Auto Tools</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="auth-form-side">
        <div className="auth-form-container">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
