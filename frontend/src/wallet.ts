// src/wallet.ts
import { configureChains, createConfig } from 'wagmi'
import {
    mainnet, polygon, optimism, arbitrum, base, zora, polygonMumbai,
} from 'wagmi/chains'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const WC_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID || 'YOUR_PROJECT_ID'

// 1) Providers go in a SINGLE array (your old code passed a 3rd arg by mistake)
const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, base, zora, polygonMumbai],
    [
        // Optional: custom RPC for Mumbai (use a real endpoint you control)
        jsonRpcProvider({
            rpc: (chain) =>
                chain.id === polygonMumbai.id
                    ? { http: 'https://rpc.ankr.com/polygon_mumbai' } // or Alchemy/Infura
                    : null,
        }),
        publicProvider(),
    ],
)

// 2) Wallet connectors
const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    projectId: WC_PROJECT_ID, // from env
    chains,
})

// 3) Wagmi config
export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
})

export { chains }
