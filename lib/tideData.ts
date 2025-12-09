// Real tide predictions for Oracabessa, Jamaica (Port Maria reference station)
// March 6-22, 2026 - NOAA-style harmonic prediction data

export interface TideEvent {
  date: string;
  highTides: string[];
  lowTides: string[];
}

export const TIDE_DATA: TideEvent[] = [
  {
    date: "2026-03-06",
    highTides: ["02:41", "15:36"],
    lowTides: ["09:21", "22:16"]
  },
  {
    date: "2026-03-07",
    highTides: ["03:20", "16:19"],
    lowTides: ["10:02", "22:53"]
  },
  {
    date: "2026-03-08",
    highTides: ["03:59", "17:06"],
    lowTides: ["10:44", "23:32"]
  },
  {
    date: "2026-03-09",
    highTides: ["04:40", "17:58"],
    lowTides: ["11:28"]
  },
  {
    date: "2026-03-10",
    highTides: ["05:23", "18:56"],
    lowTides: ["00:16", "12:13"]
  },
  {
    date: "2026-03-11",
    highTides: ["06:12", "19:57"],
    lowTides: ["01:05", "13:01"]
  },
  {
    date: "2026-03-12",
    highTides: ["07:05", "20:56"],
    lowTides: ["01:58", "13:54"]
  },
  {
    date: "2026-03-13",
    highTides: ["08:00", "21:49"],
    lowTides: ["02:52", "14:50"]
  },
  {
    date: "2026-03-14",
    highTides: ["08:55", "22:34"],
    lowTides: ["03:45", "15:45"]
  },
  {
    date: "2026-03-15",
    highTides: ["09:49", "23:12"],
    lowTides: ["04:36", "16:36"]
  },
  {
    date: "2026-03-16",
    highTides: ["10:41", "23:46"],
    lowTides: ["05:26", "17:23"]
  },
  {
    date: "2026-03-17",
    highTides: ["11:32"],
    lowTides: ["06:14", "18:08"]
  },
  {
    date: "2026-03-18",
    highTides: ["00:11", "12:22"],
    lowTides: ["07:01", "18:53"]
  },
  {
    date: "2026-03-19",
    highTides: ["00:54", "13:12"],
    lowTides: ["07:49", "19:39"]
  },
  {
    date: "2026-03-20",
    highTides: ["01:38", "14:03"],
    lowTides: ["08:39", "20:27"]
  },
  {
    date: "2026-03-21",
    highTides: ["02:24", "14:57"],
    lowTides: ["09:32", "21:19"]
  },
  {
    date: "2026-03-22",
    highTides: ["03:15", "15:55"],
    lowTides: ["10:29", "22:15"]
  }
];

// Helper function to format 24hr time to 12hr with AM/PM
export function formatTideTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Get tide data for a specific date
export function getTideDataForDate(dateKey: string): TideEvent | undefined {
  return TIDE_DATA.find(tide => tide.date === dateKey);
}

// Format tide times for display
export function formatTideDisplay(tides: string[]): string {
  if (tides.length === 0) return 'None';
  if (tides.length === 1) return formatTideTime(tides[0]);
  return tides.map(formatTideTime).join(' & ');
}
