(function(root) {
  const meta = {
    unknown: ['时间证据不足', '·', '#858b91'],
    formal: ['已有用途／牌照背景', '前', '#08736d'],
    change: ['本年空间／运营变化', '变', '#c0952c'],
    transition: ['本年前置→涉诈时间链', '链', '#d76a25'],
    relocation: ['本年搬迁／撤离报告', '移', '#7353a6'],
    illicit: ['截至本年已有涉诈报告', '报', '#ca4436']
  };
  const year = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') ? Number(value.slice(0,4)) : null;
  function eligibleEvents(site, options={}) {
    return (site.events || []).filter(e => e.state_eligible && (options.attributed !== false || e.certainty === 'asserted') && (!options.origin || options.origin==='all' || e.origin===options.origin));
  }
  function isPrecursor(e) {
    return e.type==='past_use' || (e.type==='licence_or_registration' && ['licence_reported','registration_reported','permit_or_approval_reported'].includes(e.licence_status));
  }
  function stateFor(site, y, options={}) {
    const events=eligibleEvents(site,options), through=events.filter(e=>year(e.start)<=y);
    const now=through.filter(e=>year(e.start)===y);
    const illicit=through.filter(e=>e.dimension==='illicit_activity');
    const first=illicit.reduce((a,b)=>!a || b.start<a.start?b:a,null);
    const ordered=first && through.some(e=>isPrecursor(e) && e.end<first.start);
    if(now.some(e=>['location_change','relocation'].includes(e.type)))return 'relocation';
    if(first && year(first.start)===y && ordered)return 'transition';
    if(now.some(e=>['use_change','conversion_or_takeover','built_environment_change','construction_or_security_change','operational_change','closure_or_opening'].includes(e.type)))return 'change';
    if(first)return 'illicit';
    if(through.some(isPrecursor))return 'formal';
    return 'unknown';
  }
  function reportsFor(site,y,mode='cumulative') {
    return (site.articles||[]).filter(a=>year(a.published_date)!==null && (mode==='year'?year(a.published_date)===y:year(a.published_date)<=y));
  }
  function statsFor(site,y,mode='cumulative',context=false) {
    const reports=reportsFor(site,y,mode), ids=new Set(reports.map(a=>a.article_id));
    const desc=(site.descriptions||[]).filter(d=>ids.has(d.article_id) && (d.accepted || context));
    return {reports:new Set(reports.map(a=>a.dedup_group)).size, records:reports.length,
      sources:new Set(reports.map(a=>a.source)).size, languages:[...new Set(reports.map(a=>a.language))].sort(),
      dimensions:Object.fromEntries(['brutality','harm','scale','living_conditions'].map(k=>[k,desc.filter(d=>d.dimensions.includes(k)).length]))};
  }
  function validate(data) {
    if(data?.schema_version!=='2.0.0'||!Array.isArray(data.sites)||!data.summary)throw Error('请选择 research-map.json（研究数据版本 2.0）。');
    const ids=new Set();
    for(const s of data.sites){
      if(!s.site_id||ids.has(s.site_id))throw Error('地点 ID 缺失或重复。'); ids.add(s.site_id);
      if(!Number.isFinite(s.latitude)||!Number.isFinite(s.longitude)||Math.abs(s.latitude)>90||Math.abs(s.longitude)>180)throw Error('发现无效坐标，未载入。');
      for(const key of ['events','articles','descriptions','casinos'])if(!Array.isArray(s[key]))throw Error('数据缺少 '+key+'。');
      for(const e of s.events)if(e.state_eligible && (year(e.start)===null||year(e.end)===null||e.start>e.end||e.polarity!=='affirmed'||e.basis!=='explicit'||!e.entity_accepted))throw Error('时间证据未通过完整性校验。');
    }
    return data;
  }
  const api={meta,year,stateFor,statsFor,reportsFor,eligibleEvents,validate,isPrecursor};
  root.ResearchModel=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis==='undefined'?this:globalThis);
