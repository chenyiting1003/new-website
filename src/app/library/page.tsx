import { ModulePage } from "@/components/module-page";
import { records } from "@/data/baseline";
export default function Library() {
  return (
    <ModulePage
      eyebrow="SAVED & NOTES"
      title="收藏与笔记"
      description="个人笔记和自定义标签将在后续阶段接入私有数据存储。"
      notice="当前提供本地历史基线阅读入口，不保存个人数据。"
      records={records.slice(0, 3)}
    />
  );
}
