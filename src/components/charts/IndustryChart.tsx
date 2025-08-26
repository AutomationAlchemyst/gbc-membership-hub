'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type IndustryChartProps = {
  industryData: { businessType: string; [key: string]: any }[];
};

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function IndustryChart({ industryData }: IndustryChartProps) {
  if (industryData.length === 0) {
    return <div className="flex items-center justify-center h-80 text-muted-foreground">No industry data to display</div>;
  }

  // Get all possible registration types from the data
  const registrationTypes = industryData.reduce<string[]>((acc, item) => {
    Object.keys(item).forEach(key => {
      if (key !== 'businessType' && !acc.includes(key)) {
        acc.push(key);
      }
    });
    return acc;
  }, []);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={industryData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="businessType" />
          <YAxis />
          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
          <Legend />
          {registrationTypes.map((type, index) => (
            <Bar key={type} dataKey={type} fill={COLORS[index % COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
