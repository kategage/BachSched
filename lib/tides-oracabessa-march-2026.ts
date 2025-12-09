// lib/tides-oracabessa-march-2026.ts

export type TideEvent = {
  time: string;      // local time (hh:mm, 24h or am/pm – your choice)
  heightFt: number;  // tide height in feet
};

export type TideDay = {
  date: string;      // ISO date string
  high: TideEvent[];
  low: TideEvent[];
};

// Approximate tides for Oracabessa based on Port Maria predictions
// Source: SeaTemperatu.re long-term tide schedule for Port Maria, March 2026.
export const oracabessaTidesMarch2026: TideDay[] = [
  {
    date: '2026-03-06',
    low:  [
      { time: '05:03', heightFt: 0.6 },
      { time: '17:04', heightFt: 0.4 },
    ],
    high: [
      { time: '10:28', heightFt: 1.1 },
      { time: '23:37', heightFt: 1.1 },
    ],
  },
  {
    date: '2026-03-07',
    low:  [
      { time: '05:51', heightFt: 0.7 },
      { time: '17:35', heightFt: 0.4 },
    ],
    high: [
      { time: '10:52', heightFt: 1.0 },
      // (next high is after midnight on the 8th, so it appears on the next day)
    ],
  },
  {
    date: '2026-03-08',
    low:  [
      { time: '06:57', heightFt: 0.7 },
      { time: '18:16', heightFt: 0.4 },
    ],
    high: [
      { time: '00:30', heightFt: 1.1 },
      { time: '11:20', heightFt: 0.9 },
    ],
  },
  {
    date: '2026-03-09',
    low:  [
      { time: '08:45', heightFt: 0.8 },
      { time: '19:17', heightFt: 0.4 },
    ],
    high: [
      { time: '01:40', heightFt: 1.0 },
      { time: '11:57', heightFt: 0.8 },
    ],
  },
  {
    date: '2026-03-10',
    low:  [
      { time: '10:54', heightFt: 0.7 },
      { time: '20:49', heightFt: 0.5 },
    ],
    high: [
      { time: '03:18', heightFt: 1.0 },
      { time: '13:10', heightFt: 0.7 },
    ],
  },
  {
    date: '2026-03-11',
    low:  [
      { time: '12:03', heightFt: 0.6 },
      { time: '22:16', heightFt: 0.4 },
    ],
    high: [
      { time: '04:52', heightFt: 1.0 },
      { time: '15:35', heightFt: 0.7 },
    ],
  },
  {
    date: '2026-03-12',
    low:  [
      { time: '12:40', heightFt: 0.6 },
      { time: '23:19', heightFt: 0.4 },
    ],
    high: [
      { time: '05:52', heightFt: 1.1 },
      { time: '17:13', heightFt: 0.8 },
    ],
  },
  {
    date: '2026-03-13',
    low:  [
      { time: '13:07', heightFt: 0.6 },
      // next low after 18:04 isn't listed separately in the snippet
    ],
    high: [
      { time: '06:31', heightFt: 1.2 },
      { time: '18:04', heightFt: 0.8 },
    ],
  },
  {
    date: '2026-03-14',
    low:  [
      { time: '00:06', heightFt: 0.4 },
      { time: '13:28', heightFt: 0.6 },
    ],
    high: [
      { time: '07:00', heightFt: 1.2 },
      { time: '18:39', heightFt: 0.9 },
    ],
  },
  {
    date: '2026-03-15',
    low:  [
      { time: '00:44', heightFt: 0.4 },
      { time: '13:46', heightFt: 0.5 },
    ],
    high: [
      { time: '07:22', heightFt: 1.3 },
      { time: '19:11', heightFt: 1.0 },
    ],
  },
  {
    date: '2026-03-16',
    low:  [
      { time: '01:19', heightFt: 0.4 },
      { time: '14:04', heightFt: 0.5 },
    ],
    high: [
      { time: '07:43', heightFt: 1.3 },
      { time: '19:44', heightFt: 1.2 },
    ],
  },
  {
    date: '2026-03-17',
    low:  [
      { time: '01:54', heightFt: 0.4 },
      { time: '14:26', heightFt: 0.5 },
    ],
    high: [
      { time: '08:06', heightFt: 1.3 },
      { time: '20:20', heightFt: 1.3 },
    ],
  },
  {
    date: '2026-03-18',
    low:  [
      { time: '02:31', heightFt: 0.5 },
      { time: '14:52', heightFt: 0.4 },
    ],
    high: [
      { time: '08:32', heightFt: 1.3 },
      { time: '21:00', heightFt: 1.4 },
    ],
  },
  {
    date: '2026-03-19',
    low:  [
      { time: '03:12', heightFt: 0.5 },
      { time: '15:24', heightFt: 0.3 },
    ],
    high: [
      { time: '09:03', heightFt: 1.3 },
      { time: '21:44', heightFt: 1.4 },
    ],
  },
  {
    date: '2026-03-20',
    low:  [
      { time: '03:58', heightFt: 0.5 },
      { time: '16:01', heightFt: 0.3 },
    ],
    high: [
      { time: '09:37', heightFt: 1.2 },
      { time: '22:33', heightFt: 1.4 },
    ],
  },
  {
    date: '2026-03-21',
    low:  [
      { time: '04:49', heightFt: 0.6 },
      { time: '16:44', heightFt: 0.3 },
    ],
    high: [
      { time: '10:15', heightFt: 1.1 },
      { time: '23:29', heightFt: 1.3 },
    ],
  },
  {
    date: '2026-03-22',
    low:  [
      { time: '05:51', heightFt: 0.6 },
      { time: '17:34', heightFt: 0.3 },
    ],
    high: [
      { time: '10:57', heightFt: 1.0 },
      // next high appears just after midnight on the 23rd
    ],
  },
];
