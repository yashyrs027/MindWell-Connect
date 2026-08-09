// Lightweight deterministic mock analytics generator + aggregator.
// Simulates what a real analytics API would return for a given date range.
// All dashboard sections should go through getAnalyticsForRange() rather
// than reading static arrays, so there's a single source of truth for
// "what data represents the currently selected period."

export interface MoodPoint {
  label: string;
  Anxiety: number;
  Stress: number;
  Happiness: number;
}

export interface ResourcePoint {
  name: string;
  usage: number;
  previousUsage: number;
}

export interface ConcernPoint {
  name: string;
  value: number;
  previousValue: number;
}

export interface AnalyticsResult {
  moodData: MoodPoint[];
  resourceData: ResourcePoint[];
  concernData: ConcernPoint[];
  isEmpty: boolean;
}

const RESOURCE_NAMES = ['Exam Anxiety', 'Meditation', 'Burnout', 'Friendships', 'Imposter Syndrome'];
const CONCERN_NAMES = ['Academics', 'Relationships', 'Anxiety', 'Loneliness'];

const DAY_MS = 24 * 60 * 60 * 1000;
const HISTORY_DAYS = 200; // how far back simulated data goes

// Seeded pseudo-random generator so a given day always yields the same
// numbers (stable across re-renders; no backend required).
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const toDateKey = (d: Date) => d.toISOString().slice(0, 10);

interface DailyRecord {
  date: string;
  Anxiety: number;
  Stress: number;
  Happiness: number;
  resourceUsage: Record<string, number>;
  concernCounts: Record<string, number>;
}

const generateDailyRecord = (daysAgo: number): DailyRecord => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);

  const base = daysAgo;
  const weekdayFactor = 1 + 0.15 * Math.sin((daysAgo / 7) * Math.PI * 2);

  const Anxiety = Math.round((25 + seededRandom(base * 1.1) * 25) * weekdayFactor);
  const Stress = Math.round((15 + seededRandom(base * 2.3) * 25) * weekdayFactor);
  const Happiness = Math.round(20 + seededRandom(base * 3.7) * 25);

  const resourceUsage: Record<string, number> = {};
  RESOURCE_NAMES.forEach((name, i) => {
    const rank = RESOURCE_NAMES.length - i;
    resourceUsage[name] = Math.max(0, Math.round(seededRandom(base * (5 + i)) * 4 * rank));
  });

  const concernCounts: Record<string, number> = {};
  CONCERN_NAMES.forEach((name, i) => {
    const rank = CONCERN_NAMES.length - i;
    concernCounts[name] = Math.max(0, Math.round(seededRandom(base * (11 + i)) * 3 * rank));
  });

  return { date: toDateKey(date), Anxiety, Stress, Happiness, resourceUsage, concernCounts };
};

let cachedHistory: DailyRecord[] | null = null;
const getHistory = (): DailyRecord[] => {
  if (cachedHistory) return cachedHistory;
  const records: DailyRecord[] = [];
  for (let i = HISTORY_DAYS; i >= 0; i--) records.push(generateDailyRecord(i));
  cachedHistory = records;
  return records;
};

const recordsInRange = (start: Date, end: Date): DailyRecord[] => {
  const startKey = toDateKey(start);
  const endKey = toDateKey(end);
  return getHistory().filter(r => r.date >= startKey && r.date <= endKey);
};

// Bucket size adapts to range length so charts stay readable at any zoom.
const bucketMoodData = (records: DailyRecord[]): MoodPoint[] => {
  if (records.length === 0) return [];
  const bucketSize = records.length <= 14 ? 1 : records.length <= 90 ? 7 : 30;

  const buckets: MoodPoint[] = [];
  for (let i = 0; i < records.length; i += bucketSize) {
    const slice = records.slice(i, i + bucketSize);
    const avg = (key: 'Anxiety' | 'Stress' | 'Happiness') =>
      Math.round(slice.reduce((sum, r) => sum + r[key], 0) / slice.length);
    const label = new Date(slice[0].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    buckets.push({ label, Anxiety: avg('Anxiety'), Stress: avg('Stress'), Happiness: avg('Happiness') });
  }
  return buckets;
};

const aggregateResources = (current: DailyRecord[], previous: DailyRecord[]): ResourcePoint[] =>
  RESOURCE_NAMES.map(name => ({
    name,
    usage: current.reduce((sum, r) => sum + (r.resourceUsage[name] || 0), 0),
    previousUsage: previous.reduce((sum, r) => sum + (r.resourceUsage[name] || 0), 0),
  }));

const aggregateConcerns = (current: DailyRecord[], previous: DailyRecord[]): ConcernPoint[] =>
  CONCERN_NAMES.map(name => ({
    name,
    value: current.reduce((sum, r) => sum + (r.concernCounts[name] || 0), 0),
    previousValue: previous.reduce((sum, r) => sum + (r.concernCounts[name] || 0), 0),
  }));

/**
 * Returns aggregated analytics for an arbitrary date range, plus the
 * equivalent immediately-preceding period (same length) used to compute
 * "vs previous period" trends throughout the dashboard.
 */
export const getAnalyticsForRange = (start: Date, end: Date): AnalyticsResult => {
  const normalizedStart = new Date(start);
  normalizedStart.setHours(0, 0, 0, 0);
  const normalizedEnd = new Date(end);
  normalizedEnd.setHours(0, 0, 0, 0);

  const rangeDays = Math.max(1, Math.round((normalizedEnd.getTime() - normalizedStart.getTime()) / DAY_MS) + 1);
  const previousEnd = new Date(normalizedStart.getTime() - DAY_MS);
  const previousStart = new Date(previousEnd.getTime() - (rangeDays - 1) * DAY_MS);

  const currentRecords = recordsInRange(normalizedStart, normalizedEnd);
  const previousRecords = recordsInRange(previousStart, previousEnd);

  return {
    moodData: bucketMoodData(currentRecords),
    resourceData: aggregateResources(currentRecords, previousRecords),
    concernData: aggregateConcerns(currentRecords, previousRecords),
    isEmpty: currentRecords.length === 0,
  };
};

export const MAX_HISTORY_DAYS = HISTORY_DAYS;