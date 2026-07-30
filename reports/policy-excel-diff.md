# 政策候选差分报告

当前正式基线共有 **14** 条记录（其中政策/制度与学术记录混合）；候选清单按规范化标题、官方 URL、机构、版本和法律状态与 `src/data/baseline/index.ts` 比较。没有读取或假设存在 Excel 文件。

| 分类                | 数量 | 处理                                                                                                                     |
| ------------------- | ---: | ------------------------------------------------------------------------------------------------------------------------ |
| duplicate_exact     |    5 | 不新增：新一代人工智能伦理规范、可信赖AI伦理指南、EU AI Act、全球人工智能治理倡议、NIST AI RMF 1.0                       |
| version_update      |    7 | 不复制主记录；中国安全治理框架1.0/2.0、香港伦理框架2021/2025、新加坡框架2019/2020、日本治理指南2021/2022进入版本建模待办 |
| possible_duplicate  |    6 | 人工核验标题翻译、草案/正式版或当前法律状态                                                                              |
| missing_verified    |   16 | 加入本地 `pending_review` 候选，不进入公开 records                                                                       |
| missing_unverified  |   17 | 因缺少官方来源、精确文件身份或法律状态暂不导入                                                                           |
| excluded_non_policy |    1 | Responsible AI Index 为行业工具，不作为政府政策                                                                          |

## missing_verified

详见 `pendingPolicyCandidates`。全部保留候选提供的官方 URL，年份仅保存为 `year`，没有补成 1 月 1 日；bill 保持 `legislative_proposal`，consultation 保持 `public_consultation`。

## 需人工核验的重要条目

- 科技伦理审查办法（试行）、训练数据安全规范：缺少一手 URL。
- 香港 2025 人工智能道德框架：需确认是否为 2021 框架修订版。
- 美国行政命令与 2025 未识别框架：需确认当前法律状态或精确文件。
- 日本多组指南：中文译名重复，需按官方日文/英文标题和版本归并。
- 澳大利亚 Responsible AI Index：排除为行业工具。
