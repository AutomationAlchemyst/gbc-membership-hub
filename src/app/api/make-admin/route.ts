// src/app/api/make-admin/route.ts

import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';

// A very secret key that must be provided to this endpoint to make a user an admin.
// IMPORTANT: CHANGE THIS TO YOUR OWN SECRET VALUE!
const ADMIN_SECRET_KEY = 'GBC_Admin_Access_2025!';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const email = searchParams.get('email');

  // 1. Security Check: Validate the secret key
  if (secret !== ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Invalid secret key' }, { status: 403 });
  }

  // 2. Check for required parameters
  if (!email) {
    return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
  }

  try {
    // 3. Set the admin claim for the user
    console.log(`Looking up user by email: ${email}...`);
    const user = await auth.getUserByEmail(email);
    
    await auth.setCustomUserClaims(user.uid, { admin: true });
    
    console.log(`Successfully set admin claim for ${email}`);
    return NextResponse.json({ message: `Success! ${email} has been made an admin.` });

  } catch (error: any) {
    // 4. Handle errors, like user not found
    if (error.code === 'auth/user-not-found') {
      console.error(`User with email ${email} not found.`);
      return NextResponse.json({ error: `User with email ${email} not found.` }, { status: 404 });
    }
    
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
