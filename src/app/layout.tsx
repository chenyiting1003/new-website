import type { Metadata } from "next"; import Link from "next/link"; import "./globals.css";
export const metadata: Metadata = { title: "Mondays · AI治理周报", description: "Private AI governance research workspace" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body><header><Link className="brand" href="/">Mondays <i>·</i> AI治理周报</Link><nav><Link href="/">Overview</Link><Link href="/admin/review">Admin</Link><Link href="/login">登录</Link></nav></header>{children}<footer>私有研究工作区 · Phase 0–1 基础版本</footer></body></html>}
