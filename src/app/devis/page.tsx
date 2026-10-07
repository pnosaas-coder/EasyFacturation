import { connection } from "next/server";
import { getQuotes } from "../../lib/data/quotes";
import { getClients } from "../../lib/data/clients";
import { getStore } from "../../lib/data/store";
import { QuotesListClient } from "./QuotesListClient";

export default async function QuotesListPage() {
  await connection();
  const [quotes, clients] = await Promise.all([
    getQuotes(),
    getClients(),
  ]);
  const store = getStore();

  return (
    <QuotesListClient
      initialQuotes={quotes}
      clients={clients}
      products={store.products}
    />
  );
}
