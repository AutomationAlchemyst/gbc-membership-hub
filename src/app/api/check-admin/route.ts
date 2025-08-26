import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
  const session = request.cookies.get('session')?.value || '';

  if (!session) {
    console.log('Admin check failed: No session cookie found.');
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }

  try {
    const decodedToken = await auth.verifySessionCookie(session, true);
    console.log('Middleware decoded token:', decodedToken);
    if (decodedToken.admin === true) {
      console.log('Admin check successful:', decodedToken.email);
      return NextResponse.json({ isAdmin: true }, { status: 200 });
    } else {
      console.log('Admin check failed: User is not an admin.', decodedToken);
      return NextResponse.json({ isAdmin: false }, { status: 403 });
    }
  } catch (error) {
    console.error('Admin check error: Session cookie is invalid or expired.', error);
    // Session cookie is invalid or expired.
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }
}
