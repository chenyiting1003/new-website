(() => {
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
  const confidenceLabels = {
    high_documented_text_plus_visual: '高：文本记录＋图像一致',
    medium_text_plus_visual: '中：名称／别名＋图像',
    medium_visual_consensus: '中：多图视觉一致',
    low_visual_inference_review_required: '低：视觉推断，需复核',
    insufficient_visual_evidence: '证据不足'
  };

  function render(data) {
    const summary = document.querySelector('#visual-summary');
    summary.innerHTML = [
      ['园区总数', data.total_sites],
      ['已分配功能', data.assigned_sites],
      ['仍无法判断', data.unidentified_sites],
      ['人工复核队列', data.manual_review_queue]
    ].map(([label, value]) => `<article class="visual-stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join('');

    const rows = [...data.function_counts].sort((a, b) => b.count - a.count);
    const maxCount = Math.max(...rows.map(row => row.count), 1);
    document.querySelector('#function-bars').innerHTML = rows.map(row => `
      <div class="function-bar-row" title="${escapeHtml(row.label_en)} · ${escapeHtml(row.key)}">
        <div class="function-bar-label"><span>${escapeHtml(row.label_zh)}</span><small>${escapeHtml(row.label_en)}</small></div>
        <div class="function-bar-track"><i style="width:${(row.count / maxCount * 100).toFixed(1)}%"></i></div>
        <b>${row.count}</b>
      </div>
    `).join('');

    const confidenceOrder = [
      'high_documented_text_plus_visual',
      'medium_text_plus_visual',
      'medium_visual_consensus',
      'low_visual_inference_review_required',
      'insufficient_visual_evidence'
    ];
    document.querySelector('#confidence-list').innerHTML = confidenceOrder.map(key => `
      <div><span>${escapeHtml(confidenceLabels[key])}</span><b>${data.confidence_counts[key] || 0}</b></div>
    `).join('');
  }

  fetch('visual-function-summary.json', {cache: 'no-store'})
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(render)
    .catch(error => {
      const root = document.querySelector('#visual-summary');
      if (root) root.innerHTML = `<p class="load-error">视觉汇总读取失败：${escapeHtml(error.message)}</p>`;
    });
})();
