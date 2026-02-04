import { Suspense } from "react";
import Link from "next/link";
import { HeroSearch, FeaturedTools, HowItWorks } from "@/components/Home";
import { getRandomTools } from "@/lib/actions/tools.actions";
import ToolsSkeletonGrid from "@/components/Tools/ToolsSkeletonGrid";

// Loading skeleton for tools section

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-10 flex-1">
        {/* Hero Section with Search */}
        <div className="w-full max-w-[1400px] flex justify-center mx-auto">
          <HeroSearch />
        </div>

        {/* Featured Tools Grid */}
        <FeaturedTools />

        {/* How It Works Section */}
        <HowItWorks />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-10 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:py-6">
          <div className="flex md:flex-row  justify-between items-center gap-4">
            <p className="text-[10px] md:text-sm text-gray-600">
              © 2026 Spraada. All rights reserved.
            </p>
            <div className="flex gap-6 text-[10px] md:text-sm">
              <Link
                href="/terms"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
