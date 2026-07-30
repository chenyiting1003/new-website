import { ModulePage } from "@/components/module-page";
import { records } from "@/data/baseline";
export default function Search() {
  return (
    <ModulePage
      eyebrow="SEARCH"
      title="搜索历史基线"
      description="当前页面展示可供阅读的本地基线记录。"
      notice="全文检索和数据库筛选将在后续阶段完成。"
      records={records}
    />
  );
}
