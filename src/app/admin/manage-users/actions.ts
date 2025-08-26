'use server';

import { auth } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

export const revalidate = 0; // <--- ADD THIS LINE


export async function getAllUsers() {
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
    revalidatePath('/admin/manage-users');
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: 'Failed to update role.' };
  }
}
