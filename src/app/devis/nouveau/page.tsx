import { getClients } from "../../../lib/data/clients";
import { getStore } from "../../../lib/data/store";
import { CreateQuoteClient } from "./CreateQuoteClient";
import { connection } from "next/server";

export default async function NewQuotePage() {
  await connection();
  const clients = await getClients();
  const store = getStore();

  return <CreateQuoteClient clients={clients} products={store.products} />;
}
