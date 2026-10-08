import { HelpClient } from "./HelpClient";
import { connection } from "next/server";

export default async function HelpPage() {
  await connection();
  return <HelpClient />;
}
