"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
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

type Milestone = {
  semester: number;
  gpaRequirement: string;
  expectedFunds: number;
  currentFunds: number;
  isCompleted: boolean;
  attestation?: string;
};

type Campaign = {
  id: string;
  studentName: string;
  institution: string;
  contractAddress: string;
  isAdmitted: boolean;
  milestones: Milestone[];
  currentMilestone: number;
};

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
};

export default function UniversityAttestation() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Simulating API call to fetch campaigns
    setTimeout(() => {
      setCampaigns([
        {
          id: "1",
          studentName: "Alice Johnson",
          institution: "Tech University",
          contractAddress: "0x1234567890123456789012345678901234567890",
          isAdmitted: false,
          milestones: [
            { semester: 1, gpaRequirement: "3.0", expectedFunds: 20000000, currentFunds: 20000000, isCompleted: false },
            { semester: 2, gpaRequirement: "3.0", expectedFunds: 20000000, currentFunds: 10000000, isCompleted: false },
            { semester: 3, gpaRequirement: "3.2", expectedFunds: 25000000, currentFunds: 0, isCompleted: false },
            { semester: 4, gpaRequirement: "3.2", expectedFunds: 25000000, currentFunds: 0, isCompleted: false },
          ],
          currentMilestone: 0,
        },
        {
          id: "2",
          studentName: "Bob Smith",
          institution: "Tech University",
          contractAddress: "0x0987654321098765432109876543210987654321",
          isAdmitted: true,
          milestones: [
            {
              semester: 1,
              gpaRequirement: "3.0",
              expectedFunds: 15000000,
              currentFunds: 15000000,
              isCompleted: true,
              attestation: "Completed with 3.5 GPA",
            },
            { semester: 2, gpaRequirement: "3.0", expectedFunds: 15000000, currentFunds: 15000000, isCompleted: false },
            { semester: 3, gpaRequirement: "3.2", expectedFunds: 20000000, currentFunds: 10000000, isCompleted: false },
            { semester: 4, gpaRequirement: "3.2", expectedFunds: 20000000, currentFunds: 5000000, isCompleted: false },
          ],
          currentMilestone: 1,
        },
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleAdmissionAttestation = async (campaignId: string, isAdmitted: boolean) => {
    // Simulating blockchain transaction for admission attestation
    toast({
      title: "Processing attestation...",
      description: "Please wait while we record the admission attestation on the blockchain.",
    });
    setTimeout(() => {
      setCampaigns(prevCampaigns =>
        prevCampaigns.map(campaign =>
          campaign.id === campaignId ? { ...campaign, isAdmitted: isAdmitted } : campaign,
        ),
      );
      toast({
        title: "Admission Attestation Recorded",
        description: `The student has been ${isAdmitted ? "admitted" : "rejected"}.`,
      });
    }, 2000);
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
              isCompleted: true,
              attestation: attestation,
            };
            return {
              ...campaign,
              milestones: updatedMilestones,
              currentMilestone: campaign.currentMilestone + 1,
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

  return (
    <div className="container mx-auto px-4 py-8">
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
                  {campaign.studentName} - {campaign.institution}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {campaign && (
        <Card>
          <CardHeader>
            <CardTitle>{campaign.studentName}&apos;s Campaign</CardTitle>
            <CardDescription>Contract Address: {campaign.contractAddress}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="admission">
              <TabsList>
                <TabsTrigger value="admission">Admission</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
              </TabsList>
              <TabsContent value="admission">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Current Status:</span>
                    {campaign.isAdmitted ? (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" /> Admitted
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" /> Not Admitted
                      </span>
                    )}
                  </div>
                  {!campaign.isAdmitted && (
                    <Button onClick={() => handleAdmissionAttestation(campaign.id, true)}>Attest Admission</Button>
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
                          <Button variant="destructive" onClick={() => handleAdmissionAttestation(campaign.id, false)}>
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
                        <CardTitle>Semester {milestone.semester}</CardTitle>
                        <CardDescription>
                          GPA Requirement: {milestone.gpaRequirement} | Funds: {formatIDR(milestone.currentFunds)} /{" "}
                          {formatIDR(milestone.expectedFunds)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {milestone.isCompleted ? (
                          <div className="text-green-600 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed - Attestation: {milestone.attestation}
                          </div>
                        ) : index === campaign.currentMilestone ? (
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
                        ) : (
                          <span className="text-muted-foreground">Pending</span>
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
