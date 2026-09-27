/* Celestial Atlas — original, interactive vector engravings. */
(function () {
  'use strict';
  let serial = 0;
  const GOLD = '#c5b379';
  const INK = '#191e16';
  const TAU = Math.PI * 2;
  const n = value => Number(value.toFixed(2));
  const uid = prefix => `${prefix}-${++serial}`;
  function seeded(seed) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
  function line(x1, y1, x2, y2, extra = '') { return `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" ${extra}/>`; }
  function star(x, y, r = 3) { return `<path d="M${n(x-r)} ${n(y)}h${n(r*2)}M${n(x)} ${n(y-r)}v${n(r*2)}"/>`; }
  function globe(x, y, radius, rotation = -23.5) {
    const id = uid('globe');
    return `<g transform="translate(${x} ${y}) rotate(${rotation})" stroke="${GOLD}" stroke-width=".65"><defs><clipPath id="${id}"><circle r="${radius}"/></clipPath></defs><circle r="${radius}" fill="${INK}"/><g fill="none" clip-path="url(#${id})"><ellipse ry="${radius}" rx="${radius*.32}"/><ellipse ry="${radius}" rx="${radius*.7}"/>${[-.65,-.32,0,.32,.65].map(v=>`<ellipse cy="${n(radius*v)}" rx="${n(radius*Math.sqrt(1-v*v))}" ry="${n(radius*.18)}"/>`).join('')}${line(0,-radius,0,radius)}</g>${line(0,-radius-9,0,radius+9,'stroke-opacity=".75"')}</g>`;
  }
  function sun(x, y, radius = 28) {
    const random = seeded(819);
    let rays = '';
    for (let i=0;i<112;i++) {
      const a=i/112*TAU, inner=radius*(.8+random()*.12), outer=radius*(1.08+random()*.5);
      rays+=line(x+Math.cos(a)*inner,y+Math.sin(a)*inner,x+Math.cos(a)*outer,y+Math.sin(a)*outer,`stroke-width="${i%3===0?'.9':'.45'}"`);
    }
    return `<g stroke="${GOLD}">${rays}<circle cx="${x}" cy="${y}" r="${radius*.84}" fill="${GOLD}" stroke="none"/><circle cx="${x}" cy="${y}" r="${radius*.74}" fill="none" stroke="${INK}" stroke-width=".7" opacity=".4"/></g>`;
  }
  function orbitChart(selected = 'earth') {
    const id=uid('orbit');
    const planets=[
      ['mercury','水星','MERCURY',71,33,-9,4.45,4],
      ['venus','金星','VENUS',102,47,-7,3.72,6],
      ['earth','地球','EARTH',137,63,-12,5.77,7],
      ['mars','火星','MARS',169,79,-5,2.59,5],
      ['jupiter','木星','JUPITER',205,103,3,.51,10],
      ['saturn','土星','SATURN',231,122,-9,3.74,8],
      ['uranus','天王星','URANUS',255,153,-19,1.68,6],
      ['neptune','海王星','NEPTUNE',274,180,12,4.16,6]
    ];
    const zodiac=['ARIES','TAURUS','GEMINI','CANCER','LEO','VIRGO','LIBRA','SCORPIUS','SAGITTARIUS','CAPRICORNUS','AQUARIUS','PISCES'];
    const glyphs=['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
    let ticks='',outer='',stars='';
    for(let i=0;i<180;i++) {
      const a=i/180*TAU, r=i%15===0?282:i%5===0?287:291;
      ticks+=line(340+Math.cos(a)*r,340+Math.sin(a)*r,340+Math.cos(a)*297,340+Math.sin(a)*297,`stroke-width="${i%5===0?.8:.45}" opacity="${i%5===0?.8:.45}"`);
    }
    zodiac.forEach((label,i)=>{
      const angle=i*30-75,a=angle*Math.PI/180;
      const x=340+Math.cos(a)*314,y=340+Math.sin(a)*314;
      const gx=340+Math.cos(a)*273,gy=340+Math.sin(a)*273;
      let rot=angle+90; if(angle>0&&angle<180)rot+=180;
      outer+=`<text x="${n(x)}" y="${n(y)}" transform="rotate(${rot} ${n(x)} ${n(y)})" text-anchor="middle" font-size="8" letter-spacing="1.8">${label}</text><text x="${n(gx)}" y="${n(gy+5)}" text-anchor="middle" font-size="19" opacity=".78">${glyphs[i]}</text>`;
      const b=(angle+15)*Math.PI/180;
      outer+=line(340+Math.cos(b)*260,340+Math.sin(b)*260,340+Math.cos(b)*303,340+Math.sin(b)*303,'opacity=".3" stroke-width=".65"');
    });
    const random=seeded(47);
    for(let i=0;i<124;i++) {
      const x=72+random()*536,y=72+random()*536,d=Math.hypot(x-340,y-340);
      if(d>245||d<48)continue;
      stars+=i%8===0?`<g opacity=".55">${star(x,y,1.8)}</g>`:`<circle cx="${n(x)}" cy="${n(y)}" r="${n(.35+random()*.65)}" fill="${GOLD}" stroke="none" opacity="${n(.16+random()*.38)}"/>`;
    }
    const orbits=planets.map(([key,, ,rx,ry,angle])=>`<ellipse cx="340" cy="340" rx="${rx}" ry="${ry}" transform="rotate(${angle} 340 340)" fill="none" stroke="${key===selected?'#ddd0a1':GOLD}" stroke-width="${key===selected?1.25:.7}" opacity="${key===selected?.95:.55}"/>`).join('');
    const points=planets.map(([key,zh,en,rx,ry,angle,t,radius])=>{
      const a=angle*Math.PI/180, dx=rx*Math.cos(t),dy=ry*Math.sin(t),x=340+dx*Math.cos(a)-dy*Math.sin(a),y=340+dx*Math.sin(a)+dy*Math.cos(a),active=key===selected;
      const textLeft=x>470,tx=x+(textLeft?-16:16),ty=y-12;
      return `<g class="planet-node ${active?'is-selected':''}" data-planet="${key}" role="button" tabindex="0" aria-label="选择${zh}" aria-pressed="${active}" style="cursor:pointer"><title>${zh} · ${en}</title><circle cx="${n(x)}" cy="${n(y)}" r="22" fill="transparent" stroke="none"/><circle class="planet-halo" cx="${n(x)}" cy="${n(y)}" r="${radius+7}" fill="none" stroke="${GOLD}" stroke-width=".7" opacity="${active?.8:.2}" ${active?'':'stroke-dasharray="1 3"'}/><circle cx="${n(x)}" cy="${n(y)}" r="${radius}" fill="${active?'#d2c38c':'#ac9d68'}" stroke="${INK}" stroke-width="1"/>${key==='saturn'?`<ellipse cx="${n(x)}" cy="${n(y)}" rx="17" ry="5" transform="rotate(-22 ${n(x)} ${n(y)})" fill="none" stroke="${GOLD}" stroke-width="1.5"/>`:''}${key==='earth'?`<path d="M${n(x-3)} ${n(y-5)}l4 1 1 3-3 2 1 4-3-1-1-4-2-1z" fill="${INK}" opacity=".7"/>`:''}<text class="planet-label" x="${n(tx)}" y="${n(ty)}" text-anchor="${textLeft?'end':'start'}" fill="${active?'#eee0ac':GOLD}" stroke="none" opacity="${active?1:.7}" font-size="${active?9:7}" letter-spacing="1.3">${en}</text></g>`;
    }).join('');
    return `<svg viewBox="0 0 680 680" xmlns="http://www.w3.org/2000/svg" aria-label="可交互的行星轨道图，选择行星以查看详情" class="atlas-orbit-svg"><defs><path id="${id}-title" d="M102 339A238 238 0 0 1 578 339"/></defs><g fill="none" stroke="${GOLD}"><circle cx="340" cy="340" r="329" stroke-width=".5" opacity=".3"/><circle cx="340" cy="340" r="324" stroke-width=".65" opacity=".45"/><circle cx="340" cy="340" r="303" stroke-width=".8" opacity=".7"/><circle cx="340" cy="340" r="297" stroke-width=".45" opacity=".65"/><circle cx="340" cy="340" r="260" stroke-width=".6" opacity=".45"/>${ticks}${line(340,10,340,670,'stroke-width=".5" stroke-dasharray="2 6" opacity=".2"')}${line(10,340,670,340,'stroke-width=".5" stroke-dasharray="2 6" opacity=".2"')}<g fill="${GOLD}" stroke="none" font-family="Georgia, serif">${outer}<text font-size="12" letter-spacing="4.3" fill="${GOLD}" opacity=".8"><textPath href="#${id}-title" startOffset="50%" text-anchor="middle">ORBITS OF THE PLANETS</textPath></text></g>${stars}<g opacity=".55" stroke-width=".6"><ellipse cx="340" cy="340" rx="273" ry="67" transform="rotate(-47 340 340)" stroke-dasharray="2 4"/><ellipse cx="340" cy="340" rx="258" ry="58" transform="rotate(39 340 340)" stroke-dasharray="1 4"/></g>${orbits}${sun(340,340,28)}<g font-family="Georgia, serif">${points}</g><g opacity=".75" stroke-width=".75">${star(340,7,5)}${star(340,673,5)}${star(7,340,5)}${star(673,340,5)}</g><text x="340" y="552" text-anchor="middle" fill="${GOLD}" stroke="none" font-family="Georgia,serif" font-size="8" letter-spacing="3" opacity=".65">SOL · SYSTEMA MUNDI</text><text x="340" y="573" text-anchor="middle" fill="${GOLD}" stroke="none" font-size="8" letter-spacing="2" opacity=".5">示例轨道 · 非比例绘制</text></g></svg>`;
  }
  function moon(day=10,size=220) {
    const id=uid('moon'), validDay=Number.isFinite(Number(day))?Number(day):10, phase=((validDay%29.53)+29.53)%29.53/29.53,angle=phase*TAU,c=Math.cos(angle),waxing=phase<=.5,r=95,random=seeded(262);
    let surface='',points=[];
    for(let i=0;i<90;i++) {
      const x=10+random()*190,y=10+random()*190,cr=1.3+Math.pow(random(),2)*10;
      if(Math.hypot(x-110,y-110)>r-cr)continue;
      surface+=`<circle cx="${n(x)}" cy="${n(y)}" r="${n(cr)}" fill="#786e49" opacity="${n(.08+random()*.2)}"/><circle cx="${n(x-.5)}" cy="${n(y-.5)}" r="${n(cr)}" fill="none" stroke="#514d36" stroke-width="${n(.3+random()*.6)}" opacity=".4"/><path d="M${n(x-cr*.7)} ${n(y+cr*.45)}q${n(cr)} ${n(cr*.7)} ${n(cr*1.5)} ${n(-cr*.5)}" fill="none" stroke="#eee3b4" stroke-width=".6" opacity=".5"/>`;
    }
    for(let i=0;i<750;i++) {
      const x=15+random()*190,y=15+random()*190;
      if(Math.hypot(x-110,y-110)>95)continue;
      surface+=`<circle cx="${n(x)}" cy="${n(y)}" r="${n(.15+random()*.45)}" fill="${i%3?'#3b3c2d':'#f5e9bb'}" opacity="${n(.12+random()*.36)}"/>`;
    }
    for(let i=0;i<=100;i++) {
      const y=-r+2*r*i/100,edge=Math.sqrt(Math.max(0,r*r-y*y));
      points.push([110+(waxing?edge:-edge),110+y]);
    }
    for(let i=100;i>=0;i--) {
      const y=-r+2*r*i/100,edge=Math.sqrt(Math.max(0,r*r-y*y));
      points.push([110+(waxing?c*edge:-c*edge),110+y]);
    }
    const path=points.map((p,i)=>`${i?'L':'M'}${n(p[0])} ${n(p[1])}`).join('')+'Z';
    return `<svg viewBox="0 0 220 220" width="${Number(size)||220}" height="${Number(size)||220}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="月相示意，月龄 ${n(((validDay%29.53)+29.53)%29.53)} 天"><defs><clipPath id="${id}-disc"><circle cx="110" cy="110" r="95"/></clipPath><clipPath id="${id}-light"><path d="${path}"/></clipPath><radialGradient id="${id}-base" cx="37%" cy="35%" r="75%"><stop stop-color="#d5c58b"/><stop offset=".75" stop-color="#b6a56f"/><stop offset="1" stop-color="#746b45"/></radialGradient><g id="${id}-surface"><circle cx="110" cy="110" r="95" fill="url(#${id}-base)"/>${surface}</g></defs><circle cx="110" cy="110" r="95.6" fill="#242b1f" stroke="${GOLD}" stroke-width=".6" stroke-opacity=".45"/><g clip-path="url(#${id}-disc)"><use href="#${id}-surface" opacity=".1"/><g clip-path="url(#${id}-light)"><use href="#${id}-surface"/></g></g></svg>`;
  }
  function seasonsChart() {
    const labels=[['春分','VERNAL EQUINOX',340,115],['夏至','SUMMER SOLSTICE',115,340],['秋分','AUTUMNAL EQUINOX',340,565],['冬至','WINTER SOLSTICE',565,340]];
    let ticks='';
    for(let i=0;i<96;i++){const a=i/96*TAU;ticks+=line(340+Math.cos(a)*247,340+Math.sin(a)*247,340+Math.cos(a)*(i%8===0?257:252),340+Math.sin(a)*(i%8===0?257:252),'opacity=".4"');}
    return `<svg viewBox="0 0 680 680" xmlns="http://www.w3.org/2000/svg" aria-label="地球四季示意，可选择春分、夏至、秋分或冬至"><g stroke="${GOLD}" fill="none" stroke-width=".8"><circle cx="340" cy="340" r="225"/><circle cx="340" cy="340" r="240" opacity=".2"/>${ticks}${line(165,340,515,340,'stroke-dasharray="2 6" opacity=".3"')}${line(340,165,340,515,'stroke-dasharray="2 6" opacity=".3"')}${sun(340,340,40)}<text x="340" y="418" text-anchor="middle" stroke="none" fill="${GOLD}" font-family="Georgia,serif" font-size="11" letter-spacing="4">THE SUN</text>${labels.map(([cn,en,x,y],i)=>`<g data-season="${i}" role="button" tabindex="0" aria-label="选择${cn}" aria-pressed="${i===0}" style="cursor:pointer"><circle cx="${x}" cy="${y}" r="50" fill="${INK}" stroke="none"/>${globe(x,y,32)}<text x="${x}" y="${y+65}" text-anchor="middle" stroke="none" fill="${GOLD}" font-size="17" letter-spacing="4">${cn}</text><text x="${x}" y="${y+86}" text-anchor="middle" stroke="none" fill="${GOLD}" font-family="Georgia,serif" font-size="7.5" letter-spacing="1.1">${en}</text></g>`).join('')}<path d="M185 173l-8 19 20-6M477 509l8-19-20 6" opacity=".7"/><text x="340" y="666" text-anchor="middle" stroke="none" fill="${GOLD}" font-size="10" letter-spacing="2" opacity=".6">北半球四季示意 · 非比例绘制</text></g></svg>`;
  }
  window.AtlasDiagrams = { orbitChart, moon, seasonsChart };
})();
