import Link from "next/link";
import { getAuthContext } from "@/lib/auth";
export async function SiteNavigation() {
  const auth = await getAuthContext();
  const links = [
    ["Overview", "/"],
    ["Countries", "/countries"],
    ["Cooperation", "/cooperation"],
    ["Research", "/research"],
    ["Weekly Briefs", "/weekly"],
    ["Search", "/search"],
  ] as const;
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        AI治理知识数据库 <i>·</i> governance knowledge
      </Link>
      <nav id="site-nav">
        {links.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
        {auth.user && (auth.role === "admin" || auth.role === "editor") && (
          <Link href="/admin">Admin</Link>
        )}
        <Link href="/login">{auth.user ? "账户" : "登录"}</Link>
      </nav>
    </header>
  );
}
