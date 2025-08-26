import { AdminDashboard } from '@/components/AdminDashboard';
import { db } from '@/lib/firebaseAdmin';

type Member = {
  id: string;
  [key: string]: any;
  createdAt: string;
};

export default async function AdminDashboardPage() {
  let membersData: Member[] = [];

  try {
    const membersSnapshot = await db.collection('members').orderBy('createdAt', 'desc').get();
    
    membersData = membersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString(),
      };
    });
  } catch (error) {
    console.error("Failed to fetch members:", error);
  }

  return (
    <AdminDashboard members={membersData} />
  );
}