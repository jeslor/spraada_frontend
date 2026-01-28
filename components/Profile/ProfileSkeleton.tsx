"use client";

// Professional Profile Skeleton Loader matching Spraada color theme
export default function ProfileSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
      {/* Cover Photo Skeleton */}
      <div className="h-48 md:h-56 bg-linear-to-br from-primary-600/20 via-primary-500/10 to-primary-400/5 rounded-2xl mb-6" />
      {/* Avatar and Name Row */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20 mb-6 gap-6">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-primary-100/60 shadow-xl ring-4 ring-white" />
        <div className="flex flex-col gap-3 flex-1">
          <div className="h-8 w-48 bg-primary-100 rounded" />
          <div className="h-4 w-32 bg-primary-50 rounded" />
        </div>
        <div className="hidden md:block w-32 h-10 bg-primary-100 rounded-xl" />
      </div>
      {/* Stats Row */}
      <div className="flex flex-wrap gap-4 md:gap-6 mt-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 bg-primary-50 rounded-xl min-w-[120px]"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm w-8 h-8" />
            <div>
              <div className="h-6 w-10 bg-primary-100 rounded mb-1" />
              <div className="h-3 w-16 bg-primary-50 rounded" />
            </div>
          </div>
        ))}
      </div>
      {/* Bio and Details Skeleton */}
      <div className="bg-white rounded-2xl border border-primary-100 p-6 md:p-8 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-primary-50 rounded-xl w-12 h-12" />
          <div className="flex-1">
            <div className="h-5 w-32 bg-primary-100 rounded mb-2" />
            <div className="h-4 w-full bg-primary-50 rounded mb-1" />
            <div className="h-4 w-2/3 bg-primary-50 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl"
              >
                <div className="w-8 h-8 bg-primary-100 rounded" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-primary-100 rounded mb-1" />
                  <div className="h-3 w-16 bg-primary-50 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl"
              >
                <div className="w-8 h-8 bg-primary-100 rounded" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-primary-100 rounded mb-1" />
                  <div className="h-3 w-16 bg-primary-50 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Edit Profile Button Skeleton */}
      <div className="w-40 h-10 bg-primary-100 rounded-xl mx-auto" />
    </div>
  );
}
