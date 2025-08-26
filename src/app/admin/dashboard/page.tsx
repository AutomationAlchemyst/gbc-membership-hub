import { AdminDashboard } from '@/components/AdminDashboard';
import { db } from '@/lib/firebaseAdmin';

// Define a type for your member data for better code safety
type Member = {
  id: string;
  [key: string]: any; // Allows for any other properties from your document
  createdAt: string; // Ensure createdAt is a string after serialization
};

/**
 * This is an async Server Component.
 * It fetches data on the server before the page is sent to the client.
 */
export default async function AdminDashboardPage() {
  let membersData: Member[] = [];

  try {
    // Fetch all documents from the 'members' collection, ordered by creation date
    const membersSnapshot = await db.collection('members').orderBy('createdAt', 'desc').get();
    
    // Map over the documents to create a clean array of data
    membersData = membersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // We must serialize the Firestore Timestamp to a string before passing it to a Client Component
        createdAt: data.createdAt.toDate().toISOString(),
      };
    });
  } catch (error) {
    console.error("Failed to fetch members:", error);
    // Optionally, you could return an error component here
  }

  // The page's only job is to render the client component and pass it the data.
  return (
    <AdminDashboard members={membersData} />
  );
}