'use server';

import { auth } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache'; // 1. ADD THIS IMPORT

export async function getAllUsers() {
  noStore(); // 2. ADD THIS FUNCTION CALL

  try {
    const userRecords = await auth.listUsers();
    const users = userRecords.users.map((user) => ({
      uid: user.uid,
      email: user.email || 'No email',
      isAdmin: user.customClaims?.admin === true,
    }));
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function updateUserRole(uid: string, isAdmin: boolean) {
  try {
    await auth.setCustomUserClaims(uid, { admin: isAdmin ? true : null });
    revalidatePath('/admin/manage-users'); // This is great for updating after a role change!
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: 'Failed to update role.' };
  }
}