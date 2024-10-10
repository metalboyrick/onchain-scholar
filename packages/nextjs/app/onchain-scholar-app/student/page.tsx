"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Plus } from "lucide-react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { Button } from "~~/components/onchain-scholar/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~~/components/onchain-scholar/ui/card";
import { Progress } from "~~/components/onchain-scholar/ui/progress";
import { Skeleton } from "~~/components/onchain-scholar/ui/skeleton";
import { parseCampaignData } from "~~/utils/onchain-scholar/campaigns";
import { formatIDR, sum, truncateAddress } from "~~/utils/onchain-scholar/common";
import { CAMPAIGN_CONTRACT, CAMPAIGN_FACTORY_CONTRACT } from "~~/utils/onchain-scholar/constants";

type Campaign = {
  address: string;
  id: string;
  name: string;
  university: string;
  goalAmount: number;
  raisedAmount: number;
  milestones: number;
};

export default function StudentDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const { address: studentAddress } = useAccount();
  const router = useRouter();

  const { data: campaignContracts, isLoading: isFetchingCampaignContracts } = useReadContract({
    ...CAMPAIGN_FACTORY_CONTRACT,
    functionName: "getCampaignAddressesFromRecipientAddress",
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    args: [studentAddress!],
    query: {
      enabled: !!studentAddress,
    },
  });

  const { data: readResults, isLoading: isReadingCampaignData } = useReadContracts({
    contracts: campaignContracts?.map(campaignContract => ({
      ...CAMPAIGN_CONTRACT,
      address: campaignContract,
      functionName: "getCampaignDetails",
    })),
    query: {
      enabled: (campaignContracts || []).length > 0,
    },
  });

  const isLoading = isReadingCampaignData || isFetchingCampaignContracts;

  // Simulating API call to fetch campaigns
  useEffect(() => {
    if (readResults && campaignContracts) {
      const formattedCampaigns = readResults
        .filter(readResult => readResult.status === "success")
        .map((readResult: any) => readResult.result)
        .map((data: any) => parseCampaignData(data))
        .map((campaignData: ReturnType<typeof parseCampaignData>, campaignIndex) => {
          const { name, id, institutionAddress, goals, goalBalances } = campaignData;

          return {
            address: campaignContracts[campaignIndex],
            id: id.toString(),
            name,
            university: truncateAddress(institutionAddress),
            goalAmount: sum(goals.map(goal => Number(goal.target))) / 10 ** 18,
            raisedAmount: sum(goalBalances.map(balance => Number(balance))) / 10 ** 18,
            milestones: goals.length,
          };
        });

      setCampaigns(formattedCampaigns);
    }
  }, [readResults, campaignContracts]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Campaigns</h1>
        <div className="space-y-4">
          {[...Array(2)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 w-[800px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Campaigns</h1>
        <Button asChild>
          <Link href="/onchain-scholar-app/student/create">
            <Plus className="mr-2 h-4 w-4" /> Create New Campaign
          </Link>
        </Button>
      </div>
      {campaigns && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map(campaign => (
            <Card
              key={campaign.id}
              className="hover:bg-yellow-100 cursor-pointer"
              onClick={() => router.push(`/onchain-scholar-app/campaign/${campaign.address}`)}
            >
              <CardHeader>
                <CardTitle>{campaign.name}</CardTitle>
                <CardDescription>University Address: {campaign.university}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">
                      {Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)}%
                    </span>
                  </div>
                  <Progress value={(campaign.raisedAmount / campaign.goalAmount) * 100} className="w-full" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{formatIDR(campaign.raisedAmount)}</span>
                    <span className="text-sm text-muted-foreground">of {formatIDR(campaign.goalAmount)} goal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-sm">{campaign.milestones} milestones</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Campaigns Yet</CardTitle>
            <CardDescription>You haven&apos;t created any scholarship campaigns yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center py-4">Start your first campaign to begin your fundraising journey!</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/create-campaign">
                <Plus className="mr-2 h-4 w-4" /> Create Your First Campaign
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
