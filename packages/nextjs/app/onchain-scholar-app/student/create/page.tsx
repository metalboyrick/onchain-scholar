"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "~~/components/onchain-scholar/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/onchain-scholar/ui/card";
import { Input } from "~~/components/onchain-scholar/ui/input";
import { Label } from "~~/components/onchain-scholar/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/onchain-scholar/ui/select";

type Milestone = {
  semester: number;
  gpaRequirement: string;
  expectedFunds: string;
};

export default function CreateCampaign() {
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([{ semester: 1, gpaRequirement: "", expectedFunds: "" }]);

  const addMilestone = () => {
    setMilestones([...milestones, { semester: milestones.length + 1, gpaRequirement: "", expectedFunds: "" }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    const updatedMilestones = milestones.map((milestone, i) => {
      if (i === index) {
        return { ...milestone, [field]: value };
      }
      return milestone;
    });
    setMilestones(updatedMilestones);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend or smart contract
    console.log({ name, institution, walletAddress, milestones });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Your Scholarship Campaign</CardTitle>
          <CardDescription>Fill in the details to start your fundraising journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution / University</Label>
                <Input
                  id="institution"
                  placeholder="Enter your institution or university name"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Institution Wallet Address</Label>
                <Input
                  id="walletAddress"
                  placeholder="Enter the institution's wallet address"
                  value={walletAddress}
                  onChange={e => setWalletAddress(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Milestones</Label>
                {milestones.map((milestone, index) => (
                  <Card key={index} className="p-4 mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Semester {milestone.semester}</h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="px-1 py-1"
                          onClick={() => removeMilestone(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`gpa-${index}`}>GPA Requirement</Label>
                        <Select
                          value={milestone.gpaRequirement}
                          onValueChange={value => updateMilestone(index, "gpaRequirement", value)}
                        >
                          <SelectTrigger id={`gpa-${index}`}>
                            <SelectValue placeholder="Select GPA or P/F" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2.0">2.0</SelectItem>
                            <SelectItem value="2.5">2.5</SelectItem>
                            <SelectItem value="3.0">3.0</SelectItem>
                            <SelectItem value="3.5">3.5</SelectItem>
                            <SelectItem value="4.0">4.0</SelectItem>
                            <SelectItem value="P/F">Pass/Fail</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`funds-${index}`}>Expected Funds</Label>
                        <Input
                          id={`funds-${index}`}
                          type="number"
                          placeholder="Enter amount"
                          value={milestone.expectedFunds}
                          onChange={e => updateMilestone(index, "expectedFunds", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                <Button type="button" variant="secondary" onClick={addMilestone} className="mt-2">
                  <Plus />
                  Add Milestone
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full mt-6">
              Create Campaign
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
