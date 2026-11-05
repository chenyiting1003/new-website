(() => {
  const storageKey = 'sea-cyberscam-visual-function-review-v1';
  const state = {data: null, items: [], filtered: [], currentId: null, reviews: {}};
  const $ = selector => document.querySelector(selector);
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
  const csvEscape = value => `"${String(value ?? '').replaceAll('"', '""')}"`;

  function loadSaved() {
    try { state.reviews = JSON.parse(localStorage.getItem(storageKey) || '{}'); }
    catch { state.reviews = {}; }
  }

  function saveAll() {
    localStorage.setItem(storageKey, JSON.stringify(state.reviews));
  }

  function reviewed(item) {
    return Boolean(state.reviews[item.site_id]?.selected_function_key);
  }

  function currentItem() {
    return state.filtered.find(item => item.site_id === state.currentId) || state.filtered[0];
  }

  function renderProgress() {
    const count = state.items.filter(reviewed).length;
    $('#review-progress-text').textContent = `${count} / ${state.items.length}`;
    $('#review-progress-bar').style.width = `${state.items.length ? count / state.items.length * 100 : 0}%`;
  }

  function renderQueue() {
    $('#queue-count').textContent = `${state.filtered.length} 个`;
    $('#queue-list').innerHTML = state.filtered.map((item, index) => `
      <button type="button" class="queue-item ${item.site_id === state.currentId ? 'active' : ''} ${reviewed(item) ? 'reviewed' : ''}" data-site-id="${escapeHtml(item.site_id)}">
        <b>${String(index + 1).padStart(2, '0')}</b>
        <span>${escapeHtml(item.name)}<small>${escapeHtml(item.province)}</small></span>
        <i aria-label="${reviewed(item) ? '已复核' : '未复核'}"></i>
      </button>
    `).join('');
    $('#queue-list').querySelector('.queue-item.active')?.scrollIntoView({block: 'nearest'});
  }

  function renderCurrent() {
    const item = currentItem();
    const hasItems = Boolean(item);
    $('#review-workspace').hidden = !hasItems;
    $('#review-empty').hidden = hasItems;
    if (!item) return;
    state.currentId = item.site_id;
    const index = state.filtered.findIndex(entry => entry.site_id === item.site_id);
    const review = state.reviews[item.site_id] || {};
    $('#review-position').textContent = `地点 ${index + 1} / ${state.filtered.length}`;
    $('#site-name').textContent = item.name;
    $('#site-id').textContent = item.site_id;
    $('#site-province').textContent = item.province;
    $('#review-image').src = item.image;
    $('#review-image').alt = `${item.name} ${item.source_period} 同范围遥感对比图`;
    $('#review-image-link').href = item.image;
    $('#image-period').textContent = `${item.source_period} · Sentinel-2同范围对比`;
    document.querySelectorAll('input[name="building-function"]').forEach(input => {
      input.checked = input.value === review.selected_function_key;
    });
    $('#review-confidence').value = review.confidence || '';
    $('#review-notes').value = review.notes || '';
    renderQueue();
  }

  function applyFilters(preserveCurrent = true) {
    const mode = $('#review-filter').value;
    const province = $('#province-filter').value;
    state.filtered = state.items.filter(item => {
      const statusMatch = mode === 'all' || (mode === 'reviewed' && reviewed(item)) || (mode === 'unreviewed' && !reviewed(item));
      return statusMatch && (province === 'all' || item.province === province);
    });
    if (!preserveCurrent || !state.filtered.some(item => item.site_id === state.currentId)) state.currentId = state.filtered[0]?.site_id || null;
    renderCurrent();
  }

  function move(step) {
    if (!state.filtered.length) return;
    const index = Math.max(0, state.filtered.findIndex(item => item.site_id === state.currentId));
    state.currentId = state.filtered[(index + step + state.filtered.length) % state.filtered.length].site_id;
    renderCurrent();
  }

  function saveCurrent(event) {
    event.preventDefault();
    const item = currentItem();
    if (!item) return;
    const currentIndex = state.filtered.findIndex(entry => entry.site_id === item.site_id);
    const nextId = state.filtered[(currentIndex + 1) % state.filtered.length]?.site_id;
    const selected = document.querySelector('input[name="building-function"]:checked');
    if (!selected) {
      alert('请选择一个功能；如果无法可靠判断，请选择“仍无法判断”。');
      return;
    }
    const dictionary = state.data.dictionary[selected.value];
    state.reviews[item.site_id] = {
      selected_function_key: selected.value,
      selected_function_zh: dictionary.zh,
      selected_function_en: dictionary.en,
      confidence: $('#review-confidence').value,
      notes: $('#review-notes').value.trim(),
      reviewed_at: new Date().toISOString()
    };
    saveAll();
    renderProgress();
    state.currentId = nextId;
    applyFilters(true);
  }

  function clearCurrent() {
    const item = currentItem();
    if (!item || !state.reviews[item.site_id]) return;
    delete state.reviews[item.site_id];
    saveAll();
    renderProgress();
    applyFilters(true);
  }

  function exportCsv() {
    const rows = state.items.filter(reviewed).map(item => {
      const review = state.reviews[item.site_id];
      return [item.site_id, item.post_id, item.name, item.province, item.country, review.selected_function_key,
        review.selected_function_zh, review.selected_function_en, review.confidence, review.notes, review.reviewed_at, item.source_period];
    });
    if (!rows.length) {
      alert('还没有已保存的人工复核结果。');
      return;
    }
    const header = ['site_id','post_id','name','province','country','selected_function_key','selected_function_zh','selected_function_en','confidence','notes','reviewed_at','image_source_period'];
    const csv = '\uFEFF' + [header, ...rows].map(row => row.map(csvEscape).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = `visual_function_manual_review_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function initialize(data) {
    state.data = data;
    state.items = data.items || [];
    loadSaved();
    $('#function-options').innerHTML = Object.entries(data.dictionary).map(([key, value]) => `
      <label class="function-option">
        <input type="radio" name="building-function" value="${escapeHtml(key)}">
        <b>${escapeHtml(value.zh)}</b><small>${escapeHtml(value.en)}</small><code>${escapeHtml(key)}</code>
      </label>
    `).join('');
    const provinces = [...new Set(state.items.map(item => item.province))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
    $('#province-filter').insertAdjacentHTML('beforeend', provinces.map(province => `<option value="${escapeHtml(province)}">${escapeHtml(province)}</option>`).join(''));
    renderProgress();
    applyFilters(false);
  }

  $('#review-form').addEventListener('submit', saveCurrent);
  $('#previous-site').addEventListener('click', () => move(-1));
  $('#clear-site').addEventListener('click', clearCurrent);
  $('#export-review').addEventListener('click', exportCsv);
  $('#review-filter').addEventListener('change', () => applyFilters(false));
  $('#province-filter').addEventListener('change', () => applyFilters(false));
  $('#queue-list').addEventListener('click', event => {
    const button = event.target.closest('[data-site-id]');
    if (!button) return;
    state.currentId = button.dataset.siteId;
    renderCurrent();
  });
  document.addEventListener('keydown', event => {
    if (event.target.matches('textarea,input,select')) return;
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  });

  fetch('visual-review-data.json', {cache: 'no-store'})
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(initialize)
    .catch(error => { $('#review-error').textContent = `复核数据读取失败：${error.message}`; });
})();
