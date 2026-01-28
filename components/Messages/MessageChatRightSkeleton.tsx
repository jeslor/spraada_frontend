import { useMemo } from "react";

export default function MessagesSkeleton() {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        alignRight: i % 2 === 0,
        width: Math.random() * 35 + 20, // 40% → 75%
      })),
    [],
  );

  return (
    <div
      className="flex-1 flex flex-col h-full min-h-0 bg-white dark:bg-gray-900 overflow-hidden"
      aria-busy="true"
      aria-label="Loading messages"
    >
      {/* Messages */}
      <div
        className="flex-1 min-h-0 overflow-y-auto px-0 py-6 space-y-5
                      bg-linear-to-b from-white to-gray-50
                      dark:from-gray-900 dark:to-gray-950 scrollbar-hide"
      >
        {bubbles.map(({ id, alignRight, width }) => (
          <div
            key={id}
            className={`flex ${alignRight ? "justify-end" : "justify-start"}`}
          >
            <div
              className="h-12 rounded-2xl
                         bg-gray-200 dark:bg-gray-700
                         animate-pulse"
              style={{ width: `${width}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
