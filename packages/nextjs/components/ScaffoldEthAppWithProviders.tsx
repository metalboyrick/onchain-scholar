"use client";

import Header from "./onchain-scholar/Header";
import IDRXBalanceFloat from "./onchain-scholar/idrx";
import { BlockieAvatar } from "./scaffold-eth";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex flex-col flex-1 max-w-[1000px] mx-auto">{children}</main>
        {/* <Footer /> */}
      </div>
      <IDRXBalanceFloat />
      <Toaster
        toastOptions={{
          // Default options for specific types
          loading: {
            duration: 10000,
          },
        }}
      />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    // <DynamicContextProvider
    //   settings={{
    //     environmentId: "28e20e2e-3938-4f32-a712-42a7e1fc4204",
    //     walletConnectors: [EthereumWalletConnectors],
    //     events: {
    //       onLogout: async () => {
    //         const walletClient = createWalletClient({
    //           chain: scaffoldConfig.targetNetworks[0],
    //           // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //           transport: custom(window.ethereum!),
    //         });

    //         await walletClient.request({
    //           method: "wallet_revokePermissions",
    //           params: [
    //             {
    //               eth_accounts: {},
    //             },
    //           ],
    //         });
    //       },
    //     },
    //   }}
    // >
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ProgressBar height="3px" color="#2299dd" />
        <RainbowKitProvider
          avatar={BlockieAvatar}
          theme={lightTheme({
            accentColor: "#ffd900",
            accentColorForeground: "black",
          })}
        >
          <ScaffoldEthApp>{children}</ScaffoldEthApp>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    // </DynamicContextProvider>
  );
};
