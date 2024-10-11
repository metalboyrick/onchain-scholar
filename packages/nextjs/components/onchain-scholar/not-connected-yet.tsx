// import { DynamicConnectButton } from "@dynamic-labs/sdk-react-core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowRight, Coins, HandHelping, ShieldCheck, Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~~/components/onchain-scholar/ui/card";

export default function NotConnectedYet() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Connect Your Wallet</CardTitle>
          <CardDescription>
            To access Onchain Scholar and manage your scholarship campaigns, please log in or connect your Web3 wallet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Wallet className="h-24 w-24 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <span>Secure and encrypted connection</span>
            </div>
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span>Manage your scholarships and funds</span>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowRight className="h-5 w-5 text-blue-500" />
              <span>Easy to use interface</span>
            </div>
            <div className="flex items-center space-x-2">
              <HandHelping className="h-5 w-5 text-pink-500" />
              <span>Seamless User Experience</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center w-full">
          {/* <DynamicConnectButton buttonClassName="btn btn-primary w-full">
            Sign in or Connect Wallet
          </DynamicConnectButton> */}
          <ConnectButton></ConnectButton>
        </CardFooter>
      </Card>
    </div>
  );
}
