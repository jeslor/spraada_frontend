import React from "react";

const SignOutOverlay = () => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-8 py-6 shadow-xl">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 " />
        <div className="text-center">
          <p className="text-base font-semibold text-gray-900">
            Signing you out
          </p>
          <p className="mt-1 text-sm text-gray-500">See you again soon 👋🏾</p>
        </div>
      </div>
    </div>
  );
};

export default SignOutOverlay;
