import { RecurringClient } from "./RecurringClient";
import { connection } from "next/server";

export default async function RecurringPage() {
  await connection();
  return <RecurringClient />;
}
