import { getStore } from "./store";
import { OrganizationSettings } from "../domain/types";
import { SettingsInput } from "../validation/settings";
import { createServerClient } from "../supabase/client";
import { mapSettingsFromRow, mapSettingsToRow } from "../supabase/adapters";

export async function getSettings(): Promise<OrganizationSettings> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase.from("organization_settings").select("*").limit(1).maybeSingle();
    if (!error && data) {
      const mapped = mapSettingsFromRow(data);
      const store = getStore();
      store.settings = mapped;
      return mapped;
    }
  } catch {
    // Fallback
  }

  const store = getStore();
  return store.settings;
}

export async function updateSettings(input: SettingsInput): Promise<OrganizationSettings> {
  const store = getStore();
  store.settings = {
    ...store.settings,
    ...input,
  };

  try {
    const supabase = createServerClient();
    const { data: existing } = await supabase.from("organization_settings").select("id").limit(1).maybeSingle();
    if (existing) {
      await supabase.from("organization_settings").update(mapSettingsToRow(store.settings)).eq("id", existing.id);
    } else {
      await supabase.from("organization_settings").insert(mapSettingsToRow(store.settings));
    }
  } catch {
    // Fallback
  }

  return store.settings;
}
