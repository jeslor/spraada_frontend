"use client";

const LoadingUI = ({ message = "Loading tool..." }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-primary-600 dark:text-primary-400">{message}</p>
    </div>
  );
};

export default LoadingUI;
