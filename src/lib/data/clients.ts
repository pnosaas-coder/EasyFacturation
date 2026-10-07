import { getStore } from "./store";
import { Client } from "../domain/types";
import { ClientInput } from "../validation/client";

export async function getClients(filters?: { search?: string }): Promise<Client[]> {
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
  const store = getStore();
  const client = store.clients.find((c) => c.id === id);
  return client || null;
}

export async function createClient(input: ClientInput): Promise<Client> {
  const store = getStore();

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

  store.clients.unshift(newClient);
  return newClient;
}

export async function updateClient(id: string, input: Partial<ClientInput>): Promise<Client | null> {
  const store = getStore();
  const client = store.clients.find((c) => c.id === id);
  if (!client) return null;

  Object.assign(client, input);
  return client;
}
