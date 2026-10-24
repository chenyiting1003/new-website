class ResearchMapCanvas {
  constructor(container, select) {
    this.container=container; this.select=select; this.points=[]; this.center={lat:16,lon:100}; this.zoom=5; this.tileCache=new Map(); this.buttons=new Map();
    this.tiles=document.createElement('div');this.tiles.className='map-tile-pane';
    this.markers=document.createElement('div');this.markers.className='map-marker-pane';container.append(this.tiles,this.markers);
    const nav=document.createElement('div');nav.className='map-controls';
    nav.innerHTML='<button type="button" aria-label="放大地图">+</button><button type="button" aria-label="缩小地图">−</button><button type="button" aria-label="缩放至筛选结果">⌂</button>';
    nav.children[0].onclick=()=>this.setZoom(this.zoom+1);nav.children[1].onclick=()=>this.setZoom(this.zoom-1);nav.children[2].onclick=()=>this.fit();
    const credit=document.createElement('div');credit.className='map-attribution';credit.innerHTML='© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>';
    container.append(nav,credit);
    container.addEventListener('pointerdown',e=>{if(e.target.closest('button,a'))return;this.drag={x:e.clientX,y:e.clientY,center:this.project(this.center.lat,this.center.lon)};container.setPointerCapture(e.pointerId);});
    container.addEventListener('pointermove',e=>{if(!this.drag)return;this.center=this.unproject(this.drag.center.x-e.clientX+this.drag.x,this.drag.center.y-e.clientY+this.drag.y);this.render();});
    for(const t of ['pointerup','pointercancel','lostpointercapture'])container.addEventListener(t,()=>this.drag=null);
    container.addEventListener('wheel',e=>{e.preventDefault();this.setZoom(this.zoom+(e.deltaY<0?1:-1));},{passive:false});
    new ResizeObserver(()=>this.render()).observe(container);
  }
  project(lat,lon,z=this.zoom){const size=256*2**z,sin=Math.sin(Math.max(-85,Math.min(85,lat))*Math.PI/180);return {x:(lon+180)/360*size,y:(.5-Math.log((1+sin)/(1-sin))/(4*Math.PI))*size};}
  unproject(x,y,z=this.zoom){const size=256*2**z;return {lon:x/size*360-180,lat:180/Math.PI*Math.atan(Math.sinh(Math.PI-2*Math.PI*y/size))};}
  setZoom(z){this.zoom=Math.min(18,Math.max(3,z));this.render();}
  focus(id){const p=this.points.find(p=>p.id===id);if(p){this.center={lat:p.lat,lon:p.lon};this.zoom=Math.max(12,this.zoom);this.render();}}
  fit(){if(!this.points.length)return;const ps=this.points.map(p=>this.project(p.lat,p.lon,0));const xs=ps.map(p=>p.x),ys=ps.map(p=>p.y);const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);let z=15;
    while(z>3&&((x1-x0)*2**z>this.container.clientWidth-90||(y1-y0)*2**z>this.container.clientHeight-90))z--;
    this.zoom=z;this.center=this.unproject((x0+x1)/2,(y0+y1)/2,0);this.render();}
  setPoints(points){this.points=points;const ids=new Set(points.map(p=>p.id));for(const [id,b] of this.buttons)if(!ids.has(id)){b.remove();this.buttons.delete(id);}
    for(const p of points){let b=this.buttons.get(p.id);if(!b){b=document.createElement('button');b.type='button';b.onclick=()=>this.select(p.id);this.markers.append(b);this.buttons.set(p.id,b);}b.className='site-marker '+p.state+(p.selected?' selected':'');b.textContent=p.glyph;b.style.background=p.color;b.style.width=b.style.height=p.size+'px';b.title=p.label;b.setAttribute('aria-label',p.label);}
    this.render();}
  render(){const w=this.container.clientWidth,h=this.container.clientHeight;if(!w||!h||!this.points.length){if(!this.points.length){this.tiles.replaceChildren();this.tileCache.clear();}return;}
    const c=this.project(this.center.lat,this.center.lon),left=c.x-w/2,top=c.y-h/2,count=2**this.zoom,used=new Set();
    for(let x=Math.floor(left/256);x<=Math.floor((left+w)/256);x++)for(let y=Math.max(0,Math.floor(top/256));y<=Math.min(count-1,Math.floor((top+h)/256));y++){
      const key=`${this.zoom}/${x}/${y}`;used.add(key);let img=this.tileCache.get(key);
      if(!img){img=document.createElement('img');img.className='map-tile';img.alt='';img.draggable=false;img.src=`https://tile.openstreetmap.org/${this.zoom}/${((x%count)+count)%count}/${y}.png`;this.tileCache.set(key,img);this.tiles.append(img);}
      img.style.left=x*256-left+'px';img.style.top=y*256-top+'px';}
    for(const [key,img] of this.tileCache)if(!used.has(key)){img.remove();this.tileCache.delete(key);}
    for(const p of this.points){const xy=this.project(p.lat,p.lon),b=this.buttons.get(p.id);b.style.left=xy.x-left+'px';b.style.top=xy.y-top+'px';}
  }
}
