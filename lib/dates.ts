// Date range: March 6-22, 2026
// Using year, month (0-indexed), day to avoid timezone issues
const START_YEAR = 2026;
const START_MONTH = 2; // March (0-indexed)
const START_DAY = 6;
const END_DAY = 22;

export function getAllDates(): Date[] {
  const dates: Date[] = [];

  // Create dates from March 6 to March 22, 2026
  for (let day = START_DAY; day <= END_DAY; day++) {
    // Create date at noon local time to avoid any timezone edge cases
    const date = new Date(START_YEAR, START_MONTH, day, 12, 0, 0);
    dates.push(date);
  }

  return dates;
}

export function formatDate(date: Date): string {
  // Use local date components to create consistent key
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function getDateKey(date: Date): string {
  return formatDate(date);
}
