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
  returnLess: boolean = false
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
  bookedDates: { start: Date; end: Date }[]
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
