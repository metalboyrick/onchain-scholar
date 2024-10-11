"use client";

import { useEffect, useState } from "react";
import { useAccount, useBalance, useToken } from "wagmi";
import { MOCK_IDRX_CONTRACT } from "~~/utils/onchain-scholar/constants";

// IDRX token contract address (replace with actual address)
const IDRX_ADDRESS = MOCK_IDRX_CONTRACT.address;

export default function IDRXBalanceFloat() {
  const { address, isConnected } = useAccount();
  const { data: tokenData } = useToken({ address: IDRX_ADDRESS });
  const { data: balanceData } = useBalance({
    address,
    token: IDRX_ADDRESS,
    query: {
      enabled: isConnected,
    },
  });

  const [formattedBalance, setFormattedBalance] = useState<string>("");

  useEffect(() => {
    if (balanceData && tokenData) {
      const wholeUnits = balanceData.formatted.split(".")[0];
      const fractionalUnits = balanceData.formatted.split(".")[1] || "0000";
      setFormattedBalance(`IDRX ${wholeUnits}.${fractionalUnits.slice(0, 4)}`);
    }
  }, [balanceData, tokenData]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="fixed flex items-center gap-3 bottom-4 left-4 bg-white text-primary-foreground p-4 rounded-lg shadow-lg">
      <p className="text-sm font-mono">{formattedBalance}</p>
    </div>
  );
}
