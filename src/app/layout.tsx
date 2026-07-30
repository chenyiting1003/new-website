import type { Metadata } from "next";
import "./globals.css";
import { SiteNavigation } from "@/components/site-navigation";
export const metadata: Metadata = {
  title: "AI治理知识数据库 · governance knowledge",
  description: "Global AI Governance Policy & Research Observatory",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>
        <SiteNavigation />
        {children}
        <footer>
          AI治理知识数据库 · governance knowledge　·　本地历史基线阅读版
        </footer>
      </body>
    </html>
  );
}
