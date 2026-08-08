import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Sector } from 'recharts';
import Card from './common/Card';

const moodData = [
  { name: 'Week 1', Anxiety: 40, Stress: 24, Happiness: 20 },
  { name: 'Week 2', Anxiety: 30, Stress: 13, Happiness: 30 },
  { name: 'Week 3', Anxiety: 45, Stress: 38, Happiness: 25 },
  { name: 'Week 4', Anxiety: 27, Stress: 29, Happiness: 40 },
  { name: 'Week 5', Anxiety: 38, Stress: 30, Happiness: 32 },
  { name: 'Week 6', Anxiety: 55, Stress: 48, Happiness: 18 },
];

// NEW: previousUsage is a mock baseline representing the prior comparable
// period, so "engagement changed by X%" is computed, not hard-coded.
interface ResourceDatum {
  name: string;
  usage: number;
  previousUsage: number;
}

const resourceData: ResourceDatum[] = [
  { name: 'Exam Anxiety', usage: 400, previousUsage: 340 },
  { name: 'Meditation', usage: 300, previousUsage: 260 },
  { name: 'Burnout', usage: 280, previousUsage: 300 },
  { name: 'Friendships', usage: 200, previousUsage: 190 },
  { name: 'Imposter Syndrome', usage: 150, previousUsage: 120 },
];

// NEW: previousValue is a mock baseline for the prior period.
interface ConcernDatum {
  name: string;
  value: number;
  previousValue: number;
}

const concernData: ConcernDatum[] = [
  { name: 'Academics', value: 45, previousValue: 38 },
  { name: 'Relationships', value: 25, previousValue: 27 },
  { name: 'Anxiety', value: 20, previousValue: 18 },
  { name: 'Loneliness', value: 10, previousValue: 9 },
];

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
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} cases`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">{`(Rate ${(percent * 100).toFixed(2)}%)`}</text>
    </g>
  );
};

const PieAny = Pie as any;

// ---------------------------------------------------------------------------
// NEW: Platform Insights engine
// All insights below are computed from the same moodData / resourceData /
// concernData used by the charts above — nothing here is a hard-coded
// message. Only aggregate names and percentages are ever surfaced; no
// individual user or conversation is referenced anywhere in this logic.
// ---------------------------------------------------------------------------

interface Insight {
  id: string;
  icon: string;
  text: string;
  direction: 'up' | 'down' | 'neutral';
  changeLabel?: string; // e.g. "+18%"
}

const MEANINGFUL_CHANGE_THRESHOLD = 5; // percent; smaller shifts are treated as noise

const pctChange = (current: number, previous: number): number => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
};

const generateInsights = (): Insight[] => {
  const insights: Insight[] = [];

  // --- Overall resource engagement (sum of usage vs sum of previousUsage) ---
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

  // --- Most accessed resource (derived, not hard-coded) ---
  const topResource = resourceData.reduce((max, r) => (r.usage > max.usage ? r : max), resourceData[0]);
  if (topResource) {
    insights.push({
      id: 'top-resource',
      icon: '📚',
      text: `"${topResource.name}" is currently the most accessed resource.`,
      direction: 'neutral',
    });
  }

  // --- Most common concern ---
  const topConcern = concernData.reduce((max, c) => (c.value > max.value ? c : max), concernData[0]);
  if (topConcern) {
    insights.push({
      id: 'top-concern',
      icon: '⚠️',
      text: `${topConcern.name} is currently one of the most common concerns raised.`,
      direction: 'neutral',
    });
  }

  // --- Fastest-rising concern (only surfaced if the shift is meaningful) ---
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

  // --- Mood trend: compare average of first 2 weeks vs last 2 weeks ---
  const compareMoodTrend = (metric: 'Anxiety' | 'Stress' | 'Happiness'): number => {
    const early = moodData.slice(0, 2).reduce((sum, w) => sum + w[metric], 0) / 2;
    const recent = moodData.slice(-2).reduce((sum, w) => sum + w[metric], 0) / 2;
    return pctChange(recent, early);
  };

  (['Anxiety', 'Stress', 'Happiness'] as const).forEach(metric => {
    const change = compareMoodTrend(metric);
    if (Math.abs(change) >= MEANINGFUL_CHANGE_THRESHOLD * 2) {
      // Higher threshold for mood metrics to avoid over-reporting normal week-to-week noise.
      insights.push({
        id: `mood-${metric.toLowerCase()}`,
        icon: metric === 'Happiness' ? '🙂' : '📊',
        text: `Average reported ${metric.toLowerCase()} has trended ${change > 0 ? 'upward' : 'downward'} over the past ${moodData.length} weeks.`,
        direction: change > 0 ? 'up' : 'down',
        changeLabel: `${change > 0 ? '+' : '-'}${Math.round(Math.abs(change))}%`,
      });
    }
  });

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

const InsightsSkeleton: React.FC = () => (
  <div className="space-y-3" aria-hidden="true">
    {[0, 1, 2].map(i => (
      <div key={i} className="flex items-center gap-3 animate-pulse">
        <div className="h-8 w-8 rounded-full bg-slate-200 flex-shrink-0" />
        <div className="h-4 bg-slate-200 rounded w-full max-w-md" />
      </div>
    ))}
  </div>
);

const PlatformInsights: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    // Simulates the (currently synchronous, future potentially async) work
    // of aggregating platform analytics into insights.
    const timer = setTimeout(() => {
      setInsights(generateInsights());
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg text-slate-700 mb-1">Platform Insights</h3>
      <p className="text-sm text-slate-500 mb-4">Aggregated trends across all students — no individual data shown.</p>

      {isLoading ? (
        <InsightsSkeleton />
      ) : insights.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No notable trends to report for this period.</p>
      ) : (
        <ul className="space-y-3">
          {insights.map(insight => (
            <li key={insight.id} className="flex items-start gap-3">
              <span className="text-xl leading-none flex-shrink-0" aria-hidden="true">{insight.icon}</span>
              <span className="text-sm text-slate-700 flex items-center flex-wrap">
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
// --- Ranked resource data with computed usage trend (% vs previous period) ---
interface RankedResource extends ResourceDatum {
  rank: number;
  changePercent: number;
}

const getRankedResources = (): RankedResource[] => {
  return [...resourceData]
    .sort((a, b) => b.usage - a.usage)
    .map((r, index) => ({
      ...r,
      rank: index + 1,
      changePercent: r.previousUsage === 0
        ? 0
        : ((r.usage - r.previousUsage) / r.previousUsage) * 100,
    }));
};

// --- Custom tooltip: shows views + trend, not just the raw bar value ---
const ResourceTooltip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const data: RankedResource = payload[0].payload;
  const trendUp = data.changePercent >= 0;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-4 py-3 text-sm">
      <p className="font-bold text-slate-800">{data.name}</p>
      <p className="text-slate-600 mt-1">{data.usage.toLocaleString()} views</p>
      <p className={`mt-1 font-semibold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
        {trendUp ? '▲' : '▼'} {Math.abs(data.changePercent).toFixed(1)}% vs previous period
      </p>
      <p className="text-slate-400 text-xs mt-1">Rank #{data.rank} of {resourceData.length}</p>
    </div>
  );
};

// --- Small trend badge used in the ranked list below the chart ---
const TrendIndicator: React.FC<{ changePercent: number }> = ({ changePercent }) => {
  const isUp = changePercent >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
      {isUp ? '▲' : '▼'} {Math.abs(changePercent).toFixed(0)}%
    </span>
  );
};

const Dashboard: React.FC = () => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-800">Administrator Dashboard</h1>
                <p className="mt-2 text-slate-600">Anonymous insights into student well-being trends.</p>
            </div>

            {/* NEW: Platform Insights section */}
            <PlatformInsights />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6">
                    <h3 className="font-bold text-lg text-slate-700 mb-4">Weekly Mood Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={moodData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Anxiety" stroke="#ef4444" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="Stress" stroke="#f97316" />
                            <Line type="monotone" dataKey="Happiness" stroke="#22c55e" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-lg text-slate-700 mb-4">Top Concerns (from AI Chat)</h3>
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
                </Card>
            </div>

            <Card className="p-6">
                <h3 className="font-bold text-lg text-slate-700">Most Accessed Resources</h3>
                <p className="text-sm text-slate-500 mb-4">Total views per resource, ranked, with change vs the previous period.</p>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getRankedResources()} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" label={{ value: 'Total Views', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }} />
                        <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 13 }} />
                        <Tooltip content={<ResourceTooltip />} />
                        <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 8 }} />
                        <Bar dataKey="usage" name="Views" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>

                {/* Ranked list — clearer side-by-side comparison than reading bar lengths alone */}
                <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
                    {getRankedResources().map((r) => (
                        <li key={r.name} className="flex items-center justify-between py-2.5 text-sm">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
                                    {r.rank}
                                </span>
                                <span className="font-medium text-slate-700 truncate">{r.name}</span>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-slate-500">{r.usage.toLocaleString()} views</span>
                                <TrendIndicator changePercent={r.changePercent} />
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default Dashboard;