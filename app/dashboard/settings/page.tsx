import dynamic from "next/dynamic";

const Integrations = dynamic(() => import("./Integrations"));

export default function SettingsPage() {
  return <Integrations />;
}
