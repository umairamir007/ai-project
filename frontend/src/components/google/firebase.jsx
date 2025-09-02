import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

/** NEW project (copy from Firebase Console → Project settings → Web app) */
const firebaseConfig = {
  apiKey: "AIzaSyDs32mA77do55njKVeprU1GJrZfZI0kwyo",
  authDomain: "isire-f6f0e.firebaseapp.com",
  projectId: "isire-f6f0e",
  storageBucket: "isire-f6f0e.appspot.com",
  messagingSenderId: "262033110260",
  appId: "1:262033110260:web:2e36e5f99b351c90a95aa1",
  measurementId: "G-J1P4GSCEH5",
};

// Avoid double init during hot-reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Analytics only in the browser (won’t run on SSR/build)
export const analytics =
  typeof window !== "undefined" && firebaseConfig.measurementId
    ? getAnalytics(app)
    : undefined;

// Old project (read-only, if rules allow)
// const legacyConfig = {
//   apiKey: "AIzaSyDs32mA77do55njKVeprU1GJrZfZI0kwyo",
//   authDomain: "isire-f6f0e.firebaseapp.com",
//   projectId: "isire-f6f0e",
//   storageBucket: "isire-f6f0e.appspot.com",
//   messagingSenderId: "262033110260",
//   appId: "1:262033110260:web:2e36e5f99b351c90a95aa1",
//   measurementId: "G-J1P4GSCEH5",
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyAUo0JyuHBUfdY-7kk4dxZWeNk9JYeHnko",
//   authDomain: "ai-voices-92fcc.firebaseapp.com",
//   projectId: "ai-voices-92fcc",
//   storageBucket: "ai-voices-92fcc.appspot.com", // ← correct bucket domain
//   messagingSenderId: "155711762099",
//   appId: "1:155711762099:web:97bda4b46be70718934ac6",
//   measurementId: "G-RM7R1KGN8X",
// };
