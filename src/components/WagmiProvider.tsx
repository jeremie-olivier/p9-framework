"use client";

import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider as _WagmiProvider } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import { injected, metaMask, safe } from 'wagmi/connectors';

import { config } from "@/lib/wagmiConfig"



export default function WagmiProvider({ children }: PropsWithChildren) {
  // Create one QueryClient per app instance
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <_WagmiProvider config={config}>
        {children}
      </_WagmiProvider>
    </QueryClientProvider>
  )
};