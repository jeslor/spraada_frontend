import { Icon } from "@iconify/react";

const Page = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
          <Icon
            icon="solar:home-2-bold"
            className="text-5xl text-primary-600"
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 text-center">
          Add a new Tool!
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          Share your tools with the community and earn extra income by listing
        </p>
      </div>
    </div>
  );
};

export default Page;
