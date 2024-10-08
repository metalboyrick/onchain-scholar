import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

export default function Header() {
  return (
    <nav className="px-8 py-5 flex justify-between items-center">
      <div className="font-bold">Onchain Scholar.</div>
      <DynamicWidget />
    </nav>
  );
}
