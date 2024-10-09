"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Plus } from "lucide-react";
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
import { formatIDR } from "~~/utils/onchain-scholar/common";

type Campaign = {
  id: string;
  name: string;
  university: string;
  goalAmount: number;
  raisedAmount: number;
  deadline: string;
  milestones: number;
};

export default function StudentDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulating API call to fetch campaigns
  useEffect(() => {
    setTimeout(() => {
      setCampaigns([
        {
          id: "1",
          name: "Computer Science Degree Fund",
          university: "Tech University",
          goalAmount: 20000,
          raisedAmount: 15000,
          deadline: "2024-08-31",
          milestones: 4,
        },
        {
          id: "2",
          name: "Engineering Masters Scholarship",
          university: "State College",
          goalAmount: 25000,
          raisedAmount: 10000,
          deadline: "2024-12-15",
          milestones: 5,
        },
      ]);
      setIsLoading(false);
    }, 1500); // Simulating network delay
  }, []);

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
    <div className="container mx-auto px-4 py-8">
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
            <Card key={campaign.id}>
              <CardHeader>
                <CardTitle>{campaign.name}</CardTitle>
                <CardDescription>{campaign.university}</CardDescription>
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
