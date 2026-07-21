"use client";
import { Suspense, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
const configured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url && key && !url.includes("your-project") && !key.includes("your-"),
  );
};
function LoginForm() {
  const router = useRouter(),
    params = useSearchParams(),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const ready = configured();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) return;
    setLoading(true);
    setError("");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace(params.get("next") ?? "/admin");
  }
  return (
    <main className="login module-page">
      <p className="eyebrow">MONDAYS / PRIVATE ACCESS</p>
      <h1>登录工作区</h1>
      {!ready ? (
        <>
          <p className="notice">
            身份认证尚未配置。请先在本地环境中配置{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> 与{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>（或 Publishable Key）。
          </p>
          <Link href="/" className="text-link">
            查看配置说明与首页 →
          </Link>
          {process.env.NODE_ENV === "development" && (
            <Link className="button secondary" href="/admin/review">
              查看静态审核演示
            </Link>
          )}
          <p className="notice">
            静态演示不会创建登录 session，也不代表管理员身份。
          </p>
        </>
      ) : (
        <form onSubmit={submit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error && <p role="alert">{error}</p>}
          <button className="button" disabled={loading}>
            {loading ? "登录中…" : "登录"}
          </button>
        </form>
      )}
    </main>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <main className="login module-page">
          <p>正在加载登录页面…</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
