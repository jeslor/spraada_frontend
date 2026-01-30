"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toolCategories } from "@/lib/constants/tools";

interface SearchState {
  searchTerm: string;
  category: string;
  dateRange: string;
}

export const HeroSearch = () => {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchState, setSearchState] = useState<SearchState>({
    searchTerm: "",
    category: "",
    dateRange: "",
  });
  const pillRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const handleCategorySelect = (categoryId: string) => {
    const newCategory = categoryId === "all" ? "" : categoryId;
    setSearchState({
      ...searchState,
      category: newCategory,
    });

    // Scroll the selected pill into view
    const pillElement = pillRefs.current[categoryId];
    if (pillElement) {
      pillElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };

  const handleSearch = () => {
    if (!searchState.searchTerm) {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        searchInputRef.current.value = "Type something...";
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.value = "";
          }
        }, 500);
      }
      return;
    }
    const params = new URLSearchParams();
    if (searchState.searchTerm)
      params.set("searchTerm", searchState.searchTerm);
    if (searchState.category) params.set("category", searchState.category);
    router.push(`/browse?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-primary-800 via-primary-700 to-primary-600 rounded-3xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-6 sm:top-10 left-6 sm:left-10 rotate-12">
            <Icon
              icon="solar:hammer-bold"
              className="text-white w-10 h-10 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px]"
            />
          </div>
          <div className="absolute top-12 sm:top-20 right-10 sm:right-20 -rotate-12">
            <Icon
              icon="solar:wrench-bold"
              className="text-white w-8 h-8 sm:w-10 sm:h-10 md:w-[50px] md:h-[50px]"
            />
          </div>
          <div className="absolute bottom-10 sm:bottom-16 left-1/4 rotate-45">
            <Icon
              icon="solar:screw-driver-minimalistic-bold"
              className="text-white w-8 h-8 sm:w-9 sm:h-9 md:w-[45px] md:h-[45px]"
            />
          </div>
          <div className="absolute bottom-6 sm:bottom-10 right-1/3 -rotate-45">
            <Icon
              icon="solar:ruler-bold"
              className="text-white w-9 h-9 sm:w-11 sm:h-11 md:w-[55px] md:h-[55px]"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 py-8 sm:px-6 sm:py-10 md:px-12 md:py-16 lg:py-20">
          <div className="xl:max-w-[80%] w-full mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Rent Tools From Your Community
            </h1>
            <p className="text-primary-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-xl mx-auto px-2 hidden sm:block">
              Save money, reduce waste, and get the job done. Borrow tools from
              your neighbors or share yours.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-full shadow-xl p-1.5 sm:p-2 mx-auto xl:max-w-4xl">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-1.5 sm:gap-2 md:gap-0">
                {/* Location Input */}
                <div className="relative group flex-1 md:flex-2 flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-4 hover:bg-primary-100 rounded-lg sm:rounded-xl md:rounded-full md:mr-1">
                  <span className="hidden md:block absolute inset-y-0.5 right-0 bg-primary-800/30 w-px h-[70%] top-[15%] group-hover:opacity-0"></span>
                  <Icon
                    icon="solar:location-bold-duotone"
                    className="text-primary-500 shrink-0 w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <input
                    ref={searchInputRef}
                    onKeyUp={handleKeyPress}
                    type="text"
                    placeholder="Find a tool now!!"
                    className="w-full bg-transparent text-xs sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                    value={searchState.searchTerm}
                    onChange={(e) =>
                      setSearchState({
                        ...searchState,
                        searchTerm: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative group flex-1 h-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 hover:bg-primary-100 rounded-lg sm:rounded-xl md:rounded-full border-t md:border-t-0 border-gray-100 md:mr-2">
                  <span className="hidden md:block absolute inset-y-0.5 right-0 bg-primary-800/30 w-px h-[70%] top-[15%] group-hover:opacity-0"></span>
                  <Select
                    value={searchState.category || "all"}
                    onValueChange={(value) => {
                      handleCategorySelect(value);
                    }}
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
                  className="hidden  md:flex items-center justify-center gap-1.5 sm:gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg sm:rounded-xl md:rounded-full px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 transition-colors w-full md:w-auto"
                >
                  <Icon
                    icon="ic:baseline-search"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <span className="text-xs sm:text-sm font-medium">Search</span>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-5 sm:mt-6 md:mt-8 text-primary-100">
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                <Icon
                  icon="solar:users-group-rounded-bold-duotone"
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                />
                <span className="text-[10px] sm:text-xs md:text-sm">
                  500+ Members
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                <Icon
                  icon="solar:box-bold-duotone"
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                />
                <span className="text-[10px] sm:text-xs md:text-sm">
                  1,200+ Tools
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 sm:gap-1.5 md:gap-2">
                <Icon
                  icon="solar:star-bold-duotone"
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                />
                <span className="text-[10px] sm:text-xs md:text-sm">
                  4.9 Rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="w-full max-w-full mt-6  relative">
        <span className="absolute block left-0 top-0 h-full w-[50px] bg-linear-to-r from-slate-50 to-transparent"></span>
        <span className="absolute block right-0 top-0 h-full w-[50px] bg-linear-to-l from-slate-50 to-transparent"></span>
        <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
          <div className="flex items-center gap-2 pb-2 w-max px-7">
            {toolCategories.map((category) => (
              <button
                key={category.id + category.label}
                ref={(el) => {
                  pillRefs.current[category.id] = el;
                }}
                onClick={() => handleCategorySelect(category.id)}
                className={`shrink-0 flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-full whitespace-nowrap transition-all text-[11px] sm:text-xs md:text-sm font-medium ${
                  (category.id === "all" && !searchState.category) ||
                  searchState.category === category.id
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                }`}
              >
                <Icon
                  icon={category.icon}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]"
                />
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;
