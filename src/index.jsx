import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  polygonMumbai,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { AuthProvider } from "./components";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora, polygonMumbai],
  [publicProvider()],
  [
    jsonRpcProvider({
      rpc: (polygonMumbai) => ({
        http: `https://${polygonMumbai}.rpc-mumbai.maticvigil.com`,
      }),
    }),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "8a62fc35bcc6432879fab9ed2bb2f35f",
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider coolMode chains={chains}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RainbowKitProvider>
  </WagmiConfig>
);
