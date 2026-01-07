"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  availabilityOptions,
  sortOptions,
  toolCategories,
} from "@/lib/constants/tools";
import { SearchToolsResponse, Tool } from "@/store";
import { searchTools } from "@/lib/actions/tools.actions";
import ToolContent from "@/components/Tools/ToolContnet";

export default function BrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTermInputRef = useRef<HTMLInputElement>(null);

  // Get initial values from URL params
  const initialSearchTerm = searchParams.get("searchTerm") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialSort = searchParams.get("sort") || "newest";
  const initialAvailability = searchParams.get("availability") || "all";

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [availability, setAvailability] = useState(initialAvailability);
  const [inputValue, setInputValue] = useState(initialSearchTerm);
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  // Update URL when filters change, think of the optimization here
  const updateURL = useCallback(
    (
      newSearchTerm: string,
      newCategory: string,
      newSort?: string,
      newAvailability?: string
    ) => {
      const params = new URLSearchParams();
      if (newSearchTerm) params.set("searchTerm", newSearchTerm);
      if (newCategory) params.set("category", newCategory);
      if (newSort && newSort !== "newest") params.set("sort", newSort);
      if (newAvailability && newAvailability !== "all")
        params.set("availability", newAvailability);
      router.push(`/browse?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  // Fetch tools
  const fetchTools = useCallback(
    async (page = 1, append = false) => {
      try {
        if (!append) setIsLoading(true);
        setError(null);

        const response: SearchToolsResponse = await searchTools({
          searchTerm: searchTerm || undefined,
          category: category || undefined,
          sortBy: sortBy || undefined,
          availability: availability || undefined,
          page,
          limit: 12,
        });

        if (append) {
          setTools((prev) => [...prev, ...response.data]);
        } else {
          setTools(response.data);
        }
        setPagination(response.pagination);
      } catch (err) {
        console.error("Error fetching tools:", err);
        setError("Failed to load tools");
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, category, sortBy, availability]
  );

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchTools(1);
  }, [searchTerm, category, sortBy, availability]);

  // Sync URL params to state on mount
  useEffect(() => {
    const urlSearchTerm = searchParams.get("searchTerm") || "";
    const urlCategory = searchParams.get("category") || "";
    const urlSort = searchParams.get("sort") || "newest";
    const urlAvailability = searchParams.get("availability") || "all";
    if (urlSearchTerm !== searchTerm) {
      setSearchTerm(urlSearchTerm);
      setInputValue(urlSearchTerm);
    }
    if (urlCategory !== category) {
      setCategory(urlCategory);
    }
    if (urlSort !== sortBy) {
      setSortBy(urlSort);
    }
    if (urlAvailability !== availability) {
      setAvailability(urlAvailability);
    }
  }, [searchParams]);

  const handleSearch = () => {
    preventEmptySearch();
    setSearchTerm(inputValue);
    // Reset filters when performing a new search
    setSortBy("newest");
    setAvailability("all");
    updateURL(inputValue, category, "newest", "all");
  };

  const handleCategorySelect = (categoryId: string) => {
    const newCategory = categoryId === "all" ? "" : categoryId;
    setCategory(newCategory);
    updateURL(searchTerm, newCategory, sortBy, availability);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    updateURL(searchTerm, category, newSort, availability);
  };

  const handleAvailabilityChange = (newAvailability: string) => {
    setAvailability(newAvailability);
    updateURL(searchTerm, category, sortBy, newAvailability);
  };

  const handleLoadMore = () => {
    if (pagination.hasMore) {
      fetchTools(pagination.page + 1, true);
    }
  };

  const preventEmptySearch = () => {
    if (searchTermInputRef.current?.value === "") {
      searchTermInputRef.current.focus();
      searchTermInputRef.current.value = "Type something...";
      setTimeout(() => {
        if (searchTermInputRef.current) {
          searchTermInputRef.current.value = "";
        }
      }, 500);
      return;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      preventEmptySearch();
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("");
    setSortBy("newest");
    setAvailability("all");
    setInputValue("");
    router.push("/browse");
  };

  const hasActiveFilters =
    searchTerm || category || sortBy !== "newest" || availability !== "all";

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-primary-700 backdrop-blur-lg border-b border-gray-200 -mx-4 px-4 lg:-mx-8 lg:px-8 xl:-mx-10 xl:px-10">
        <div className="max-w-7xl mx-auto py-4 px-4">
          {/* Search Bar */}
          <div className="bg-white rounded-xl sm:rounded-4xl border border-gray-200 shadow-sm p-1.5 sm:p-2 md:mt-5">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-1.5 sm:gap-2 md:gap-0">
              {/* Search Input */}
              <div className="relative group flex-1 md:flex-2 flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 md:px-4 py-2.5 sm:py-3 hover:bg-primary-50 rounded-lg sm:rounded-xl md:rounded-full md:mr-1">
                <span className="hidden md:block absolute inset-y-0.5 right-0 bg-gray-200 w-px h-[70%] top-[15%] group-hover:opacity-0"></span>
                <Icon
                  icon="solar:magnifer-linear"
                  className="text-primary-500 shrink-0 w-4 h-4 sm:w-5 sm:h-5"
                />
                <input
                  ref={searchTermInputRef}
                  type="text"
                  placeholder="Search for tools..."
                  className="w-full bg-transparent text-xs sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyUp={handleKeyPress}
                />
                {inputValue && (
                  <button
                    onClick={() => {
                      setInputValue("");
                      setSearchTerm("");
                      updateURL("", category);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <Icon
                      icon="solar:close-circle-bold"
                      className="w-4 h-4 text-gray-400"
                    />
                  </button>
                )}
              </div>

              {/* Category Dropdown */}
              <div className="relative group flex-1 h-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 hover:bg-primary-50 rounded-lg sm:rounded-xl md:rounded-full border-t md:border-t-0 border-gray-100 md:mr-2">
                <span className="hidden md:block absolute inset-y-0.5 right-0 bg-gray-200 w-px h-[70%] top-[15%] group-hover:opacity-0"></span>
                <Select
                  value={category || "all"}
                  onValueChange={(value) => handleCategorySelect(value)}
                >
                  <SelectTrigger className="w-full border-0 shadow-none bg-transparent focus:ring-0 focus-visible:ring-0 px-0 h-auto py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 [&>svg]:text-primary-500">
                    <div className="flex items-center gap-2">
                      <SelectValue placeholder="All Categories" />
                    </div>
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white border border-gray-200 rounded-xl shadow-lg min-w-[200px]"
                    position="popper"
                    sideOffset={8}
                  >
                    {toolCategories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id}
                        className="flex items-center gap-2 py-2.5 px-3 cursor-pointer hover:bg-primary-50 focus:bg-primary-50 rounded-lg mx-1 my-0.5 text-sm"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            icon={cat.icon}
                            className="w-4 h-4 text-primary-500"
                          />
                          <span>{cat.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-1.5 sm:gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg sm:rounded-xl md:rounded-full px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 transition-colors w-full md:w-auto"
              >
                <Icon
                  icon="ic:baseline-search"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span className="text-xs sm:text-sm font-medium">Search</span>
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {/* Sort By */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-auto min-w-40 bg-white border border-gray-200 rounded-lg h-9 text-xs sm:text-sm text-gray-700 gap-2 hover:border-primary-300 transition-colors">
                <div className="flex items-center gap-2">
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option.id}
                    value={option.id}
                    className="py-2.5 px-3 cursor-pointer hover:bg-primary-50 focus:bg-primary-50 rounded-lg mx-1 my-0.5 text-sm"
                  >
                    <div className="flex items-center gap-2 text-[9px] sm:text-sm font-semibold sm:font-medium">
                      <Icon
                        icon={option.icon}
                        className="w-4 h-4 text-primary-500"
                      />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Availability Filter */}
            <Select
              value={availability}
              onValueChange={handleAvailabilityChange}
            >
              <SelectTrigger className="w-auto min-w-[150px] bg-white border border-gray-200 rounded-lg h-9 text-xs sm:text-sm text-gray-700 gap-2 hover:border-primary-300 transition-colors">
                <div className="flex items-center gap-2 text-[9px] sm:text-sm font-semibold sm:font-medium">
                  <SelectValue placeholder="Availability" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                {availabilityOptions.map((option) => (
                  <SelectItem
                    key={option.id}
                    value={option.id}
                    className="py-2.5 px-3 cursor-pointer hover:bg-primary-50 focus:bg-primary-50 rounded-lg mx-1 my-0.5 text-sm"
                  >
                    <div className="flex items-center gap-2 text-[9px] sm:text-sm font-semibold sm:font-medium">
                      <Icon
                        icon={
                          option.id === "available"
                            ? "solar:check-circle-bold-duotone"
                            : option.id === "unavailable"
                            ? "solar:close-circle-bold-duotone"
                            : "solar:widget-bold-duotone"
                        }
                        className={`w-4 h-4 ${
                          option.id === "available"
                            ? "text-green-500"
                            : option.id === "unavailable"
                            ? "text-gray-400"
                            : "text-primary-500"
                        }`}
                      />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Active Filters Count */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:text-primary-600 bg-gray-100 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Icon icon="solar:close-circle-linear" width={16} />
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {searchTerm
                ? `Results for "${searchTerm}"`
                : category
                ? `${
                    toolCategories.find((c) => c.id === category)?.label ||
                    "Tools"
                  }`
                : "Browse All Tools"}
            </h1>
            {!isLoading && (
              <p className="text-gray-500 text-sm mt-1">
                {pagination.total} tool{pagination.total !== 1 ? "s" : ""} found
              </p>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-[9px] sm:text-sm font-semibold sm:font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Icon icon="solar:close-circle-linear" width={18} />
              Clear filters
            </button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <Icon
              icon="solar:danger-triangle-bold-duotone"
              className="text-amber-500 mx-auto mb-4"
              width={48}
            />
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => fetchTools(1)}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Tools Grid with Loading/Empty States */}
        {!error && (
          <>
            <ToolContent
              type="search"
              tools={tools}
              variant="compact"
              isLoading={isLoading}
              emptyState={
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
                    <Icon
                      icon="solar:box-bold-duotone"
                      className="text-primary-500"
                      width={40}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Tools Found
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchTerm || category
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : "Be the first to share your tools with the community!"}
                  </p>
                  {hasActiveFilters ? (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      <Icon icon="solar:refresh-linear" width={20} />
                      Clear Filters
                    </button>
                  ) : (
                    <a
                      href="/toolbox/add"
                      className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      <Icon icon="solar:add-circle-bold" width={20} />
                      List Your First Tool
                    </a>
                  )}
                </div>
              }
            />

            {/* Load More Button */}
            {!isLoading && tools.length > 0 && pagination.hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-primary-300 transition-all"
                >
                  <Icon icon="solar:refresh-linear" width={18} />
                  Load More
                </button>
              </div>
            )}

            {/* Pagination Info */}
            {!isLoading && tools.length > 0 && (
              <div className="text-center mt-4 text-sm text-gray-500">
                Showing {tools.length} of {pagination.total} tools
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
