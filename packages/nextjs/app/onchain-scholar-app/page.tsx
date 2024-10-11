"use client";

// import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";

const Home: NextPage = () => {
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
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
