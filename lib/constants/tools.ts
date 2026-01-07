export interface ToolCategory {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export const toolCategories: ToolCategory[] = [
  {
    id: "all",
    value: "all",
    label: "All Tools",
    icon: "solar:box-bold-duotone",
  },
  {
    id: "power_tools",
    value: "power_tools",
    label: "Power Tools",
    icon: "solar:bolt-bold-duotone",
  },
  {
    id: "hand_tools",
    value: "hand_tools",
    label: "Hand Tools",
    icon: "solar:hand-stars-bold-duotone",
  },
  {
    id: "garden",
    value: "garden",
    label: "Garden & Outdoor",
    icon: "solar:leaf-bold-duotone",
  },
  {
    id: "automotive",
    value: "automotive",
    label: "Automotive",
    icon: "solar:wheel-bold-duotone",
  },
  {
    id: "cleaning",
    value: "cleaning",
    label: "Cleaning Equipment",
    icon: "solar:washing-machine-bold-duotone",
  },
  {
    id: "construction",
    value: "construction",
    label: "Construction",
    icon: "solar:buildings-bold-duotone",
  },
  {
    id: "electrical",
    value: "electrical",
    label: "Electrical",
    icon: "solar:bolt-circle-bold-duotone",
  },
  {
    id: "plumbing",
    value: "plumbing",
    label: "Plumbing",
    icon: "solar:tuning-2-bold-duotone",
  },
  {
    id: "painting",
    value: "painting",
    label: "Painting",
    icon: "solar:pallete-2-bold-duotone",
  },
  {
    id: "measuring",
    value: "measuring",
    label: "Measuring",
    icon: "solar:ruler-bold-duotone",
  },
  {
    id: "other",
    value: "other",
    label: "Other",
    icon: "solar:widget-2-bold-duotone",
  },
];

export const howItWorks = [
  {
    icon: "solar:magnifer-bold-duotone",
    title: "Search",
    description: "Find the tools you need from neighbors in your community",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: "solar:calendar-bold-duotone",
    title: "Book",
    description: "Reserve tools for the days you need them",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: "solar:hand-shake-bold-duotone",
    title: "Pick Up",
    description: "Meet your neighbor and pick up the tool",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: "solar:box-bold-duotone",
    title: "Return",
    description: "Return the tool when you're done and leave a review",
    color: "bg-purple-100 text-purple-600",
  },
];

export const benefits = [
  {
    icon: "solar:wallet-money-bold-duotone",
    title: "Save Money",
    description:
      "Why buy expensive tools you'll only use once? Rent them for a fraction of the cost.",
    stat: "80%",
    statLabel: "Average savings",
  },
  {
    icon: "solar:leaf-bold-duotone",
    title: "Eco-Friendly",
    description:
      "Reduce waste and environmental impact by sharing tools instead of buying new ones.",
    stat: "50%",
    statLabel: "Less waste",
  },
  {
    icon: "solar:users-group-rounded-bold-duotone",
    title: "Build Community",
    description:
      "Connect with neighbors and build lasting relationships in your community.",
    stat: "500+",
    statLabel: "Active members",
  },
];

export const sortOptions = [
  {
    id: "newest",
    label: "Newest First",
    icon: "solar:clock-circle-bold-duotone",
  },
  {
    id: "price-low",
    label: "Price: Low to High",
    icon: "solar:sort-from-bottom-to-top-linear",
  },
  {
    id: "price-high",
    label: "Price: High to Low",
    icon: "solar:sort-from-top-to-bottom-linear",
  },
  { id: "popular", label: "Most Popular", icon: "solar:star-bold-duotone" },
];

export const availabilityOptions = [
  { id: "all", label: "All Tools" },
  { id: "available", label: "Available Now" },
  { id: "unavailable", label: "Currently Rented" },
];

// Get categories without "All" option (for forms)
export const toolCategoriesForForms = toolCategories.filter(
  (cat) => cat.id !== "all"
);

// Get category by id or value
export const getCategoryById = (
  idOrValue: string
): ToolCategory | undefined => {
  return toolCategories.find(
    (cat) => cat.id === idOrValue || cat.value === idOrValue
  );
};
