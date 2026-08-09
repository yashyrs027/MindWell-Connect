import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Sector } from 'recharts';
import Card from './common/Card';
import DateRangeFilter from './common/DateRangeFilter';
import { useAnalyticsData, DateRange } from '../hooks/useAnalyticsData';
import type { MoodPoint, ResourcePoint, ConcernPoint } from '../services/analyticsService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="currentColor" className="fill-slate-700 dark:fill-slate-200">{`${value} cases`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="currentColor" className="fill-slate-400">{`(Rate ${(percent * 100).toFixed(2)}%)`}</text>
    </g>
  );
};

const PieAny = Pie as any;

// --- Platform Insights: derived from props, not static arrays ---
interface Insight {
  id: string;
  icon: string;
  text: string;
  direction: 'up' | 'down' | 'neutral';
  changeLabel?: string;
}

const MEANINGFUL_CHANGE_THRESHOLD = 5;

const pctChange = (current: number, previous: number): number => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
};

const generateInsights = (moodData: MoodPoint[], resourceData: ResourcePoint[], concernData: ConcernPoint[]): Insight[] => {
  const insights: Insight[] = [];
  if (resourceData.length === 0 || concernData.length === 0) return insights;

  const totalCurrentUsage = resourceData.reduce((sum, r) => sum + r.usage, 0);
  const totalPreviousUsage = resourceData.reduce((sum, r) => sum + r.previousUsage, 0);
  const engagementChange = pctChange(totalCurrentUsage, totalPreviousUsage);

  if (Math.abs(engagementChange) >= MEANINGFUL_CHANGE_THRESHOLD) {
    const rounded = Math.round(Math.abs(engagementChange));
    insights.push({
      id: 'engagement-change',
      icon: engagementChange > 0 ? '📈' : '📉',
      text: `Resource engagement ${engagementChange > 0 ? 'increased' : 'decreased'} by ${rounded}% compared with the previous period.`,
      direction: engagementChange > 0 ? 'up' : 'down',
      changeLabel: `${engagementChange > 0 ? '+' : '-'}${rounded}%`,
    });
  }

  const topResource = resourceData.reduce((max, r) => (r.usage > max.usage ? r : max), resourceData[0]);
  if (topResource && topResource.usage > 0) {
    insights.push({ id: 'top-resource', icon: '📚', text: `"${topResource.name}" is currently the most accessed resource.`, direction: 'neutral' });
  }

  const topConcern = concernData.reduce((max, c) => (c.value > max.value ? c : max), concernData[0]);
  if (topConcern && topConcern.value > 0) {
    insights.push({ id: 'top-concern', icon: '⚠️', text: `${topConcern.name} is currently one of the most common concerns raised.`, direction: 'neutral' });
  }

  const concernWithBiggestRise = concernData.reduce((max, c) => {
    const change = pctChange(c.value, c.previousValue);
    const maxChange = pctChange(max.value, max.previousValue);
    return change > maxChange ? c : max;
  }, concernData[0]);
  const risingConcernChange = pctChange(concernWithBiggestRise.value, concernWithBiggestRise.previousValue);
  if (risingConcernChange >= MEANINGFUL_CHANGE_THRESHOLD) {
    insights.push({
      id: 'rising-concern',
      icon: '💬',
      text: `${concernWithBiggestRise.name}-related concerns are up ${Math.round(risingConcernChange)}% compared with the previous period.`,
      direction: 'up',
      changeLabel: `+${Math.round(risingConcernChange)}%`,
    });
  }

  if (moodData.length >= 2) {
    const compareMoodTrend = (metric: 'Anxiety' | 'Stress' | 'Happiness'): number => {
      const half = Math.max(1, Math.floor(moodData.length / 2));
      const early = moodData.slice(0, half).reduce((sum, w) => sum + w[metric], 0) / half;
      const recent = moodData.slice(-half).reduce((sum, w) => sum + w[metric], 0) / half;
      return pctChange(recent, early);
    };

    (['Anxiety', 'Stress', 'Happiness'] as const).forEach(metric => {
      const change = compareMoodTrend(metric);
      if (Math.abs(change) >= MEANINGFUL_CHANGE_THRESHOLD * 2) {
        insights.push({
          id: `mood-${metric.toLowerCase()}`,
          icon: metric === 'Happiness' ? '🙂' : '📊',
          text: `Average reported ${metric.toLowerCase()} has trended ${change > 0 ? 'upward' : 'downward'} over the selected period.`,
          direction: change > 0 ? 'up' : 'down',
          changeLabel: `${change > 0 ? '+' : '-'}${Math.round(Math.abs(change))}%`,
        });
      }
    });
  }

  return insights;
};

const TrendBadge: React.FC<{ direction: Insight['direction']; changeLabel?: string }> = ({ direction, changeLabel }) => {
  if (!changeLabel) return null;
  const arrow = direction === 'up' ? '▲' : direction === 'down' ? '▼' : '';
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
      {arrow} {changeLabel}
    </span>
  );
};

const SectionSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="space-y-3" aria-hidden="true">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 animate-pulse">
        <div className="h-8 w-8 rounded-full bg-slate-200 flex-shrink-0" />
        <div className="h-4 bg-slate-200 rounded w-full max-w-md" />
      </div>
    ))}
  </div>
);

const PlatformInsights: React.FC<{
  moodData: MoodPoint[]; resourceData: ResourcePoint[]; concernData: ConcernPoint[]; isLoading: boolean; isEmpty: boolean;
}> = ({ moodData, resourceData, concernData, isLoading, isEmpty }) => {
  const insights = useMemo(() => generateInsights(moodData, resourceData, concernData), [moodData, resourceData, concernData]);

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-1">Platform Insights</h3>
     <p className="text-sm text-slate-500 dark:text-slate-400 mb-4"> Aggregated trends for the selected period — no individual data shown.</p>

      {isLoading ? (
        <SectionSkeleton />
      ) : isEmpty ? (
        <p className="text-sm text-slate-500 italic">No activity recorded for the selected period.</p>
      ) : insights.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No notable trends to report for this period.</p>
      ) : (
        <ul className="space-y-3">
          {insights.map(insight => (
            <li key={insight.id} className="flex items-start gap-3">
              <span className="text-xl leading-none flex-shrink-0" aria-hidden="true">{insight.icon}</span>
              <span className="text-sm text-slate-700 dark:text-slate-200 flex items-center flex-wrap">
                {insight.text}
                <TrendBadge direction={insight.direction} changeLabel={insight.changeLabel} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

// --- Most Accessed Resources: ranked, with trend, driven by props ---
interface RankedResource extends ResourcePoint {
  rank: number;
  changePercent: number;
}

const rankResources = (resourceData: ResourcePoint[]): RankedResource[] =>
  [...resourceData]
    .sort((a, b) => b.usage - a.usage)
    .map((r, index) => ({ ...r, rank: index + 1, changePercent: pctChange(r.usage, r.previousUsage) }));

const ResourceTooltip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const data: RankedResource = payload[0].payload;
  const trendUp = data.changePercent >= 0;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg px-4 py-3 text-sm">
      <p className="font-bold text-slate-800 dark:text-white">{data.name}</p>
      <p className="text-slate-600 dark:text-slate-300 mt-1">{data.usage.toLocaleString()} views</p>
      <p className={`mt-1 font-semibold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
        {trendUp ? '▲' : '▼'} {Math.abs(data.changePercent).toFixed(1)}% vs previous period
      </p>
      <p className="text-slate-400 text-xs mt-1">Rank #{data.rank}</p>
    </div>
  );
};

const TrendIndicator: React.FC<{ changePercent: number }> = ({ changePercent }) => {
  const isUp = changePercent >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
      {isUp ? '▲' : '▼'} {Math.abs(changePercent).toFixed(0)}%
    </span>
  );
};

const getDefaultRange = (): DateRange => {
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - 29); // Last 30 Days
  return { start, end };
};

const Dashboard: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [range, setRange] = useState<DateRange>(getDefaultRange());
  const [periodLabel, setPeriodLabel] = useState('Last 30 Days');

  const { data, isLoading, error } = useAnalyticsData(range);
  const onPieEnter = (_: any, index: number) => setActiveIndex(index);

  const moodData = data?.moodData ?? [];
  const resourceData = data?.resourceData ?? [];
  const concernData = data?.concernData ?? [];
  const isEmpty = !isLoading && !!data && data.isEmpty;
  const rankedResources = useMemo(() => rankResources(resourceData), [resourceData]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Administrator Dashboard</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Anonymous insights into student well-being trends.</p>

      </div>

      <Card className="p-4">
        <DateRangeFilter onChange={(newRange, label) => { setRange(newRange); setPeriodLabel(label); }} />
        <p className="text-xs text-slate-400 mt-2">Showing data for: <span className="font-semibold text-slate-600">{periodLabel}</span></p>
      </Card>

      {error && (
        <Card className="p-4 bg-red-50 border-l-4 border-red-400">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </Card>
      )}

      <PlatformInsights moodData={moodData} resourceData={resourceData} concernData={concernData} isLoading={isLoading} isEmpty={isEmpty} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-4">
Mood Trends</h3>
          {isLoading ? (
            <SectionSkeleton rows={4} />
          ) : isEmpty || moodData.length === 0 ? (
            <p className="text-sm text-slate-500 italic py-10 text-center">No mood data for the selected period.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis label={{ value: 'Avg. reported score', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Anxiety" stroke="#ef4444" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Stress" stroke="#f97316" />
                <Line type="monotone" dataKey="Happiness" stroke="#22c55e" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-4">
Top Concerns (from AI Chat)</h3>
          {isLoading ? (
            <SectionSkeleton rows={4} />
          ) : isEmpty || concernData.every(c => c.value === 0) ? (
            <p className="text-sm text-slate-500 italic py-10 text-center">No concern data for the selected period.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <PieAny
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={concernData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {concernData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </PieAny>
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200">Most Accessed Resources</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Total views per resource for the selected period, ranked, with change vs the previous period.</p>

        {isLoading ? (
          <SectionSkeleton rows={5} />
        ) : isEmpty || rankedResources.every(r => r.usage === 0) ? (
          <p className="text-sm text-slate-500 italic py-10 text-center">No resource activity for the selected period.</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rankedResources} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" label={{ value: 'Total Views', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 13 }} />
                <Tooltip content={<ResourceTooltip />} />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 8 }} />
                <Bar dataKey="usage" name="Views" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
              {rankedResources.map((r) => (
                <li key={r.name} className="flex items-center justify-between py-2.5 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center">
                      {r.rank}
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-200 truncate">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-slate-500 dark:text-slate-400">{r.usage.toLocaleString()} views</span>
                    <TrendIndicator changePercent={r.changePercent} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;