import { getStore } from "./store";
import { Client } from "../domain/types";
import { ClientInput } from "../validation/client";
import { createServerClient } from "../supabase/client";
import { mapClientFromRow, mapClientToRow } from "../supabase/adapters";

export async function getClients(filters?: { search?: string }): Promise<Client[]> {
  try {
    const supabase = createServerClient();
    let query = supabase.from("clients").select("*").order("total_billed", { ascending: false });

    if (filters?.search && filters.search.trim().length > 0) {
      const term = `%${filters.search.trim()}%`;
      query = query.or(`name.ilike.${term},contact_name.ilike.${term},email.ilike.${term},phone.ilike.${term},city.ilike.${term}`);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      const mapped = data.map(mapClientFromRow);
      // Synchronize in-memory store
      const store = getStore();
      store.clients = mapped;
      return mapped;
    }
  } catch {
    // Graceful fallback to store
  }

  // Fallback to store
  const store = getStore();
  let list = [...store.clients];

  if (filters?.search && filters.search.trim().length > 0) {
    const term = filters.search.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.contactName && c.contactName.toLowerCase().includes(term)) ||
        (c.email && c.email.toLowerCase().includes(term)) ||
        (c.phone && c.phone.includes(term)) ||
        (c.city && c.city.toLowerCase().includes(term))
    );
  }

  return list.sort((a, b) => b.totalBilled - a.totalBilled);
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
    if (!error && data) {
      return mapClientFromRow(data);
    }
  } catch {
    // Fallback to store
  }

  const store = getStore();
  const client = store.clients.find((c) => c.id === id);
  return client || null;
}

export async function createClient(input: ClientInput): Promise<Client> {
  const newClient: Client = {
    id: `cli_${Date.now()}`,
    name: input.name,
    contactName: input.contactName || undefined,
    email: input.email || undefined,
    phone: input.phone || undefined,
    address: input.address || undefined,
    city: input.city || undefined,
    country: input.country || "CM",
    taxId: input.taxId || undefined,
    rccm: input.rccm || undefined,
    notes: input.notes || undefined,
    totalBilled: 0,
    totalPaid: 0,
    balanceDue: 0,
    createdAt: new Date().toISOString(),
  };

  try {
    const supabase = createServerClient();
    await supabase.from("clients").insert(mapClientToRow(newClient));
  } catch {
    // Fallback to store
  }

  const store = getStore();
  store.clients.unshift(newClient);
  return newClient;
}

export async function updateClient(id: string, input: Partial<ClientInput>): Promise<Client | null> {
  const store = getStore();
  const client = store.clients.find((c) => c.id === id);
  if (!client) return null;

  Object.assign(client, input);

  try {
    const supabase = createServerClient();
    await supabase.from("clients").update(mapClientToRow(client)).eq("id", id);
  } catch {
    // Fallback to store
  }

  return client;
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (!error) {
      const store = getStore();
      const index = store.clients.findIndex((c) => c.id === id);
      if (index !== -1) store.clients.splice(index, 1);
      return true;
    }
  } catch {
    // Fallback to store
  }

  const store = getStore();
  const index = store.clients.findIndex((c) => c.id === id);
  if (index === -1) return false;

  store.clients.splice(index, 1);
  return true;
}

export function recalculateClientCounters(clientId: string): void {
  const store = getStore();
  const client = store.clients.find((c) => c.id === clientId);
  if (!client) return;

  const activeInvoices = store.invoices.filter(
    (inv) => inv.clientId === clientId && inv.status !== "draft" && inv.status !== "cancelled"
  );

  client.totalBilled = activeInvoices.reduce((sum, inv) => sum + inv.total, 0);
  client.totalPaid = activeInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  client.balanceDue = activeInvoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  // Sync back to Supabase asynchronously
  try {
    const supabase = createServerClient();
    supabase
      .from("clients")
      .update({
        total_billed: client.totalBilled,
        total_paid: client.totalPaid,
        balance_due: client.balanceDue,
      })
      .eq("id", clientId)
      .then();
  } catch {
    // Ignore in offline mode
  }
}
