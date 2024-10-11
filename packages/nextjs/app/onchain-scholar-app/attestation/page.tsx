"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, Loader2, XCircle } from "lucide-react";
import { fromHex } from "viem";
import { useAccount, useChainId, useReadContract, useReadContracts, useWriteContract } from "wagmi";
import NotConnectedYet from "~~/components/onchain-scholar/not-connected-yet";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/onchain-scholar/ui/select";
import { Skeleton } from "~~/components/onchain-scholar/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/onchain-scholar/ui/tabs";
import { useToast } from "~~/components/onchain-scholar/ui/use-toast";
import scaffoldConfig from "~~/scaffold.config";
import { Status } from "~~/services/onchain-scholar/types";
import { easAttestAdmission, easRevokeAdmission } from "~~/utils/eas/attestation";
import { isValidAttestationUID } from "~~/utils/eas/common";
import { EAS_SCAN_BASE_URL } from "~~/utils/eas/constants";
import { useEthersSigner } from "~~/utils/eas/ethersAdapter";
import { parseCampaignData } from "~~/utils/onchain-scholar/campaigns";
import { decodeGpa, formatIDR, sum, truncateAddress } from "~~/utils/onchain-scholar/common";
import { CAMPAIGN_CONTRACT, CAMPAIGN_FACTORY_CONTRACT } from "~~/utils/onchain-scholar/constants";

type Milestone = {
  name: string;
  gpaRequirement: string;
  expectedFunds: number;
  currentFunds: number;
  status: Status;
  attestation?: string;
};

type Campaign = {
  id: string;
  name: string;
  institution: string;
  studentAddress: string;
  contractAddress: string;
  isAdmitted: boolean;
  admissionAttestation: string;
  milestones: Milestone[];
};

export default function UniversityAttestation() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const { toast } = useToast();

  const chainId = useChainId();

  // const ethersProvider = useEthersProvider({ chainId });
  const ethersSigner = useEthersSigner({ chainId });

  const { address: universityAddress } = useAccount();

  const { writeContractAsync, isPending: isWriteContractPending } = useWriteContract();

  const { data: campaignContracts, isLoading: isFetchingCampaignContracts } = useReadContract({
    ...CAMPAIGN_FACTORY_CONTRACT,
    functionName: "getCampaignAddressFromInstitutionAddress",
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    args: [universityAddress!],
    query: {
      enabled: !!universityAddress,
    },
  });

  const {
    data: readResults,
    isLoading: isReadingCampaignData,
    refetch: refetchCampaignContracts,
  } = useReadContracts({
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

  // we compile the results and put it in displayable format
  useEffect(() => {
    if (readResults && campaignContracts) {
      const formattedCampaigns = readResults
        .filter(readResult => readResult.status === "success")
        .map((readResult: any) => readResult.result)
        .map((data: any) => parseCampaignData(data))
        .map((campaignData: ReturnType<typeof parseCampaignData>, campaignIndex) => {
          const {
            name,
            id,
            institutionAddress,
            goals,
            goalBalances,
            isAdmitted,
            admissionAttestation,
            goalAttestationUIDs,
            recipientAddress,
          } = campaignData;

          return {
            contractAddress: campaignContracts[campaignIndex],
            id: id.toString(),
            name,
            studentAddress: recipientAddress,
            institution: truncateAddress(institutionAddress),
            goalAmount: sum(goals.map(goal => Number(goal.target))) / 10 ** 18,
            raisedAmount: sum(goalBalances.map(balance => Number(balance))) / 10 ** 18,
            isAdmitted,
            admissionAttestation,
            milestones: goals.map((goal, goalIndex) => {
              const { status } = goal;

              return {
                name: fromHex(goal.name, { to: "string" }),
                gpaRequirement: decodeGpa(goal.criteria.minGPA).toFixed(1),
                expectedFunds: Number(goal.target) / 10 ** 18,
                currentFunds: Number(goalBalances[goalIndex]) / 10 ** 18,
                status,
                attestation:
                  goalAttestationUIDs[goalIndex].length > 0
                    ? fromHex(goalAttestationUIDs[goalIndex] as `0x${string}`, { to: "string" })
                    : undefined,
              };
            }),
          };
        });

      setCampaigns(formattedCampaigns);
    }
  }, [readResults, campaignContracts]);

  const { mutateAsync: attestAdmission, isPending: isAttestingAdmission } = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    mutationFn: async ({ studentAddress, campaignAddress }: { studentAddress: string; campaignAddress: string }) => {
      const { uid, encodedData } = await easAttestAdmission(ethersSigner!, studentAddress);
      return await writeContractAsync({
        ...CAMPAIGN_CONTRACT,
        address: campaignAddress,
        functionName: "attestAdmission",
        args: [uid, encodedData],
      });
    },
  });

  const { mutateAsync: revokeAdmission, isPending: isRevokingAdmission } = useMutation({
    mutationFn: async ({
      campaignAdmissionUid,
      campaignAddress,
    }: {
      campaignAdmissionUid: string;
      campaignAddress: string;
    }) => {
      await easRevokeAdmission(ethersSigner!, campaignAdmissionUid);
      await writeContractAsync({
        ...CAMPAIGN_CONTRACT,
        address: campaignAddress,
        functionName: "revokeAdmission",
        args: [campaignAdmissionUid],
      });
    },
  });

  const handleAdmissionAttestation = async (
    studentAddress: string,
    isAdmitted: boolean,
    campaignAddress: string,
    admissionUid?: string,
  ) => {
    if (isAdmitted) {
      // Simulating blockchain transaction for admission attestation
      toast({
        title: "Processing attestation...",
        description: "Please wait while we record the admission attestation on the blockchain.",
      });

      // send attestation to EAS + send to smart contract
      await attestAdmission({ studentAddress, campaignAddress });
    } else {
      if (!admissionUid) throw new Error("cannot revoke without admission uid");

      toast({
        title: "Processing revocation...",
        description: "Please wait while we record the admission attestation on the blockchain.",
      });

      await revokeAdmission({
        campaignAdmissionUid: admissionUid,
        campaignAddress,
      });
    }

    refetchCampaignContracts();

    toast({
      title: "Admission Attestation Recorded",
      description: `The student has been ${isAdmitted ? "admitted" : "rejected"}.`,
    });
  };

  const handleMilestoneAttestation = async (campaignId: string, milestoneIndex: number, attestation: string) => {
    // Simulating blockchain transaction for milestone attestation
    toast({
      title: "Processing attestation...",
      description: "Please wait while we record the milestone attestation on the blockchain.",
    });
    setTimeout(() => {
      setCampaigns(prevCampaigns =>
        prevCampaigns.map(campaign => {
          if (campaign.id === campaignId) {
            const updatedMilestones = [...campaign.milestones];
            updatedMilestones[milestoneIndex] = {
              ...updatedMilestones[milestoneIndex],
              attestation: attestation,
            };
            return {
              ...campaign,
              milestones: updatedMilestones,
            };
          }
          return campaign;
        }),
      );
      toast({
        title: "Milestone Attestation Recorded",
        description: `Milestone ${milestoneIndex + 1} has been attested.`,
      });
    }, 2000);
  };

  if (!universityAddress) return <NotConnectedYet />;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const campaign = campaigns.find(c => c.id === selectedCampaign);

  if (isLoading)
    return (
      <div>
        <Skeleton className="w-[800px] h-[200px]"></Skeleton>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 w-[800px]">
      <h1 className="text-3xl font-bold mb-6">University Attestation Dashboard</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Campaign</CardTitle>
          <CardDescription>Choose a campaign to manage attestations</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger>
              <SelectValue placeholder="Select a campaign" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map(campaign => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {campaign && (
        <Card>
          <CardHeader>
            <CardTitle>{campaign.name}</CardTitle>
            <CardDescription>
              Contract Address:{" "}
              <a
                href={`${scaffoldConfig.targetNetworks[0].blockExplorers.default.url}/address/${campaign.contractAddress}`}
                target="_blank"
                className="text-sm text-secondary hover:underline hover:text-primary"
              >
                {campaign.contractAddress}
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="admission">
              <TabsList>
                <TabsTrigger value="admission">Admission</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
              </TabsList>
              <TabsContent value="admission">
                <div className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium">Current Status:</span>
                    {campaign.isAdmitted ? (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" /> Admitted
                      </span>
                    ) : isValidAttestationUID(campaign.admissionAttestation) ? (
                      <span className="text-red-600 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" /> Admission Revoked
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" /> Not Admitted
                      </span>
                    )}
                  </div>
                  {isValidAttestationUID(campaign.admissionAttestation) && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-medium">Admission Attestation UID:</span>
                      <a
                        href={`${EAS_SCAN_BASE_URL}/${campaign.admissionAttestation}`}
                        target="_blank"
                        className="text-sm text-secondary hover:underline hover:text-primary"
                      >
                        {campaign.admissionAttestation}
                      </a>
                    </div>
                  )}

                  {!campaign.isAdmitted && (
                    <Button
                      onClick={() =>
                        handleAdmissionAttestation(campaign.studentAddress, true, campaign.contractAddress)
                      }
                      disabled={
                        isAttestingAdmission ||
                        isWriteContractPending ||
                        isRevokingAdmission ||
                        isValidAttestationUID(campaign.admissionAttestation)
                      }
                    >
                      {(isAttestingAdmission || isWriteContractPending || isRevokingAdmission) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Attest Admission
                    </Button>
                  )}
                  {campaign.isAdmitted && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Revoke Admission
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Revoke Admission</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to revoke this student&apos;s admission? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleAdmissionAttestation(
                                campaign.studentAddress,
                                false,
                                campaign.contractAddress,
                                campaign.admissionAttestation,
                              )
                            }
                            disabled={isAttestingAdmission || isWriteContractPending || isRevokingAdmission}
                          >
                            {(isAttestingAdmission || isWriteContractPending || isRevokingAdmission) && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Confirm Revocation
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="milestones">
                <div className="space-y-6">
                  {campaign.milestones.map((milestone, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{milestone.name}</CardTitle>
                        <CardDescription>
                          GPA Requirement: {milestone.gpaRequirement} | Funds: {formatIDR(milestone.currentFunds)} /{" "}
                          {formatIDR(milestone.expectedFunds)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {milestone.status === Status.Granted && (
                          <div className="text-green-600 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed - Attestation: {milestone.attestation}
                          </div>
                        )}

                        {milestone.status === Status.Running && (
                          <div className="space-y-4">
                            <Label htmlFor={`attestation-${index}`}>Attestation</Label>
                            <Input id={`attestation-${index}`} placeholder="Enter attestation details" />
                            <Button
                              onClick={() => {
                                const attestation = (
                                  document.getElementById(`attestation-${index}`) as HTMLInputElement
                                ).value;
                                handleMilestoneAttestation(campaign.id, index, attestation);
                              }}
                            >
                              Submit Attestation
                            </Button>
                          </div>
                        )}

                        {milestone.status === Status.Idle && <span className="text-muted-foreground">Pending</span>}

                        {milestone.status === Status.Refunded && (
                          <div className="text-red-600 flex items-center">
                            <XCircle className="w-4 h-4 mr-2" />
                            Refunded - Attestation:{" "}
                            {isValidAttestationUID(campaign.admissionAttestation) && !campaign.isAdmitted
                              ? "Admission revoked"
                              : milestone.attestation}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
