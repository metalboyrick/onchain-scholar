"use client";

// import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Header() {
  const router = useRouter();
  const { isConnected } = useAccount();

  return (
    <nav className="px-8 py-5 flex justify-between items-center">
      <div
        className="font-bold cursor-pointer flex items-center gap-3"
        onClick={() => router.push("/onchain-scholar-app")}
      >
        <Image src="/favicon.png" alt="" width={28} height={28} /> <span>Onchain Scholar</span>
      </div>
      <div className="flex gap-2">
        {isConnected && (
          <>
            <Button variant={"default"} onClick={() => router.push(`/onchain-scholar-app/student/create`)}>
              Create Campaign
            </Button>
            <Button variant={"outline"} onClick={() => router.push(`/onchain-scholar-app/attestation`)}>
              Attest
            </Button>
          </>
        )}

        <ConnectButton showBalance={false} />
      </div>
    </nav>
  );
}
