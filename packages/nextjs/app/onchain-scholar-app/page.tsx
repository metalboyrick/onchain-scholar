"use client";

// import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Button } from "~~/components/onchain-scholar/ui/button";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const router = useRouter();

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Onchain Scholar: Decentralized Education Funding
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Empowering students, institutions, and funders through blockchain-based scholarship crowdfunding.
            </p>
          </div>
          <div className="space-x-4">
            {isConnected && (
              <>
                <Button variant={"default"} onClick={() => router.push(`/onchain-scholar-app/student/create`)}>
                  Create Campaign
                </Button>
                {/* <Button variant={"default"} onClick={() => router.push(`/onchain-scholar-app/student`)}>
              View Campaigns
            </Button> */}
                <Button variant={"outline"} onClick={() => router.push(`/onchain-scholar-app/attestation`)}>
                  Attest
                </Button>
              </>
            )}

            {!isConnected && <RainbowKitCustomConnectButton />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
