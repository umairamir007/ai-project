import admin from "firebase-admin";

// Supports either FIREBASE_SERVICE_ACCOUNT (JSON or base64) or ADC via
// GOOGLE_APPLICATION_CREDENTIALS / gcloud login.
function buildCredential() {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (raw) {
        const json =
            raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
        return admin.credential.cert(JSON.parse(json));
    }
    // Uses the file path in GOOGLE_APPLICATION_CREDENTIALS or your gcloud ADC
    return admin.credential.applicationDefault();
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: buildCredential(),
        // Helps when using user ADC so the project is unambiguous:
        projectId: process.env.GOOGLE_CLOUD_PROJECT,
    });
}

export const adminDb = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
