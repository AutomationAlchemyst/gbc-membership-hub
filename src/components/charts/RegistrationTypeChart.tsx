"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"
import type { Member } from "@/lib/types"

interface RegistrationTypeChartProps {
  members: Member[]
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function RegistrationTypeChart({ members }: RegistrationTypeChartProps) {
  const data = React.useMemo(() => {
    const counts = members.reduce((acc, member) => {
      const type = member.businessRegistrationType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [members]);

  if (data.length === 0) {
    return (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
            No data to display
        </div>
    )
  }

  return (
    <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip
                  cursor={{ fill: "hsl(var(--background))" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconSize={8} />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
}
