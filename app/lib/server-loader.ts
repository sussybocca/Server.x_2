import { supabase } from "./supabase";

export async function getServers() {
  const { data, error } = await supabase
    .from("servers")
    .select("virtual_url")
    .eq("is_public", true);

  if (error) throw error;
  return data.map(s => s.virtual_url);
}

export async function getServerByUrl(virtualUrl: string) {
  const { data, error } = await supabase
    .from("servers")
    .select("*")
    .eq("virtual_url", virtualUrl)
    .single();

  if (error) throw error;
  return data;
}
