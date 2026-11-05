(() => {
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);

  function renderCards(target, cards) {
    const root = document.querySelector(target);
    if (!root) return;
    root.innerHTML = cards.map(card => `
      <article class="status-metric-card">
        <span>${escapeHtml(card.label)}</span>
        <strong>${escapeHtml(card.value)}</strong>
        <p>${escapeHtml(card.note)}</p>
      </article>
    `).join('');
  }

  fetch('data-status.json', {cache: 'no-store'})
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      renderCards('#source-metric-grid', data.source || []);
      renderCards('#processing-metric-grid', data.processing || []);
      renderCards('#experiment-metric-grid', data.experiment || []);
    })
    .catch(error => {
      ['#source-metric-grid', '#processing-metric-grid', '#experiment-metric-grid'].forEach(selector => {
        const root = document.querySelector(selector);
        if (root) root.innerHTML = `<p class="load-error">数据状态读取失败：${escapeHtml(error.message)}</p>`;
      });
    });
})();
