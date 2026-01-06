import { Suspense } from "react";
import { HeroSearch, FeaturedTools, HowItWorks } from "@/components/Home";
import { getAllTools } from "@/lib/actions/tools.actions";

// Loading skeleton for tools section
const ToolsSkeleton = () => (
  <div className="py-8">
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-48 mt-2 animate-pulse" />
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          <div className="aspect-square rounded-xl bg-gray-200" />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-8" />
            </div>
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Server component to fetch tools
const FeaturedToolsServer = async () => {
  try {
    const tools = await getAllTools(12);
    // Shuffle for randomness
    const shuffled = [...tools].sort(() => Math.random() - 0.5);
    return <FeaturedTools initialTools={shuffled.slice(0, 12)} />;
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
      {/* 
      {/* Featured Tools Grid */}
      {/* <Suspense fallback={<ToolsSkeleton />}>
        <FeaturedToolsServer />
      </Suspense> */}

      {/* How It Works Section */}
      {/* <HowItWorks />  */}
    </div>
  );
};

export default Page;
