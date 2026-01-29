// Format cents to currency
export const formatPrice = (cents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

// Generate calendar days
export const generateCalendarDays = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);

  const firstDayOfWeek = firstDay.getDay();
  const lastDateOfMonth = lastDay.getDate();
  const prevLastDate = prevLastDay.getDate();

  const days: (Date | null)[] = [];

  // Previous month days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, prevLastDate - i));
  }

  // Current month days
  for (let i = 1; i <= lastDateOfMonth; i++) {
    days.push(new Date(year, month, i));
  }

  // Next month days to fill the grid
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
};

// Calculate days remaining
export const calculateDaysRemaining = (
  returnDate: string,
  returnLess: boolean = false,
): number => {
  const today = new Date();
  const returnDay = new Date(returnDate);
  const diffTime = returnDay.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return returnLess ? diffDays : Math.max(0, diffDays);
};

// Calculate days borrowed (from pickUpDate to now)
export const calculateDaysBorrowed = (pickUpDate: string): number => {
  const today = new Date();
  const pickUp = new Date(pickUpDate);
  const diffTime = today.getTime() - pickUp.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(0, diffDays);
};

// Format date nicely
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

// Format date with day of week
export const formatDateWithDay = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

// Check if a date is already booked
export const isDateBooked = (
  date: Date,
  bookedDates: { start: Date; end: Date }[],
) => {
  return bookedDates.some((range) => {
    const checkDate = new Date(date);
    const rangeStart = new Date(range.start);
    const rangeEnd = new Date(range.end);

    checkDate.setHours(0, 0, 0, 0);
    rangeStart.setHours(0, 0, 0, 0);
    rangeEnd.setHours(0, 0, 0, 0);

    return checkDate >= rangeStart && checkDate <= rangeEnd;
  });
};

//created at to time ago
export function timeAgo(date: Date | string): string {
  const now = new Date().getTime();
  const past = new Date(date).getTime();
  const diff = Math.floor((now - past) / 1000); // seconds

  if (diff < 60) return `${diff} second${diff !== 1 ? "s" : ""} ago`;

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 52) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

//Generate message timestamp
export const formatMessageTimestamp = (dateInput: string | Date): string => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();

  // Check if date is today
  const isToday = date.toDateString() === now.toDateString();

  // Check if date is yesterday
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (isYesterday) {
    return "Yesterday";
  }

  // If within the last 7 days, show the day name (e.g., "Tuesday")
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
  if (diffInDays < 7) {
    return date.toLocaleDateString([], { weekday: "long" });
  }

  // Default to short date for older messages
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
