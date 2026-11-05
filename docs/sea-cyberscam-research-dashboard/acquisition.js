(() => {
  const escape = x => String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  fetch('acquisition-summary.json', {cache:'no-store'}).then(r=>{if(!r.ok)throw Error(`HTTP ${r.status}`);return r.json();}).then(data=>{
    document.getElementById('acquisition-snapshot').textContent=`采集快照 ${data.generated_at} · ${data.downloaded_files} 个已校验文件 · ${(data.downloaded_bytes/1e6).toFixed(1)} MB。本页不是实时任务监控；明细只保存在本地。`;
    document.getElementById('acquisition-grid').innerHTML=data.sources.map(s=>`<article class="acquisition-card" data-state="${escape(s.state)}"><div class="acquisition-card-top"><span>${escape(s.priority)}</span><b>${escape(s.status)}</b></div><h4>${escape(s.title)}</h4><p>${escape(s.result)}</p><dl><dt>实际尺度／时间</dt><dd>${escape(s.coverage)}</dd><dt>已做预处理</dt><dd>${escape(s.processed)}</dd><dt>下一步</dt><dd>${escape(s.next)}</dd></dl><a href="${escape(s.url)}" target="_blank" rel="noreferrer">官方来源 ↗</a></article>`).join('');
  }).catch(error=>{document.getElementById('acquisition-snapshot').textContent=`采集状态暂时无法读取：${error.message}`;});
})();
