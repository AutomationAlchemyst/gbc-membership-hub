import { AdminDashboard } from '@/components/AdminDashboard';
import { db } from '@/lib/firebaseAdmin';
import type { Member } from '@/lib/types';

export default async function AdminDashboardPage() {
  let membersData: Member[] = [];

  try {
    const membersSnapshot = await db.collection('members').orderBy('createdAt', 'desc').get();
    
    membersData = membersSnapshot.docs.map(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
      return {
        id: doc.id,
        ...data,
        createdAt: createdAt.toISOString(),
      } as Member;
    });
  } catch (error) {
    console.error("Failed to fetch members:", error);
  }

  // Part 1a: Growth Data
  const growthDataMap = new Map<string, number>();
  const monthLabels = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toISOString().slice(0, 7); // YYYY-MM
  }).reverse();

  monthLabels.forEach(label => growthDataMap.set(label, 0));

  membersData.forEach(member => {
    if (member.createdAt) {
      const month = member.createdAt.slice(0, 7);
      if (growthDataMap.has(month)) {
        growthDataMap.set(month, growthDataMap.get(month)! + 1);
      }
    }
  });

  let cumulativeTotal = 0;
  const growthData = monthLabels.map(month => {
    cumulativeTotal += growthDataMap.get(month)!;
    return { month, count: cumulativeTotal };
  });

  // Part 1b: Industry Data
  const industryDataMap: Record<string, Record<string, number>> = {};
  membersData.forEach(member => {
    const { businessType, businessRegistrationType } = member;
    if (!businessType || !businessRegistrationType) return;

    if (!industryDataMap[businessType]) {
      industryDataMap[businessType] = {};
    }
    if (!industryDataMap[businessType][businessRegistrationType]) {
      industryDataMap[businessType][businessRegistrationType] = 0;
    }
    industryDataMap[businessType][businessRegistrationType]++;
  });

  const industryData = Object.entries(industryDataMap).map(([businessType, values]) => ({
    businessType,
    ...values,
  }));

  // Part 1c: Role Data
  const roleDataMap: Record<string, number> = {};
  membersData.forEach(member => {
    const { designation } = member;
    if (!designation) return;
    roleDataMap[designation] = (roleDataMap[designation] || 0) + 1;
  });
  const roleData = Object.entries(roleDataMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <AdminDashboard 
      members={membersData} 
      growthData={growthData}
      industryData={industryData}
      roleData={roleData}
    />
  );
}