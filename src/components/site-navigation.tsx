"use client";
import Link from "next/link";
import { useState } from "react";
const links = [
  ["Overview", "/"],
  ["Countries", "/countries"],
  ["Cooperation", "/cooperation"],
  ["Research", "/research"],
  ["Weekly Briefs", "/weekly"],
  ["Saved & Notes", "/library"],
  ["Admin", "/admin"],
] as const;
export function SiteNavigation() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        Mondays <i>·</i> AI治理周报
      </Link>
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="site-nav"
      >
        菜单
      </button>
      <nav id="site-nav" className={open ? "open" : ""}>
        {links.map(([label, href]) => (
          <Link key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </Link>
        ))}
        <Link href="/search" className="nav-search">
          搜索
        </Link>
        <Link href="/weekly/historical-baseline-2026" className="latest-link">
          历史基线特刊
        </Link>
        <Link href="/login">登录</Link>
      </nav>
    </header>
  );
}
