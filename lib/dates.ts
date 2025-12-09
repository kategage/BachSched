// Date range: March 6-22, 2026
export const START_DATE = new Date('2026-03-06');
export const END_DATE = new Date('2026-03-22');

export function getAllDates(): Date[] {
  const dates: Date[] = [];
  const current = new Date(START_DATE);

  while (current <= END_DATE) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
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
