const stateMeta = {
  unknown: {label: '未观察到有日期证据', glyph: '·'},
  formal: {label: '正规身份／前置状态', glyph: '正'},
  transition: {label: '本年转化或接管', glyph: '变'},
  relocation: {label: '本年搬迁或撤离', glyph: '移'},
  illicit: {label: '已有非法活动报告', glyph: '诈'}
};

const app = {
  map: null,
  sites: [],
  eventsBySite: new Map(),
  markers: new Map(),
  selectedId: null,
  playTimer: null,
  minYear: 2015,
  maxYear: 2026
};

const el = id => document.getElementById(id);

class LocalPointMap {
  constructor(container) {
    this.container = container;
    this.center = {lat: 14.2, lon: 102.7};
    this.zoom = 6;
    this.drag = null;
    this.tilePane = document.createElement('div');
    this.markerPane = document.createElement('div');
    this.tilePane.className = 'map-tile-pane';
    this.markerPane.className = 'map-marker-pane';
    container.append(this.tilePane, this.markerPane);
    this.addControls();
    this.bindEvents();
    new ResizeObserver(() => this.render()).observe(container);
    this.render();
  }

  addControls() {
    const controls = document.createElement('div');
    controls.className = 'map-controls';
    controls.innerHTML = '<button type="button" aria-label="放大地图">+</button><button type="button" aria-label="缩小地图">−</button>';
    controls.children[0].addEventListener('click', () => this.setZoom(this.zoom + 1));
    controls.children[1].addEventListener('click', () => this.setZoom(this.zoom - 1));
    const attribution = document.createElement('div');
    attribution.className = 'map-attribution';
    attribution.innerHTML = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>';
    this.container.append(controls, attribution);
  }

  bindEvents() {
    this.container.addEventListener('pointerdown', event => {
      if (event.target.closest('button, a')) return;
      this.drag = {x: event.clientX, y: event.clientY, center: this.project(this.center.lat, this.center.lon)};
      this.container.setPointerCapture(event.pointerId);
    });
    this.container.addEventListener('pointermove', event => {
      if (!this.drag) return;
      const dx = event.clientX - this.drag.x;
      const dy = event.clientY - this.drag.y;
      this.center = this.unproject(this.drag.center.x - dx, this.drag.center.y - dy);
      this.render();
    });
    const endDrag = () => { this.drag = null; };
    this.container.addEventListener('pointerup', endDrag);
    this.container.addEventListener('pointercancel', endDrag);
    this.container.addEventListener('wheel', event => {
      event.preventDefault();
      this.setZoom(this.zoom + (event.deltaY < 0 ? 1 : -1));
    }, {passive: false});
  }

  worldSize(zoom = this.zoom) { return 256 * 2 ** zoom; }

  project(lat, lon, zoom = this.zoom) {
    const size = this.worldSize(zoom);
    const limitedLat = Math.max(-85.0511, Math.min(85.0511, Number(lat)));
    const sin = Math.sin(limitedLat * Math.PI / 180);
    return {
      x: (Number(lon) + 180) / 360 * size,
      y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * size
    };
  }

  unproject(x, y, zoom = this.zoom) {
    const size = this.worldSize(zoom);
    const lon = x / size * 360 - 180;
    const n = Math.PI - 2 * Math.PI * y / size;
    return {lat: 180 / Math.PI * Math.atan(Math.sinh(n)), lon};
  }

  setZoom(value) {
    this.zoom = Math.max(4, Math.min(12, Math.round(value)));
    this.render();
  }

  fit(sites) {
    if (!sites.length) return;
    const pointsAtZero = sites.map(site => this.project(site.latitude, site.longitude, 0));
    const xs = pointsAtZero.map(point => point.x);
    const ys = pointsAtZero.map(point => point.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const width = Math.max(320, this.container.clientWidth) - 80;
    const height = Math.max(420, this.container.clientHeight) - 80;
    let zoom = 10;
    while (zoom > 4 && ((maxX - minX) * 2 ** zoom > width || (maxY - minY) * 2 ** zoom > height)) zoom -= 1;
    this.zoom = zoom;
    this.center = this.unproject((minX + maxX) / 2 * 2 ** zoom, (minY + maxY) / 2 * 2 ** zoom, zoom);
    this.render();
  }

  renderTiles(left, top, width, height) {
    const tileSize = 256;
    const count = 2 ** this.zoom;
    const minX = Math.floor(left / tileSize), maxX = Math.floor((left + width) / tileSize);
    const minY = Math.max(0, Math.floor(top / tileSize)), maxY = Math.min(count - 1, Math.floor((top + height) / tileSize));
    const fragment = document.createDocumentFragment();
    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) {
        const wrappedX = ((x % count) + count) % count;
        const image = document.createElement('img');
        image.className = 'map-tile';
        image.alt = '';
        image.draggable = false;
        image.src = `https://tile.openstreetmap.org/${this.zoom}/${wrappedX}/${y}.png`;
        image.style.left = `${x * tileSize - left}px`;
        image.style.top = `${y * tileSize - top}px`;
        fragment.append(image);
      }
    }
    this.tilePane.replaceChildren(fragment);
  }

  render() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (!width || !height) return;
    const center = this.project(this.center.lat, this.center.lon);
    const left = center.x - width / 2;
    const top = center.y - height / 2;
    this.renderTiles(left, top, width, height);
    app.sites.forEach(site => {
      const marker = app.markers.get(site.site_id);
      if (!marker || marker.hidden) return;
      const point = this.project(site.latitude, site.longitude);
      marker.style.left = `${point.x - left}px`;
      marker.style.top = `${point.y - top}px`;
    });
  }
}

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  const source = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (quoted) {
      if (char === '"' && source[i + 1] === '"') { field += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += char;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  const headers = rows.shift() || [];
  return rows.filter(values => values.some(Boolean)).map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])));
}

function yearOf(value) {
  const match = String(value || '').match(/^(20\d{2})/);
  return match ? Number(match[1]) : null;
}

function isTrue(value) { return String(value).toLowerCase() === 'true'; }

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function datedAffirmedEvents(siteId) {
  return (app.eventsBySite.get(siteId) || []).filter(event =>
    event.polarity === 'affirmed' && isTrue(event.included_in_affirmed_summary) && yearOf(event.event_date_start)
  );
}

function stateFor(site, year) {
  const events = datedAffirmedEvents(site.site_id);
  const throughYear = events.filter(event => yearOf(event.event_date_start) <= year);
  const thisYear = events.filter(event => yearOf(event.event_date_start) === year);
  const hasRelocationNow = thisYear.some(event => event.change_type === 'relocation_or_evacuation');
  const hasConversionNow = thisYear.some(event => event.change_type === 'use_conversion_or_takeover');
  const illicitYears = events.filter(event => event.evidence_dimension === 'illicit_activity').map(event => yearOf(event.event_date_start));
  const firstIllicit = illicitYears.length ? Math.min(...illicitYears) : null;
  const hasIllicit = firstIllicit !== null && firstIllicit <= year;
  const precursor = throughYear.some(event => ['previous_formal_use', 'licence_registration_approval'].includes(event.evidence_dimension));
  const transitionNow = hasIllicit && (hasConversionNow || (firstIllicit === year && precursor));
  if (hasRelocationNow) return 'relocation';
  if (transitionNow) return 'transition';
  if (hasIllicit) return 'illicit';
  if (precursor || throughYear.some(event => event.evidence_dimension === 'spatial_change')) return 'formal';
  return 'unknown';
}

function currentYear() { return Number(el('year-slider').value); }

function visibleSites() {
  const country = el('country-filter').value;
  const candidatesOnly = el('candidate-only').checked;
  return app.sites.filter(site => {
    const candidate = Number(site.total_selected_evidence_count || 0) > 0;
    return (!candidatesOnly || candidate) && (country === 'all' || site.country === country);
  });
}

function renderMap({fit = false} = {}) {
  const year = currentYear();
  const visible = visibleSites();
  const visibleIds = new Set(visible.map(site => site.site_id));
  let transitions = 0, relocations = 0;
  app.sites.forEach(site => {
    const marker = app.markers.get(site.site_id);
    if (!marker) return;
    marker.hidden = !visibleIds.has(site.site_id);
    if (marker.hidden) return;
    const state = stateFor(site, year);
    if (state === 'transition') transitions += 1;
    if (state === 'relocation') relocations += 1;
    marker.className = `site-marker ${state}`;
    marker.textContent = stateMeta[state].glyph;
    marker.setAttribute('aria-label', `${site.canonical_name}：${stateMeta[state].label}，${year}年`);
  });
  el('visible-count').textContent = visible.length;
  el('transition-count').textContent = transitions;
  el('relocation-count').textContent = relocations;
  el('year-output').textContent = year;
  if (app.selectedId) renderDetail(app.selectedId);
  if (fit) app.map.fit(visible);
  else app.map.render();
}

function dimensionLabel(event) {
  return ({
    previous_formal_use: '过去用途',
    licence_registration_approval: '牌照／注册／批准',
    spatial_change: '空间或运营变化',
    illicit_activity: '非法活动报告'
  })[event.evidence_dimension] || event.event_type || '事件';
}

function renderDetail(siteId) {
  const site = app.sites.find(item => item.site_id === siteId);
  if (!site) return;
  const year = currentYear();
  const state = stateFor(site, year);
  const events = (app.eventsBySite.get(siteId) || []).filter(event => {
    const eventYear = yearOf(event.event_date_start);
    return !eventYear || eventYear <= year;
  }).sort((a, b) => (yearOf(a.event_date_start) || 9999) - (yearOf(b.event_date_start) || 9999) || Number(a.sentence_index || 0) - Number(b.sentence_index || 0));
  const eventHtml = events.length ? events.map(event => {
    const date = event.event_date_start || '时间不明';
    const flags = [event.polarity !== 'affirmed' ? '否定／未确认' : '', event.certainty !== 'asserted' ? '转述／不确定' : ''].filter(Boolean).join(' · ');
    return `<article class="detail-event"><time>${escapeHtml(date)}</time><b>${escapeHtml(dimensionLabel(event))}${flags ? ` · ${escapeHtml(flags)}` : ''}</b><p>${escapeHtml(event.evidence_text)}</p>${event.profile_url ? `<a href="${escapeHtml(event.profile_url)}" target="_blank" rel="noreferrer">查看来源 ↗</a>` : ''}</article>`;
  }).join('') : '<p class="detail-note">截至该年没有可显示的证据。</p>';
  el('site-detail').innerHTML = `<div class="detail-head"><span class="detail-kicker">${escapeHtml(site.site_id)} · ${escapeHtml(site.country)}</span><h2>${escapeHtml(site.canonical_name)}</h2><p class="detail-meta">${escapeHtml(site.location_text || site.province)}</p><span class="detail-state ${state}">${escapeHtml(stateMeta[state].label)} · ${year}</span><p class="detail-note">证据链：${escapeHtml(site.evidence_chain_level || '未分类')} · 肯定证据 ${escapeHtml(site.affirmed_evidence_count || '0')} 条</p></div><div class="detail-events"><h3>截至 ${year} 年的证据</h3>${eventHtml}</div>`;
}

function installSites() {
  app.map.markerPane.replaceChildren();
  app.markers.clear();
  app.sites.forEach(site => {
    const lat = Number(site.latitude), lon = Number(site.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
    const marker = document.createElement('button');
    marker.type = 'button';
    marker.className = 'site-marker unknown';
    marker.textContent = '·';
    marker.addEventListener('click', () => { app.selectedId = site.site_id; renderDetail(site.site_id); });
    app.map.markerPane.append(marker);
    app.markers.set(site.site_id, marker);
  });
}

function configureControls() {
  const years = [...app.eventsBySite.values()].flat().map(event => yearOf(event.event_date_start)).filter(Boolean);
  app.minYear = years.length ? Math.min(...years) : 2015;
  app.maxYear = years.length ? Math.max(...years) : 2026;
  el('year-slider').min = app.minYear;
  el('year-slider').max = app.maxYear;
  el('year-slider').value = app.maxYear;
  el('year-min').textContent = app.minYear;
  el('year-max').textContent = app.maxYear;
  const countries = [...new Set(app.sites.map(site => site.country).filter(Boolean))].sort();
  el('country-filter').innerHTML = '<option value="all">全部</option>' + countries.map(country => `<option value="${escapeHtml(country)}">${escapeHtml(country)}</option>`).join('');
  ['year-slider', 'play-button', 'candidate-only', 'country-filter'].forEach(id => { el(id).disabled = false; });
}

async function loadFiles(files) {
  const parsed = await Promise.all([...files].map(async file => ({name: file.name, rows: parseCsv(await file.text())})));
  const summary = parsed.find(item => item.rows[0] && 'evidence_chain_level' in item.rows[0] && 'latitude' in item.rows[0]);
  const evidence = parsed.find(item => item.rows[0] && 'evidence_dimension' in item.rows[0] && 'evidence_text' in item.rows[0]);
  if (!summary || !evidence) throw new Error('未识别出地点汇总表和逐句证据表，请同时选择这两个文件。');
  app.sites = summary.rows;
  app.eventsBySite = new Map();
  evidence.rows.forEach(event => {
    if (!app.eventsBySite.has(event.site_id)) app.eventsBySite.set(event.site_id, []);
    app.eventsBySite.get(event.site_id).push(event);
  });
  installSites();
  configureControls();
  renderMap({fit: true});
  const candidateCount = app.sites.filter(site => Number(site.total_selected_evidence_count || 0) > 0).length;
  el('load-status').classList.remove('error');
  el('load-status').textContent = `已在本地载入 ${app.sites.length} 个地点、${evidence.rows.length} 条证据；其中 ${candidateCount} 个地点存在相关证据。`;
}

function stopPlayback() {
  if (app.playTimer) window.clearInterval(app.playTimer);
  app.playTimer = null;
  el('play-button').textContent = '播放';
  el('play-button').setAttribute('aria-pressed', 'false');
}

el('data-files').addEventListener('change', event => {
  stopPlayback();
  loadFiles(event.target.files).catch(error => {
    el('load-status').textContent = error.message;
    el('load-status').classList.add('error');
  });
});
el('year-slider').addEventListener('input', () => renderMap());
el('candidate-only').addEventListener('change', () => renderMap({fit: true}));
el('country-filter').addEventListener('change', () => renderMap({fit: true}));
el('play-button').addEventListener('click', () => {
  if (app.playTimer) { stopPlayback(); return; }
  if (currentYear() >= app.maxYear) el('year-slider').value = app.minYear;
  el('play-button').textContent = '暂停';
  el('play-button').setAttribute('aria-pressed', 'true');
  renderMap();
  app.playTimer = window.setInterval(() => {
    const next = currentYear() + 1;
    if (next > app.maxYear) { stopPlayback(); return; }
    el('year-slider').value = next;
    renderMap();
  }, 1100);
});

app.map = new LocalPointMap(el('map'));
