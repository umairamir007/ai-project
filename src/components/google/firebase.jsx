import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDs32mA77do55njKVeprU1GJrZfZI0kwyo",
  authDomain: "isire-f6f0e.firebaseapp.com",
  projectId: "isire-f6f0e",
  storageBucket: "isire-f6f0e.appspot.com",
  messagingSenderId: "262033110260",
  appId: "1:262033110260:web:2e36e5f99b351c90a95aa1",
  measurementId: "G-J1P4GSCEH5",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, db, analytics, storage };
