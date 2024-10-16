"use client";

import { useMemo } from "react";
import { Address, formatEther } from "viem";
import { useBalance } from "wagmi";
import { useDisplayUsdMode } from "~~/hooks/scaffold-eth/useDisplayUsdMode";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";
import { idrFormat } from "~~/services/onchain-scholar/currency";
import { useGlobalState } from "~~/services/store/store";
import { MOCK_IDRX_CONTRACT } from "~~/utils/onchain-scholar/constants";

type BalanceProps = {
  address?: Address;
  className?: string;
  usdMode?: boolean;
};

/**
 * Display (ETH & USD) balance of an ETH address.
 */
export const Balance = ({ address, className = "", usdMode }: BalanceProps) => {
  const { targetNetwork } = useTargetNetwork();
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrency.price);
  const isNativeCurrencyPriceFetching = useGlobalState(state => state.nativeCurrency.isFetching);

  const {
    data: balance,
    isError,
    isLoading,
  } = useWatchBalance({
    address,
  });

  const { data: idrxBalance, isLoading: isIDRXLoading } = useWatchBalance({
    address,
    token: MOCK_IDRX_CONTRACT.address,
  });

  const { displayUsdMode, toggleDisplayUsdMode } = useDisplayUsdMode({ defaultUsdMode: usdMode });

  const formattedBalance = balance ? Number(formatEther(balance.value)) : 0;

  const formattedIDRXBalance = useMemo(() => {
    const wholeUnits = idrxBalance?.formatted.split(".")[0];
    const fractionalUnits = idrxBalance?.formatted.split(".")[1] || "0000";
    return idrFormat.format(parseFloat(`${wholeUnits}.${fractionalUnits.slice(0, 4)}`)).replace("Rp ", "");
  }, [idrxBalance]);

  if (
    !address ||
    isIDRXLoading ||
    isLoading ||
    balance === null ||
    (isNativeCurrencyPriceFetching && nativeCurrencyPrice === 0)
  ) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`border-2 border-gray-400 rounded-md px-2 flex flex-col items-center max-w-fit cursor-pointer`}>
        <div className="text-warning">Error</div>
      </div>
    );
  }

  return (
    <button
      className={`btn btn-sm btn-ghost flex flex-col font-normal items-center hover:bg-transparent ${className}`}
      onClick={toggleDisplayUsdMode}
    >
      <div className="w-full flex items-center justify-center">
        {displayUsdMode ? (
          <>
            <span className="text-[0.8em] font-bold mr-1">IDRX</span>
            <span>{formattedIDRXBalance}</span>
          </>
        ) : (
          <>
            <span>{formattedBalance.toFixed(4)}</span>
            <span className="text-[0.8em] font-bold ml-1">{targetNetwork.nativeCurrency.symbol}</span>
          </>
        )}
      </div>
    </button>
  );
};
