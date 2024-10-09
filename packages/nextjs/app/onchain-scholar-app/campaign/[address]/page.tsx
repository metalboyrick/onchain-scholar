"use client";

import { useEffect, useState } from "react";
import React from "react";
import { AlertTriangle, Calendar, CheckCircle2, Copy, ExternalLink, GraduationCap, XCircle } from "lucide-react";
import { Button } from "~~/components/onchain-scholar/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/onchain-scholar/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~~/components/onchain-scholar/ui/dialog";
import { Input } from "~~/components/onchain-scholar/ui/input";
import { Label } from "~~/components/onchain-scholar/ui/label";
import { Progress } from "~~/components/onchain-scholar/ui/progress";
import { Skeleton } from "~~/components/onchain-scholar/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/onchain-scholar/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~~/components/onchain-scholar/ui/tooltip";
import { useToast } from "~~/components/onchain-scholar/ui/use-toast";
import { formatIDR, truncateAddress } from "~~/utils/onchain-scholar/common";

type Milestone = {
  semester: number;
  gpaRequirement: string;
  expectedFunds: number;
  currentFunds: number;
  isCompleted: boolean;
  attestation?: string;
};

type CampaignDetails = {
  id: string;
  studentName: string;
  institution: string;
  universityWalletAddress: string;
  studentWalletAddress: string;
  contractAddress: string;
  deadline: string;
  milestones: Milestone[];
  isAdmitted: boolean;
  currentMilestone: number;
};

export default function CampaignDetails({ params: { address } }: { params: { address: string } }) {
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fundAmount, setFundAmount] = useState("");
  const [userRole, setUserRole] = useState<"funder" | "institution" | "student" | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulating API call to fetch campaign details
    setTimeout(() => {
      setCampaign({
        id: address,
        studentName: "Alice Johnson",
        institution: "Tech University",
        universityWalletAddress: "0x1234567890123456789012345678901234567890",
        studentWalletAddress: "0x0987654321098765432109876543210987654321",
        contractAddress: "0x5678901234567890123456789012345678901234",
        deadline: "2024-08-31",
        milestones: [
          {
            semester: 1,
            gpaRequirement: "3.0",
            expectedFunds: 20000000,
            currentFunds: 20000000,
            isCompleted: true,
            attestation: "Completed with 3.5 GPA",
          },
          { semester: 2, gpaRequirement: "3.0", expectedFunds: 20000000, currentFunds: 10000000, isCompleted: false },
          { semester: 3, gpaRequirement: "3.2", expectedFunds: 25000000, currentFunds: 0, isCompleted: false },
          { semester: 4, gpaRequirement: "3.2", expectedFunds: 25000000, currentFunds: 0, isCompleted: false },
        ],
        isAdmitted: true,
        currentMilestone: 1,
      });
      setIsLoading(false);
      // Simulating user role (in a real app, this would come from authentication)
      setUserRole("funder");
    }, 1500);
  }, [address]);

  const handleFund = async () => {
    const amount = parseFloat(fundAmount);
    if (!amount || !campaign) return;
    // Simulating blockchain transaction
    toast({
      title: "Processing transaction...",
      description: "Please wait while we process your contribution.",
    });
    setTimeout(() => {
      setCampaign(prev => {
        if (!prev) return null;
        const updatedMilestones = [...prev.milestones];
        updatedMilestones[prev.currentMilestone] = {
          ...updatedMilestones[prev.currentMilestone],
          currentFunds: updatedMilestones[prev.currentMilestone].currentFunds + amount,
        };
        return { ...prev, milestones: updatedMilestones };
      });
      setFundAmount("");
      toast({
        title: "Contribution successful!",
        description: `You have successfully contributed ${formatIDR(amount)} to Semester ${
          campaign.currentMilestone + 1
        }.`,
      });
    }, 2000);
  };

  const handleAttestation = async (milestoneIndex: number) => {
    // Simulating blockchain transaction for attestation
    toast({
      title: "Processing attestation...",
      description: "Please wait while we record the attestation on the blockchain.",
    });
    setTimeout(() => {
      setCampaign(prev => {
        if (!prev) return null;
        const updatedMilestones = [...prev.milestones];
        updatedMilestones[milestoneIndex] = {
          ...updatedMilestones[milestoneIndex],
          isCompleted: true,
          attestation: "Completed successfully",
        };
        return {
          ...prev,
          milestones: updatedMilestones,
          currentMilestone: prev.currentMilestone + 1,
        };
      });
      toast({
        title: "Attestation recorded!",
        description: "The milestone attestation has been successfully recorded on the blockchain.",
      });
    }, 2000);
  };

  const handleRevokeFunds = async (milestoneIndex: number) => {
    // Simulating blockchain transaction for revoking funds
    toast({
      title: "Processing fund revocation...",
      description: "Please wait while we process the fund revocation.",
    });
    setTimeout(() => {
      setCampaign(prev => {
        if (!prev) return null;
        const updatedMilestones = [...prev.milestones];
        updatedMilestones[milestoneIndex] = {
          ...updatedMilestones[milestoneIndex],
          currentFunds: 0,
          isCompleted: false,
          attestation: undefined,
        };
        return { ...prev, milestones: updatedMilestones };
      });
      toast({
        title: "Funds revoked!",
        description: `Funds for Semester ${milestoneIndex + 1} have been successfully revoked.`,
      });
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "The address has been copied to your clipboard.",
        });
      },
      err => {
        console.error("Could not copy text: ", err);
      },
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!campaign) {
    return <div className="container mx-auto px-4 py-8">Campaign not found</div>;
  }

  const totalExpectedFunds = campaign.milestones.reduce((sum, milestone) => sum + milestone.expectedFunds, 0);
  const totalCurrentFunds = campaign.milestones.reduce((sum, milestone) => sum + milestone.currentFunds, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{campaign.studentName}&apos;s Scholarship Campaign</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Campaign Overview</CardTitle>
          <CardDescription>{campaign.institution}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-medium">{Math.round((totalCurrentFunds / totalExpectedFunds) * 100)}%</span>
          </div>
          <Progress value={(totalCurrentFunds / totalExpectedFunds) * 100} className="w-full" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{formatIDR(totalCurrentFunds)}</span>
            <span className="text-sm text-muted-foreground">of {formatIDR(totalExpectedFunds)} goal</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Deadline: {new Date(campaign.deadline).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4" />
            <span className="text-sm">{campaign.milestones.length} milestones</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium">University Wallet:</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{truncateAddress(campaign.universityWalletAddress)}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(campaign.universityWalletAddress)}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy address</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium">Student Wallet:</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{truncateAddress(campaign.studentWalletAddress)}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(campaign.studentWalletAddress)}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy address</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium">Campaign Contract:</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{truncateAddress(campaign.contractAddress)}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(campaign.contractAddress)}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy address</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(`https://etherscan.io/address/${campaign.contractAddress}`, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View on Etherscan</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View on Etherscan</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="milestones" className="mt-6">
        <TabsList>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="admission">Admission Status</TabsTrigger>
        </TabsList>
        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              {campaign.milestones.map((milestone, index) => (
                <div key={index} className="mb-6 p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Semester {milestone.semester}</h3>
                    {milestone.isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : index === campaign.currentMilestone ? (
                      <span className="text-sm font-medium text-blue-500">Ongoing</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Pending</span>
                    )}
                  </div>
                  <p>GPA Requirement: {milestone.gpaRequirement}</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Funding Progress</span>
                      <span className="text-sm font-medium">
                        {Math.round((milestone.currentFunds / milestone.expectedFunds) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(milestone.currentFunds / milestone.expectedFunds) * 100}
                      className="w-full mt-1"
                    />

                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-medium">{formatIDR(milestone.currentFunds)}</span>
                      <span className="text-sm text-muted-foreground">
                        of {formatIDR(milestone.expectedFunds)} goal
                      </span>
                    </div>
                  </div>
                  {milestone.attestation && (
                    <p className="mt-2 text-sm text-muted-foreground">Attestation: {milestone.attestation}</p>
                  )}
                  {userRole === "funder" && index === campaign.currentMilestone && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="fundAmount">Contribute to this milestone</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="fundAmount"
                          type="number"
                          placeholder="Enter amount in IDR"
                          value={fundAmount}
                          onChange={e => setFundAmount(e.target.value)}
                        />
                        <Button onClick={handleFund}>Fund</Button>
                      </div>
                    </div>
                  )}
                  {userRole === "institution" && index === campaign.currentMilestone && !milestone.isCompleted && (
                    <div className="mt-4 space-x-2">
                      <Button onClick={() => handleAttestation(index)}>Issue Attestation</Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Revoke Funds
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Revoke Funds</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to revoke the funds for this milestone? This action cannot be
                              undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="destructive" onClick={() => handleRevokeFunds(index)}>
                              Confirm Revocation
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="admission">
          <Card>
            <CardHeader>
              <CardTitle>Admission Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {campaign.isAdmitted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <p className="text-lg">
                  {campaign.isAdmitted
                    ? "The student has been admitted to the institution."
                    : "Admission status is pending."}
                </p>
              </div>
              {userRole === "institution" && !campaign.isAdmitted && (
                <Button className="mt-4">Confirm Admission</Button>
              )}
              {userRole === "institution" && campaign.isAdmitted && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="mt-4">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Revoke Admission
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Revoke Admission</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to revoke the student&apos;s admission? This will also revoke all funds
                        for incomplete milestones.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          // Here you would implement the logic to revoke admission and funds
                          toast({
                            title: "Admission Revoked",
                            description:
                              "The student's admission has been revoked and incomplete milestone funds have been returned.",
                          });
                        }}
                      >
                        Confirm Revocation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
