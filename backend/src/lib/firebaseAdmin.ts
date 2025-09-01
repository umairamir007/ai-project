// backend/src/lib/firebaseAdmin.ts
import admin from "firebase-admin";

const credential = process.env.FIREBASE_SERVICE_ACCOUNT
    ? admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    : admin.credential.applicationDefault();

const app = admin.apps[0] ?? admin.initializeApp({
    credential,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export const adminDb = admin.firestore(app);
export const adminAuth = admin.auth(app);
export const adminBucket = admin.storage(app).bucket();
