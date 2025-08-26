'use server';

import { z } from 'zod';
import { db } from '@/lib/firebaseAdmin'; // Using Admin SDK on the server
import { FieldValue } from 'firebase-admin/firestore';
import { registrationSchema } from '@/lib/types';

// We can omit fields that are generated or not needed for the action
const addMemberSchema = registrationSchema.extend({
  // No need to validate createdAt on input, it's added on the server
});

export async function addMember(data: unknown) {
  try {
    // 1. Validate the data on the server
    const parsedData = addMemberSchema.safeParse(data);

    if (!parsedData.success) {
      // Destructure errors for a more readable response
      const errors = parsedData.error.flatten().fieldErrors;
      console.error('Validation failed:', errors);
      return { success: false, message: 'Invalid data provided.', errors };
    }
    
    // 2. Add a server-side timestamp
    const memberData = {
      ...parsedData.data,
      createdAt: FieldValue.serverTimestamp(),
    };

    // 3. Add the new document to the 'members' collection
    const docRef = await db.collection('members').add(memberData);

    console.log('Member added with ID: ', docRef.id);

    // 4. Return a success response
    return { success: true, message: 'Member added successfully.' };

  } catch (error: any) {
    console.error('Error adding document: ', error);
    // In a real app, you might want to log this error to a monitoring service
    const errorMessage = error.message || 'An unexpected error occurred on the server.';
    return { success: false, message: errorMessage };
  }
}
