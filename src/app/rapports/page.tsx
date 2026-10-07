import { getVatReport } from "../../lib/data/reports";
import { ReportsClient } from "./ReportsClient";
import { connection } from "next/server";

export default async function ReportsPage() {
  await connection();
  const report = await getVatReport(2026);

  return <ReportsClient report={report} />;
}
