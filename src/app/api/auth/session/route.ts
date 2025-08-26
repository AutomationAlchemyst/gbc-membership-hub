
import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';

// POST: Create a session cookie
export async function POST(request: NextRequest) {
  const body = await request.json();
  const idToken = body.idToken;

  if (!idToken) {
    return NextResponse.json({ error: 'ID token is required' }, { status: 400 });
  }
  
  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    // **CRITICAL** Only allow users with the admin custom claim to create a session
    if (decodedToken.admin !== true) {
      console.log('Session creation failed: User is not an admin.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000; 
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    
    const options = {
      name: 'session',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      path: '/',
    };
    
    console.log(`Admin session created successfully for ${decodedToken.email}.`);
    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.set(options);
    return response;

  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}


// DELETE: Expire the session cookie
export async function DELETE(request: NextRequest) {
  const options = {
    name: 'session',
    value: '',
    maxAge: -1, // Expire the cookie immediately
  };

  const response = NextResponse.json({ status: 'success' }, { status: 200 });
  response.cookies.set(options);
  return response;
}
