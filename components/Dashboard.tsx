
import React from 'react';
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

const resourceData = [
  { name: 'Exam Anxiety', usage: 400 },
  { name: 'Meditation', usage: 300 },
  { name: 'Burnout', usage: 280 },
  { name: 'Friendships', usage: 200 },
  { name: 'Imposter Syndrome', usage: 150 },
];

const concernData = [
  { name: 'Academics', value: 45 },
  { name: 'Relationships', value: 25 },
  { name: 'Anxiety', value: 20 },
  { name: 'Loneliness', value: 10 },
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
                <h3 className="font-bold text-lg text-slate-700 mb-4">Most Accessed Resources</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={resourceData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={120} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="usage" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default Dashboard;
