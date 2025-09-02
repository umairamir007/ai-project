import { useEffect, useRef } from "react";
import { auth } from "../components/google/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

export function useEnsureAnonAuth() {
    const started = useRef(false);
    useEffect(() => {
        if (started.current) return;
        started.current = true;

        const unsub = onAuthStateChanged(auth, (u) => {
            if (!u) {
                setTimeout(() => {
                    signInAnonymously(auth).catch((e) =>
                        console.error("Anon sign-in failed:", e)
                    );
                }, 0);
            }
        });

        return unsub;
    }, []);
}
