import { useState, useEffect } from 'react';
import { getAnalyticsForRange, AnalyticsResult } from '../services/analyticsService';

export interface DateRange {
  start: Date;
  end: Date;
}

interface UseAnalyticsDataResult {
  data: AnalyticsResult | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Single shared data-fetching hook for all dashboard analytics.
 * Every dashboard section consumes its slice of `data` from here instead
 * of fetching/aggregating independently.
 */
export const useAnalyticsData = (range: DateRange): UseAnalyticsDataResult => {
  const [data, setData] = useState<AnalyticsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    // Simulates the latency of a real analytics API call.
    const timer = setTimeout(() => {
      if (cancelled) return;
      try {
        if (range.start > range.end) {
          throw new Error('Start date must be before end date.');
        }
        setData(getAnalyticsForRange(range.start, range.end));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load analytics.');
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }, 450);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [range.start.getTime(), range.end.getTime()]);

  return { data, isLoading, error };
};