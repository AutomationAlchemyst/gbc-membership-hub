"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { Member } from "@/lib/types"

interface BusinessTypeChartProps {
  members: Member[]
}

export function BusinessTypeChart({ members }: BusinessTypeChartProps) {
  const data = React.useMemo(() => {
    const counts = members.reduce((acc, member) => {
      const type = member.businessType;
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
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border) / 0.5)" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip 
                    cursor={{ fill: "hsl(var(--accent) / 0.2)" }}
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                    }}
                />
                <Bar dataKey="value" name="Members" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
