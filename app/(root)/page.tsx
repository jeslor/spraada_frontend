import { Suspense } from "react";
import { HeroSearch, FeaturedTools, HowItWorks } from "@/components/Home";
import { getRandomTools } from "@/lib/actions/tools.actions";
import ToolsSkeletonGrid from "@/components/Tools/ToolsSkeletonGrid";

// Loading skeleton for tools section

const Page = () => {
  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-start gap-10">
      {/* Hero Section with Search */}
      <div className="w-full max-w-[1400px] flex justify-center mx-auto">
        <HeroSearch />
      </div>

      {/* Featured Tools Grid */}
      <FeaturedTools />

      {/* How It Works Section */}
      <HowItWorks />
    </div>
  );
};

export default Page;
