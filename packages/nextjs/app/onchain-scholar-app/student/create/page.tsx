"use client";

import { useState } from "react";
import { Button, Field, Input, Label, Select } from "@headlessui/react";
import { Plus, Trash2 } from "lucide-react";

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
      <div className="card bg-base-100 shadow-xl w-full max-w-2xl mx-auto">
        <div className="card-body flex flex-col gap-6">
          <div>
            <div className="card-title mb-2">Create Your Scholarship Campaign</div>
            <div className="text-sm text-base-300">Fill in the details to start your fundraising journey</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Field className="flex flex-col space-y-2">
                <Label htmlFor="name" className="font-bold">
                  Full Name
                </Label>
                <Input
                  className="input input-bordered"
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </Field>
              <Field className="flex flex-col space-y-2">
                <Label htmlFor="institution" className="font-bold">
                  Institution / University
                </Label>
                <Input
                  className="input input-bordered"
                  id="institution"
                  placeholder="Enter your institution or university name"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  required
                />
              </Field>
              <Field className="flex flex-col space-y-2">
                <Label htmlFor="walletAddress" className="font-bold">
                  Institution Wallet Address
                </Label>
                <Input
                  className="input input-bordered"
                  id="walletAddress"
                  placeholder="Enter the institution's wallet address"
                  value={walletAddress}
                  onChange={e => setWalletAddress(e.target.value)}
                  required
                />
              </Field>
              <Field className="flex flex-col space-y-2">
                <Label className="font-bold">Milestones</Label>
                {milestones.map((milestone, index) => (
                  <div key={index} className="card card-bordered p-4 mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Semester {milestone.semester}</h4>
                      {index > 0 && (
                        <Button className="btn btn-ghost" type="button" onClick={() => removeMilestone(index)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove milestone</span>
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field className="flex flex-col space-y-2">
                        <Label htmlFor={`gpa-${index}`} className="text-sm">
                          GPA Requirement
                        </Label>
                        <Select
                          value={milestone.gpaRequirement}
                          className="select select-bordered"
                          onChange={(e: any) => updateMilestone(index, "gpaRequirement", e.target.value)}
                        >
                          <option value="2.0">2.0</option>
                          <option value="2.5">2.5</option>
                          <option value="3.0">3.0</option>
                          <option value="3.5">3.5</option>
                          <option value="4.0">4.0</option>
                          <option value="P/F">Pass/Fail</option>
                        </Select>
                      </Field>
                      <Field className="flex flex-col space-y-2">
                        <Label htmlFor={`funds-${index}`} className="text-sm">
                          Expected Funds (IDRX)
                        </Label>
                        <Input
                          id={`funds-${index}`}
                          type="number"
                          className="input input-bordered"
                          placeholder="Enter amount"
                          value={milestone.expectedFunds}
                          onChange={e => updateMilestone(index, "expectedFunds", e.target.value)}
                          required
                        />
                      </Field>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addMilestone} className="btn btn-outline mt-2">
                  <Plus />
                  Add Milestone
                </Button>
              </Field>
            </div>
            <Button type="submit" className="btn btn-primary w-full mt-6">
              Create Campaign
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
