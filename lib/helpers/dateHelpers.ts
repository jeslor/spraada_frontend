const countryToCurrency: Record<string, string> = {
  US: "USD",
  DE: "EUR",
  FR: "EUR",
  GB: "GBP",
  UG: "UGX",
  KE: "KES",
};

const timeZoneToCurrency: Record<string, string> = {
  Europe: "EUR",
  America: "USD",
  Africa: "USD", // fallback (many African countries use mixed currencies online)
};

export const formatPrice = (cents: number, country?: string) => {
  // 1️⃣ Locale = how numbers look (language preference)
  const locale = navigator.language || "en-US";

  // 2️⃣ Currency = explicit country beats everything
  let currency = (country && countryToCurrency[country]) ?? undefined;

  // 3️⃣ Fallback: infer from timezone (NOT language)
  if (!currency) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // e.g. "Europe/Berlin"

    const region = timeZone?.split("/")[0]; // "Europe"
    currency = timeZoneToCurrency[region] ?? "USD";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
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

  // 1. Create the time string once (e.g., "10:30 AM")
  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // 2. Identify the date context
  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  // 3. Logic for the Date Label
  let dateLabel: string;

  if (isToday) {
    dateLabel = "Today";
  } else if (isYesterday) {
    dateLabel = "Yesterday";
  } else {
    const diffInDays = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);

    if (diffInDays < 7) {
      // Show weekday (e.g., "Tuesday")
      dateLabel = date.toLocaleDateString([], { weekday: "long" });
    } else {
      // Show full date (e.g., "Oct 24, 2025")
      dateLabel = date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  // 4. Combine them
  return `${dateLabel}, ${timeStr}`;
};

//subtract a millsecond from a date string and return new ISO string
export const getPreviousMillisecondString = (date: string | Date): string => {
  const ms = new Date(date).getTime();
  if (isNaN(ms)) return new Date().toISOString();

  return new Date(ms - 1).toISOString();
};
