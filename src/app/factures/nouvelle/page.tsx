import { connection } from "next/server";
import { getClients } from "../../../lib/data/clients";
import { getSettings } from "../../../lib/data/settings";
import { getStore } from "../../../lib/data/store";
import { CreateInvoiceClient } from "./CreateInvoiceClient";

export default async function CreateInvoicePage() {
  await connection();
  const [clients, settings] = await Promise.all([
    getClients(),
    getSettings(),
  ]);
  const store = getStore();

  return (
    <CreateInvoiceClient
      clients={clients}
      products={store.products}
      settings={settings}
    />
  );
}
