import { Suspense } from "react";
import { HeroSearch, FeaturedTools, HowItWorks } from "@/components/Home";
import { getRandomTools } from "@/lib/actions/tools.actions";
import ToolsSkeletonGrid from "@/components/Tools/ToolsSkeletonGrid";

// Loading skeleton for tools section
const ToolsSkeleton = () => (
  <section className="py-8 w-full max-w-[1400px] mx-auto">
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-48 mt-2 animate-pulse" />
      </div>
    </div>
    <ToolsSkeletonGrid count={8} variant="compact" />
  </section>
);

// Server component to fetch tools
const FeaturedToolsServer = async () => {
  try {
    const tools = await getRandomTools(12);
    return <FeaturedTools initialTools={tools} />;
  } catch (error) {
    console.error("Error fetching tools:", error);
    return <FeaturedTools />;
  }
};

const Page = () => {
  return (
    <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-start gap-10">
      {/* Hero Section with Search */}
      <div className="w-full max-w-[1400px] flex justify-center mx-auto">
        <HeroSearch />
      </div>

      {/* Featured Tools Grid */}
      <Suspense fallback={<ToolsSkeleton />}>
        <FeaturedToolsServer />
      </Suspense>

      {/* How It Works Section */}
      <HowItWorks />
    </div>
  );
};

export default Page;
