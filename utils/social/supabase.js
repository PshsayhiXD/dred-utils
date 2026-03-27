import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://aeyjhmvnocfjytbydaqk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFleWpobXZub2Nmanl0YnlkYXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNjUzNjQsImV4cCI6MjA4OTg0MTM2NH0.4b5wyOSXYAOZlFszY-V5fRtIN21ovfX0FjHZFtp-bo4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
