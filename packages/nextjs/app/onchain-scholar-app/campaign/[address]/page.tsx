"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Copy, GraduationCap, XCircle } from "lucide-react";
import { Hex, fromHex } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { Button } from "~~/components/onchain-scholar/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/onchain-scholar/ui/card";
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
import scaffoldConfig from "~~/scaffold.config";
import { Goal, Status } from "~~/services/onchain-scholar/types";
import { decodeGpa, formatIDR, truncateAddress } from "~~/utils/onchain-scholar/common";
import { CAMPAIGN_CONTRACT } from "~~/utils/onchain-scholar/constants";

type Milestone = {
  name: string;
  gpaRequirement: string;
  expectedFunds: number;
  currentFunds: number;
  status: Status;
  attestation: string | null;
};

type CampaignDetails = {
  id: string;
  name: string;
  universityWalletAddress: string;
  studentWalletAddress: string;
  contractAddress: string;
  milestones: Milestone[];
  isAdmitted: boolean;
  admissionAttestation: string;
  currentMilestone: number;
};

const parseCampaignData = (result: any) => {
  const [
    name,
    id,
    institutionAddress,
    recipientAddress,
    goals,
    goalAttestationUIDs,
    goalBalances,
    admissionAttestation,
    isAdmitted,
  ] = result;

  return {
    name: fromHex(name, { to: "string" }),
    id: Number(id),
    institutionAddress: institutionAddress as string,
    recipientAddress: recipientAddress as string,
    goals: goals as Goal[],
    goalAttestationUIDs: goalAttestationUIDs as string[],
    goalBalances: goalBalances.map((balance: any) => Number(balance)),
    admissionAttestation: admissionAttestation as string,
    isAdmitted: isAdmitted as boolean,
  };
};

export default function CampaignDetails({ params: { address } }: { params: { address: string } }) {
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [userRole, setUserRole] = useState<"funder" | "institution" | "student" | null>(null);
  const { toast } = useToast();

  const { address: accountAddress } = useAccount();

  const CAMPAIGN_CONTRACT_SET = {
    ...CAMPAIGN_CONTRACT,
    address,
  };

  const { data: rawData, isLoading } = useReadContract({
    ...CAMPAIGN_CONTRACT_SET,
    functionName: "getCampaignDetails",
  });

  // parse data
  useEffect(() => {
    if (rawData) {
      const {
        name,
        id,
        institutionAddress,
        recipientAddress,
        goals,
        goalAttestationUIDs,
        goalBalances,
        admissionAttestation,
        isAdmitted,
      } = parseCampaignData(rawData);
      setCampaign({
        id: id.toString(),
        name,
        universityWalletAddress: institutionAddress,
        studentWalletAddress: recipientAddress,
        contractAddress: address,
        milestones: goals.map((goal, goalIndex) => ({
          name: fromHex(goal.name, { to: "string" }),
          gpaRequirement: decodeGpa(goal.criteria.minGPA).toFixed(1),
          expectedFunds: Number(goal.target),
          currentFunds: Number(goalBalances[goalIndex]),
          status: goal.status as Status,
          attestation: fromHex(goalAttestationUIDs[goalIndex] as Hex, { to: "boolean" })
            ? goalAttestationUIDs[goalIndex]
            : null,
        })),
        isAdmitted,
        currentMilestone: 1,
        admissionAttestation,
      });
    }
  }, [address, rawData]);

  // if address is student, set to student mode, else to funder mode
  useEffect(() => {
    if (accountAddress) {
      if (accountAddress === campaign?.studentWalletAddress) {
        setUserRole("student");
      } else {
        setUserRole("funder");
      }
    } else {
      setUserRole("student");
    }
  }, [accountAddress, campaign]);

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
        description: `You have successfully contributed ${formatIDR(amount)} to ${campaign.name}.`,
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
      const prevGoalName = campaign?.milestones[campaign?.currentMilestone || 0];
      setCampaign(prev => {
        if (!prev) return null;
        const updatedMilestones = [...prev.milestones];
        updatedMilestones[milestoneIndex] = {
          ...updatedMilestones[milestoneIndex],
          currentFunds: 0,
          attestation: null,
        };
        return { ...prev, milestones: updatedMilestones };
      });
      toast({
        title: "Funds revoked!",
        description: `Funds for ${prevGoalName} have been successfully revoked.`,
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
    <div className="container mx-auto px-4 py-8 w-[800px]">
      <h1 className="text-3xl font-bold mb-6">{campaign.name}</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Campaign Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
            <GraduationCap className="h-4 w-4" />
            <span className="text-sm">{campaign.milestones.length} milestones</span>
          </div>

          {/* addresses */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">University Wallet:</span>
              <div className="flex items-center space-x-2">
                <a
                  href={`${scaffoldConfig.targetNetworks[0].blockExplorers.default.url}/address/${campaign.universityWalletAddress}`}
                  target="_blank"
                  className="text-sm text-secondary hover:underline hover:text-primary"
                >
                  {truncateAddress(campaign.universityWalletAddress)}
                </a>
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
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Student Wallet:</span>
              <div className="flex items-center space-x-2">
                <a
                  href={`${scaffoldConfig.targetNetworks[0].blockExplorers.default.url}/address/${campaign.studentWalletAddress}`}
                  target="_blank"
                  className="text-sm text-secondary hover:underline hover:text-primary"
                >
                  {truncateAddress(campaign.studentWalletAddress)}
                </a>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(campaign.studentWalletAddress)}
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
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Campaign Contract:</span>
              <div className="flex items-center space-x-2">
                <a
                  href={`${scaffoldConfig.targetNetworks[0].blockExplorers.default.url}/address/${campaign.contractAddress}`}
                  target="_blank"
                  className="text-sm text-secondary hover:underline hover:text-primary"
                >
                  {truncateAddress(campaign.contractAddress)}
                </a>
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
              </div>
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
                    <h3 className="text-lg font-semibold">{milestone.name}</h3>

                    {milestone.status === Status.Granted && (
                      <span className="text-sm text-green-600">Grant Disbursed</span>
                    )}

                    {milestone.status === Status.Idle && <span className="text-sm text-muted-foreground">Pending</span>}

                    {milestone.status === Status.Running && (
                      <span className="text-sm font-medium text-blue-500">Ongoing</span>
                    )}

                    {milestone.status === Status.Refunded && (
                      <span className="text-sm font-medium text-red-500">Grant Refunded</span>
                    )}
                  </div>
                  <p>
                    GPA Requirement - <span className="font-bold"> {milestone.gpaRequirement}</span>
                  </p>
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
                  {userRole === "institution" &&
                    index === campaign.currentMilestone &&
                    milestone.status === Status.Running && (
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
                    : "Student has no admission attestation yet."}
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
