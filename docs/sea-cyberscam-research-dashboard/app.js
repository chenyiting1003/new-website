const statusLabel = {done:'已完成', active:'进行中', paused:'已暂缓', blocked:'受阻', planned:'待开始'};

async function loadProgress() {
  const response = await fetch('progress.json', {cache:'no-store'});
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function render(data) {
  document.querySelector('#snapshot-date').textContent = `更新 ${data.updated_at}`;
  document.querySelector('#current-focus').textContent = data.current_focus;
  const done = data.tasks.filter(t => t.state === 'done').length;
  const weighted = data.tasks.reduce((sum,t) => sum + ({done:1,active:.5,paused:0,blocked:.15,planned:0}[t.state] || 0), 0);
  const percent = Math.round(weighted / data.tasks.length * 100);
  const ring = document.querySelector('#progress-ring');
  ring.style.setProperty('--progress', `${percent}%`);
  document.querySelector('#progress-value').textContent = `${percent}%`;
  document.querySelector('#completed-tasks').textContent = `${done} / ${data.tasks.length}`;

  document.querySelector('#metric-grid').innerHTML = data.metrics.map(m => `
    <article class="metric-card"><span class="metric-label">${m.label}</span><strong>${m.value}</strong><p>${m.note}</p></article>
  `).join('');

  const max = Math.max(...Object.values(data.countries));
  document.querySelector('#country-bars').innerHTML = Object.entries(data.countries).map(([name,value]) => `
    <div class="country-row"><span>${name}</span><div class="bar-track"><div class="bar-fill" style="width:${value/max*100}%"></div></div><b>${value}</b></div>
  `).join('');

  document.querySelector('#task-list').innerHTML = data.tasks.map((t,i) => `
    <article class="task" data-state="${t.state}">
      <div class="task-index">${String(i+1).padStart(2,'0')}</div>
      <div><h3>${t.title}</h3><p>${t.detail}</p></div>
      <span class="task-status">${statusLabel[t.state]}</span>
    </article>
  `).join('');

  document.querySelector('#audit-grid').innerHTML = data.audit.map(a => `
    <article class="audit-card ${a.level}"><div class="audit-icon">${a.level === 'pass' ? '✓' : '!'}</div><h3>${a.title}</h3><p>${a.detail}</p></article>
  `).join('');

  document.querySelector('#blocker-list').innerHTML = data.blockers.length ? data.blockers.map(b => `
    <article class="blocker"><span class="blocker-dot"></span><div><h3>${b.title}</h3><p>${b.detail}</p></div>${b.action ? `<code>${b.action}</code>` : ''}</article>
  `).join('') : '<p>当前没有阻塞项。</p>';
}

document.addEventListener('click', event => {
  const button = event.target.closest('.filter');
  if (!button) return;
  document.querySelectorAll('.filter').forEach(el => el.classList.toggle('active', el === button));
  document.querySelectorAll('.task').forEach(task => {
    task.hidden = button.dataset.filter !== 'all' && task.dataset.state !== button.dataset.filter;
  });
});

loadProgress().then(render).catch(error => {
  document.querySelector('#current-focus').textContent = `进度文件读取失败：${error.message}`;
});
