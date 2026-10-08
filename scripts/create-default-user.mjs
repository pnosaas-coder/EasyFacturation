import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wpiacsyiluhmjswdoshb.supabase.co";
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaWFjc3lpbHVobWpzd2Rvc2hiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTQ1OTE3NywiZXhwIjoyMTA3MDM1MTc3fQ.iq_nurU9OahApuT-GZnDIVtbaeQMvdEAImcPV82fD1g";

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const email = "contact@prunus-engineering.cm";
  const password = "Prunus2026!*";

  console.log("Checking if user already exists in auth.users...");
  const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    console.error("Error listing users:", listErr);
    process.exit(1);
  }

  const existing = users.find((u) => u.email === email);
  if (existing) {
    console.log(`User ${email} already exists with id: ${existing.id}. Updating password...`);
    const { error: updErr } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: {
        full_name: "Philippe NOUGOUE",
        role: "admin",
        company: "Prunus Engineering SARL",
      },
    });
    if (updErr) console.error("Error updating user:", updErr);
    else console.log("Password and metadata successfully updated.");
  } else {
    console.log(`Creating user ${email}...`);
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: "Philippe NOUGOUE",
        role: "admin",
        company: "Prunus Engineering SARL",
      },
    });

    if (error) {
      console.error("Error creating user:", error);
      process.exit(1);
    }

    console.log(`User created successfully with id: ${data.user.id}`);
  }
}

main().catch(console.error);
