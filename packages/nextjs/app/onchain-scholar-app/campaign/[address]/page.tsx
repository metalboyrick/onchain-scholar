"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Copy, GraduationCap, Loader2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { encodeFunctionData, fromHex } from "viem";
import { useAccount, useChainId, usePublicClient, useReadContract, useWalletClient } from "wagmi";
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
import scaffoldConfig from "~~/scaffold.config";
import { Status } from "~~/services/onchain-scholar/types";
import { getBasename } from "~~/utils/base/basenames";
import { isValidAttestationUID } from "~~/utils/eas/common";
import { EAS_SCAN_BASE_URL } from "~~/utils/eas/constants";
import { parseCampaignData } from "~~/utils/onchain-scholar/campaigns";
import { decodeGpa, formatIDR, truncateAddress } from "~~/utils/onchain-scholar/common";
import { CAMPAIGN_CONTRACT, MOCK_IDRX_CONTRACT } from "~~/utils/onchain-scholar/constants";

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

export default function CampaignDetails({ params: { address } }: { params: { address: string } }) {
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [userRole, setUserRole] = useState<"funder" | "institution" | "student" | null>(null);

  const { address: accountAddress } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const chainId = useChainId();

  const CAMPAIGN_CONTRACT_SET = {
    ...CAMPAIGN_CONTRACT,
    address,
  };

  const {
    data: rawData,
    isLoading,
    refetch,
  } = useReadContract({
    ...CAMPAIGN_CONTRACT_SET,
    functionName: "getCampaignDetails",
    query: {
      staleTime: 0,
    },
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
          expectedFunds: Number(goal.target) / 10 ** 18,
          currentFunds: Number(goalBalances[goalIndex]) / 10 ** 18,
          status: goal.status as Status,
          attestation: isValidAttestationUID(goalAttestationUIDs[goalIndex]) ? goalAttestationUIDs[goalIndex] : null,
        })),
        isAdmitted,
        currentMilestone: goals.findIndex(goal => goal.status === Status.Running),
        admissionAttestation,
      });
    }
  }, [address, rawData]);

  const { data: basenames } = useQuery({
    queryKey: [
      "get-basename-adresses",
      campaign?.studentWalletAddress,
      campaign?.universityWalletAddress,
      publicClient,
    ],
    queryFn: async () => {
      let studentBaseName;
      let universityBasename;
      if (campaign?.studentWalletAddress) {
        studentBaseName = await getBasename(campaign?.studentWalletAddress, publicClient!);
      }

      if (campaign?.universityWalletAddress) {
        universityBasename = await getBasename(campaign?.universityWalletAddress, publicClient!);
      }

      console.log({
        studentBaseName,
        universityBasename,
      });

      return {
        studentBaseName,
        universityBasename,
      };
    },
  });

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
    if (!accountAddress) toast.error("Wallet not connected");

    const amount = parseInt(fundAmount);
    if (!amount || !campaign) return;

    // Simulating blockchain transaction
    toast.loading("Please wait while we process your contribution.");

    const allowance = await publicClient?.readContract({
      ...MOCK_IDRX_CONTRACT,
      functionName: "allowance",
      args: [accountAddress!, campaign.contractAddress],
    });

    if ((allowance || 0n) < amount * 10 ** 18) {
      await walletClient!.sendTransaction({
        account: accountAddress,
        to: MOCK_IDRX_CONTRACT.address,
        data: encodeFunctionData({
          functionName: "approve",
          abi: MOCK_IDRX_CONTRACT.abi,
          args: [campaign.contractAddress, BigInt((amount + 100) * 10 ** 18)],
        }),
      });
    }

    await walletClient!.sendTransaction({
      account: accountAddress,
      to: campaign.contractAddress,
      data: encodeFunctionData({
        ...CAMPAIGN_CONTRACT_SET,
        functionName: "fund",
        args: [BigInt(campaign.currentMilestone), BigInt(amount * 10 ** 18)],
      }),
    });

    // await writeContractAsync({
    //   ...CAMPAIGN_CONTRACT_SET,
    //   functionName: "fund",
    //   args: [BigInt(campaign.currentMilestone), BigInt(amount * 10 ** 18)],
    // });

    setFundAmount("");

    toast.success("Contribution successful!");

    refetch();
  };

  const handleAttestation = async (milestoneIndex: number) => {
    // Simulating blockchain transaction for attestation
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
    }, 2000);
  };

  const handleRevokeFunds = async (milestoneIndex: number) => {
    // Simulating blockchain transaction for revoking funds
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
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard");
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
                  {!!basenames?.universityBasename
                    ? basenames?.universityBasename
                    : truncateAddress(campaign.universityWalletAddress)}
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
                  {!!basenames?.studentBaseName
                    ? basenames?.studentBaseName
                    : truncateAddress(campaign.studentWalletAddress)}
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
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium text-green-500">Attestation: </span>
                      <a
                        href={`${EAS_SCAN_BASE_URL}/${milestone.attestation}`}
                        target="_blank"
                        className="text-sm text-secondary hover:underline hover:text-primary ml-2"
                      >
                        {truncateAddress(milestone.attestation || "")}
                      </a>
                    </p>
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
                        <Button disabled={isLoading} onClick={handleFund}>
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Fund
                        </Button>
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
                {campaign.isAdmitted ? (
                  <span className={"text-green-500"}>The student has been admitted to the institution.</span>
                ) : (
                  <span className={"text-red-500"}>
                    {isValidAttestationUID(campaign.admissionAttestation)
                      ? "Student admission has been revoked."
                      : "Student has no admission attestation yet."}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <p className="font-medium text-sm">Admission Attestation UID: </p>
                <a
                  href={`${EAS_SCAN_BASE_URL}/${campaign.admissionAttestation}`}
                  target="_blank"
                  className="text-sm text-secondary hover:underline hover:text-primary"
                >
                  {campaign.admissionAttestation}
                </a>
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
