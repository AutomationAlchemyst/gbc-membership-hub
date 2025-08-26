
/**
 * To run this script:
 * 1. Make sure you have ts-node and tsx installed: `npm install -g ts-node tsx`
 * 2. Run the script from the root of your project using the npm script:
 *    `npm run set-admin -- <email-of-admin-user>`
 * 3. Replace `<email-of-admin-user>` with the actual email of the user
 *    you want to make an admin. This user MUST already be signed up
 *    in your Firebase Authentication.
 */
import admin from 'firebase-admin';
import { serviceAccount } from './serviceAccount';

async function setAdminClaim(email: string) {
  console.log(`Attempting to set admin claim for user: ${email}`);
  
  if (!admin.apps.length) {
    try {
      console.log('Initializing Firebase Admin SDK...');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
      console.error('Firebase admin initialization error:', error.stack);
      process.exit(1);
    }
  } else {
    console.log('Firebase Admin SDK already initialized.');
  }

  try {
    console.log(`Looking up user by email: ${email}...`);
    const user = await admin.auth().getUserByEmail(email);
    console.log(`User found: ${user.uid}. Setting custom claim...`);
    
    // Check if the user already has the admin claim
    if (user.customClaims && (user.customClaims as any).admin === true) {
      console.log(`${email} is already an admin.`);
      process.exit(0);
    }

    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`\n✅ Success! ${email} has been made an admin.`);
    console.log('Please try logging in again.');
    process.exit(0);

  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
        console.error(`\n❌ Error: User with email ${email} not found in Firebase Authentication.`);
        console.error('Please ensure the user is signed up before setting admin claims.');
    } else {
        console.error('\n❌ An unexpected error occurred while setting the custom claim:');
        console.error(error);
    }
    process.exit(1);
  }
}

// --- Script execution ---
const email = process.argv[2];

if (!email) {
  console.error('\n❌ Error: Please provide an email address as an argument.');
  console.error('Example: npm run set-admin -- user@example.com');
  process.exit(1);
}

setAdminClaim(email);
