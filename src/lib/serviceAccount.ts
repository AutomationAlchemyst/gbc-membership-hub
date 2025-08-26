// src/lib/serviceAccount.ts

if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  throw new Error('The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set or not available.');
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

export default serviceAccount;