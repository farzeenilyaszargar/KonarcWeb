const stage = document.getElementById('stage');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
for (const trigger of document.querySelectorAll('[data-open]')) {
  trigger.addEventListener('click', () => document.getElementById(trigger.dataset.open).showModal());
}
function openHashDialog() { const id = location.hash.slice(1); if (id === 'about' || id === 'preorder') { const dialog = document.getElementById(id); if (!dialog.open) dialog.showModal(); } }
window.addEventListener('hashchange', openHashDialog);
openHashDialog();
for (const dialog of document.querySelectorAll('dialog')) {
  dialog.querySelectorAll('.close,[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
}
function showFallback() {
  document.body.classList.add('ready');
  document.getElementById('fallback').hidden = false;
  document.getElementById('interaction-hint').textContent = 'Product preview';
  document.getElementById('reset').hidden = true;
  stage.hidden = true;
}
try {
  const THREE = await import('./vendor/three.module.js');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.6;
  stage.appendChild(renderer.domElement);
  renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); showFallback(); });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 100);
  camera.position.set(0, 1.5, 9.5);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xdce7f3, 0x32303a, 2.4));
  function light(color, intensity, position) { const l = new THREE.DirectionalLight(color, intensity); l.position.set(...position); scene.add(l); }
  light(0xf8f4ea, 4, [-4, 5, 5]);
  light(0xc5def5, 3.8, [4, 2, -2]);
  light(0xffffff, 1.4, [1, -3, 4]);

  // A procedural industrial-design concept, not a manufacturing/CAD model.
  const brace = new THREE.Group();
  scene.add(brace);
  const textileCanvas = document.createElement('canvas');
  textileCanvas.width = textileCanvas.height = 256;
  const ctx = textileCanvas.getContext('2d');
  ctx.fillStyle = '#777'; ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 8) {
    for (let x = 0; x < 256; x += 6) {
      const offset = (y / 8 % 2) * 3;
      ctx.strokeStyle = '#b7b7b7'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x + offset, y); ctx.lineTo(x + offset + 2, y + 5); ctx.lineTo(x + offset + 4, y); ctx.stroke();
      ctx.strokeStyle = '#454545'; ctx.beginPath(); ctx.moveTo(x + offset + 1, y + 1); ctx.lineTo(x + offset + 2, y + 4); ctx.stroke();
    }
  }
  const knit = new THREE.CanvasTexture(textileCanvas);
  knit.wrapS = knit.wrapT = THREE.RepeatWrapping; knit.repeat.set(6, 7); knit.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const clothColor = knit.clone(); clothColor.colorSpace = THREE.SRGBColorSpace; clothColor.repeat.set(3,4);
  const fabric = new THREE.MeshStandardMaterial({ map: clothColor, color: 0x363b40, roughness: .93, metalness: .02, bumpMap: knit, bumpScale: .022, side: THREE.DoubleSide });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x171b1e, roughness: .65, metalness: .08 });
  const shell = new THREE.MeshStandardMaterial({ color: 0x30373d, roughness: .34, metalness: .66 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x9ca8ae, roughness: .25, metalness: .86 });
  const strapMaterial = new THREE.MeshStandardMaterial({ color: 0x161a1d, roughness: .88, bumpMap: knit, bumpScale: .012, side: THREE.DoubleSide });
  const seamMaterial = new THREE.MeshStandardMaterial({ color: 0x252c31, roughness: .9 });
  const profile = [[.51,-1.72],[.52,-1.6],[.55,-1.2],[.58,-.8],[.65,-.35],[.7,0],[.69,.35],[.7,.8],[.75,1.25],[.77,1.6],[.76,1.72]];
  const sleeve = new THREE.Mesh(new THREE.LatheGeometry(profile.map(([r,y]) => new THREE.Vector2(r,y)), 96), fabric);
  sleeve.scale.z = .86; brace.add(sleeve);
  const inner = new THREE.Mesh(new THREE.LatheGeometry(profile.map(([r,y]) => new THREE.Vector2(r-.035,y)), 96), rubber);
  inner.scale.z = .86; brace.add(inner);
  function radius(y) {
    for(let i=1;i<profile.length;i++) if(y<=profile[i][1]) { const [r0,y0]=profile[i-1]; const [r1,y1]=profile[i]; return THREE.MathUtils.lerp(r0,r1,(y-y0)/(y1-y0)); }
    return profile.at(-1)[0];
  }
  function tube(points, thickness, material, parent=brace) {
    const curve = new THREE.CatmullRomCurve3(points);
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(16,points.length*4), thickness, 6, false), material);
    parent.add(mesh); return mesh;
  }
  function ring(y,r,thickness,material) {
    const points=[]; for(let i=0;i<=96;i++) {const a=i/96*Math.PI*2;points.push(new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r*.86));}
    return tube(points,thickness,material);
  }
  ring(1.71,.755,.045,rubber);ring(-1.71,.505,.04,rubber);
  for(const y of [1.59,1.64,-1.6,-1.65]) ring(y,radius(y)+.008,.009,seamMaterial);
  for(const angle of [-.92,-.48,.48,.92,2.7,3.6]) {
    const points=[];for(let i=0;i<=40;i++){const y=-1.56+i/40*3.12;const r=radius(y)+.012;const a=angle+.055*Math.cos(y*2);points.push(new THREE.Vector3(Math.sin(a)*r,y,Math.cos(a)*r*.86));}tube(points,.008,seamMaterial);
  }
  // Four wraparound bands and their fastening plates.
  for(const y of [1.3,.86,-.92,-1.38]) {
    const half=.095;
    const mesh=new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(radius(y-half)+.035,y-half),new THREE.Vector2(radius(y+half)+.035,y+half)],96),strapMaterial);
    mesh.scale.z=.86;brace.add(mesh);
    for(const edge of [y-half,y+half]) ring(edge,radius(edge)+.038,.009,rubber);
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(.23,.25,.065),shell);
    buckle.position.set(.38,y,(radius(y)+.04)*.74);buckle.rotation.y=.5;brace.add(buckle);
    const tongue = new THREE.Mesh(new THREE.BoxGeometry(.15,.17,.075),rubber);tongue.position.copy(buckle.position);tongue.position.z+=.025;tongue.rotation.y=.5;brace.add(tongue);
  }
  function link(a,b,width,depth,material) {
    const direction=new THREE.Vector3().subVectors(b,a);
    const mesh=new THREE.Mesh(new THREE.CapsuleGeometry(width/2, Math.max(.01,direction.length()-width), 6, 12),material);
    mesh.scale.x=depth/width;
    mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize());brace.add(mesh);
  }
  function axle(x,y,z,r,depth,material){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,depth,48),material);mesh.rotation.z=Math.PI/2;mesh.position.set(x,y,z);brace.add(mesh);return mesh;}
  for(const side of [-1,1]) {
    const x=side*.76;
    const pivot=new THREE.Vector3(x,0,.04);
    for(const sign of [-1,1]) {
      const end=new THREE.Vector3(side*(sign>0?.79:.6),sign*1.39,.02);
      link(pivot,end,.24,.10,shell);
      axle(end.x,end.y,end.z,.12,.105,shell);
      const insetA=pivot.clone().lerp(end,.37),insetB=pivot.clone().lerp(end,.84);
      insetA.x+=side*.06;insetB.x+=side*.06;
      link(insetA,insetB,.115,.018,rubber);
      const spring=[];const center=insetA.clone().lerp(insetB,.5);
      for(let n=0;n<=160;n++){const t=n/160;const a=t*Math.PI*2*13; spring.push(new THREE.Vector3(center.x+Math.cos(a)*.028,center.y+(t-.5)*.28,center.z+Math.sin(a)*.033));}
      tube(spring,.008,steel);
      for(const t of [.25,.9]){const screw=pivot.clone().lerp(end,t);axle(screw.x+side*.07,screw.y,screw.z,.034,.018,steel);}
    }
    axle(x,0,.04,.205,.17,rubber);
    axle(x+side*.05,0,.04,.158,.14,shell);
    axle(x+side*.13,0,.04,.067,.025,steel);
    axle(x+side*.147,0,.04,.025,.015,rubber);
    const slot=new THREE.Mesh(new THREE.BoxGeometry(.012,.004,.043),steel);slot.position.set(x+side*.157,0,.04);brace.add(slot);
  }
  // A small woven front label.
  const labelCanvas=document.createElement('canvas');labelCanvas.width=512;labelCanvas.height=128;
  const lc=labelCanvas.getContext('2d');lc.fillStyle='#161a1d';lc.fillRect(0,0,512,128);lc.fillStyle='#aeb8bf';lc.font='500 39px Arial';lc.textAlign='center';lc.fillText('konarc',256,62);lc.fillStyle='#667078';lc.font='14px Arial';lc.fillText('D Y N A M I C S',256,94);
  const labelTexture=new THREE.CanvasTexture(labelCanvas);labelTexture.colorSpace=THREE.SRGBColorSpace;
  const label=new THREE.Mesh(new THREE.PlaneGeometry(.49,.123),new THREE.MeshStandardMaterial({map:labelTexture,roughness:1}));label.position.set(0,1.08,.635);label.rotation.x=-.07;brace.add(label);
  // Soft contact shadow, drawn as a lighting texture rather than product imagery.
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;
  const sc=shadowCanvas.getContext('2d'),gradient=sc.createRadialGradient(64,64,3,64,64,64);gradient.addColorStop(0,'rgba(0,0,0,.55)');gradient.addColorStop(1,'rgba(0,0,0,0)');sc.fillStyle=gradient;sc.fillRect(0,0,128,128);
  const shadow=new THREE.Mesh(new THREE.PlaneGeometry(3.4,1.1),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));shadow.position.set(0,-2.04,-.1);shadow.rotation.x=-.9;scene.add(shadow);

  let targetY=-.62,targetX=.12,currentY=targetY,currentX=targetX,dragging=false,lastX=0,lastY=0,interacted=false;
  function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.position.z=w/h<.7?11.8:w/h<1?10.7:9.3;camera.updateProjectionMatrix();brace.position.y=w<600?.15:0;}
  window.addEventListener('resize',resize);resize();
  stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;interacted=true;lastX=e.clientX;lastY=e.clientY;stage.setPointerCapture(e.pointerId);});
  stage.addEventListener('pointermove',e=>{if(!dragging)return;targetY+=(e.clientX-lastX)*.008;targetX=THREE.MathUtils.clamp(targetX+(e.clientY-lastY)*.004,-.45,.45);lastX=e.clientX;lastY=e.clientY;});
  function release(){dragging=false;}
  stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);stage.addEventListener('lostpointercapture',release);
  stage.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();interacted=true;if(e.key==='ArrowLeft')targetY-=.15;if(e.key==='ArrowRight')targetY+=.15;if(e.key==='ArrowUp')targetX=Math.max(-.45,targetX-.08);if(e.key==='ArrowDown')targetX=Math.min(.45,targetX+.08);if(e.key==='Home')reset();});
  function reset(){targetY=-.62;targetX=.12;interacted=false;}
  document.getElementById('reset').addEventListener('click',reset);
  let frame=0,start=performance.now();
  function render(now){
    const seconds=(now-start)/1000;
    const modalOpen=Boolean(document.querySelector('dialog[open]'));
    currentY=THREE.MathUtils.lerp(currentY,targetY,reducedMotion.matches?1:.09);currentX=THREE.MathUtils.lerp(currentX,targetX,reducedMotion.matches?1:.09);
    brace.rotation.set(currentX,currentY+(!interacted&&!reducedMotion.matches&&!modalOpen?Math.sin(seconds*.23)*.16:0),-.08);
    if(!reducedMotion.matches&&!modalOpen)brace.position.y=(stage.clientWidth<600?.15:0)+Math.sin(seconds*.8)*.035;
    renderer.render(scene,camera);
    document.body.classList.add('ready');
    frame=requestAnimationFrame(render);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(frame);else{cancelAnimationFrame(frame);frame=requestAnimationFrame(render);}});
  frame=requestAnimationFrame(render);
} catch(error) { console.error('Unable to start 3D preview:',error);showFallback(); }
