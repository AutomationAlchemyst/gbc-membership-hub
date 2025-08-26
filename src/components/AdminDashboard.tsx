"use client";

import type { Member } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BusinessTypeChart } from '@/components/charts/BusinessTypeChart';
import { RegistrationTypeChart } from '@/components/charts/RegistrationTypeChart';
import { MemberDataTable } from '@/components/MemberDataTable';
import { Users, BarChart3, PieChartIcon } from 'lucide-react';

type AdminDashboardProps = {
  members: Member[];
};

export function AdminDashboard({ members }: AdminDashboardProps) {
  return (
    // This class is the key: it calculates the max width dynamically.
    // 100vw is the full viewport width.
    // var(--sidebar-width) is the 16rem variable from your layout.
    <div className="w-full max-w-[calc(100vw-var(--sidebar-width))]">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.length}</div>
              <p className="text-xs text-muted-foreground">Registered in the GBC community</p>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-headline">
                <PieChartIcon className="h-5 w-5 text-primary" />
                <span>By Registration Type</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RegistrationTypeChart members={members} />
            </CardContent>
          </Card>
          <Card className="col-span-1 md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-headline">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>By Business Type</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BusinessTypeChart members={members} />
            </CardContent>
          </Card>
        </div>
        <div>
          <MemberDataTable data={members} />
        </div>
      </div>
    </div>
  );
}