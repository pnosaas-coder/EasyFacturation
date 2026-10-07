import { connection } from "next/server";
import { getClients } from "../../lib/data/clients";
import { ClientsListClient } from "./ClientsListClient";

export default async function ClientsListPage() {
  await connection();
  const clients = await getClients();
  return <ClientsListClient initialClients={clients} />;
}
