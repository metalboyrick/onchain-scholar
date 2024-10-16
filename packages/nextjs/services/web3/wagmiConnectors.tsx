import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { coinbaseWallet, metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import scaffoldConfig from "~~/scaffold.config";

coinbaseWallet.preference = "smartWalletOnly";

const wallets = [coinbaseWallet, metaMaskWallet];

/**
 * wagmi connectors for the wagmi context
 */
export const wagmiConnectors = connectorsForWallets(
  [
    {
      groupName: "Supported Wallets",
      wallets,
    },
  ],
  {
    appName: "Onchain Scholars",
    projectId: scaffoldConfig.walletConnectProjectId,
  },
);
