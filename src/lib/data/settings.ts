import { getStore } from "./store";
import { OrganizationSettings } from "../domain/types";
import { SettingsInput } from "../validation/settings";

export async function getSettings(): Promise<OrganizationSettings> {
  const store = getStore();
  return store.settings;
}

export async function updateSettings(input: SettingsInput): Promise<OrganizationSettings> {
  const store = getStore();
  store.settings = {
    ...store.settings,
    ...input,
  };
  return store.settings;
}
