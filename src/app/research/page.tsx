import { records, themes } from "@/data/baseline";
import { ModulePage } from "@/components/module-page";
export default async function Research({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string }>;
}) {
  const { theme } = await searchParams;
  const selected = themes.find((t) => t.slug === theme);
  const items = theme
    ? records.filter((r) => r.theme === theme)
    : records.filter((r) => r.kind === "学术研究");
  return (
    <ModulePage
      eyebrow="RESEARCH"
      title={selected?.name ?? "学术研究"}
      description={
        selected?.description ?? "本地历史基线中已核验的研究与分析框架。"
      }
      notice="完整筛选、题录字段与数据库连接将在后续阶段完成。"
      records={items}
    />
  );
}
