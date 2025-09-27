"use client";
// use npm install @rainbow-me/rainbowkit wagmi viem @tanstack/react-query to install dependencies
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const config = getDefaultConfig({
  appName: "My App",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "test-id",
  chains: [
    {
      id: 1,
      name: "Ethereum",
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: {
        default: { http: ["https://rpc.ankr.com/eth"] },
      },
    },
  ],
});

// 2. Query client
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
