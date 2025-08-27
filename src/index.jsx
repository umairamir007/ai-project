import ReactDOM from "react-dom/client";
import App from "./App";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig, chains } from "./wallet";
import { AuthProvider } from "./components";
import "./index.css"

// --- Dev-only: silence WalletConnect verify iframe cross-origin SecurityError ---
const isDev =
  typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV;

if (isDev && typeof window !== "undefined") {
  const swallowWCVerifyError = (ev) => {
    const reason = ev?.reason ?? ev;
    const text =
      String(reason?.message ?? reason ?? "") + " " + String(ev?.message ?? "");

    const isSecurityErr =
      reason?.name === "SecurityError" || /SecurityError/i.test(text);
    const isWCVerify = /verify\.walletconnect\.com/i.test(text);

    if (isSecurityErr && isWCVerify) {
      ev.preventDefault?.(); // prevent Vite red overlay
      // console.debug('[silenced] WalletConnect verify SecurityError');
    }
  };

  window.addEventListener("unhandledrejection", swallowWCVerifyError);
  window.addEventListener("error", swallowWCVerifyError, true);
}
// ------------------------------------------------------------------------------

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");

ReactDOM.createRoot(rootEl).render(
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={chains} coolMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RainbowKitProvider>
  </WagmiConfig>
);
