'use client';

import type { Member } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BusinessTypeChart } from '@/components/charts/BusinessTypeChart';
import { RegistrationTypeChart } from '@/components/charts/RegistrationTypeChart';
import { MemberDataTable } from '@/components/MemberDataTable';
import { Users, BarChart3, PieChartIcon, LineChart, Briefcase, UserCheck } from 'lucide-react';
import { GrowthChart } from './charts/GrowthChart';
import { IndustryChart } from './charts/IndustryChart';
import { RoleChart } from './charts/RoleChart';

type AdminDashboardProps = {
  members: Member[];
  growthData: { month: string; count: number }[];
  industryData: { businessType: string; [key: string]: any }[];
  roleData: { name: string; count: number }[];
};

export function AdminDashboard({ members, growthData, industryData, roleData }:
    AdminDashboardProps) {
    return (
        <div className="w-full h-full">
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
                    <Card className="col-span-1 min-w-0">
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
                    <Card className="col-span-1 md:col-span-2 lg:col-span-1 min-w-0">
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
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    <Card className="lg:col-span-2 min-w-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-headline">
                                <LineChart className="h-5 w-5 text-primary" />
                                <span>Membership Growth (Last 12 Months)</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <GrowthChart growthData={growthData} />
                        </CardContent>
                    </Card>
                    <Card className="min-w-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-headline">
                                <Briefcase className="h-5 w-5 text-primary" />
                                <span>Industry Deep Dive</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <IndustryChart industryData={industryData} />
                        </CardContent>
                    </Card>
                    <Card className="min-w-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-headline">
                                <UserCheck className="h-5 w-5 text-primary" />
                                <span>Member Role Analysis</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RoleChart roleData={roleData} />
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
