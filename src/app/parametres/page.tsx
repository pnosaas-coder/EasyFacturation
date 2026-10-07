import { connection } from "next/server";
import { getSettings } from "../../lib/data/settings";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  await connection();
  const settings = await getSettings();
  return <SettingsClient initialSettings={settings} />;
}
