import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export type AuthContext = {
  configured: boolean;
  user: { id: string; email?: string } | null;
  role: "admin" | "editor" | "viewer" | null;
};
export async function getAuthContext(): Promise<AuthContext> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("your-project") || key.includes("your-"))
    return { configured: false, user: null, role: null };
  const store = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: { getAll: () => store.getAll(), setAll() {} },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { configured: true, user: null, role: null };
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  return {
    configured: true,
    user: { id: user.id, email: user.email },
    role: data?.role ?? "viewer",
  };
}
export async function requireStaff(next: string) {
  const auth = await getAuthContext();
  if (!auth.user) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (auth.role !== "admin" && auth.role !== "editor") redirect("/");
  return auth;
}
