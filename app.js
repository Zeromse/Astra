(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const CYCLE = 29.53;
  const phases = [
    ['新月', 'NEW MOON'], ['娥眉月', 'WAXING CRESCENT'], ['上弦月', 'FIRST QUARTER'], ['盈凸月', 'WAXING GIBBOUS'],
    ['满月', 'FULL MOON'], ['亏凸月', 'WANING GIBBOUS'], ['下弦月', 'LAST QUARTER'], ['残月', 'WANING CRESCENT']
  ];
  const planets = [
    { id: 'mercury', name: '水星', en: 'MERCURY', short: '最靠近太阳的行星', description: '水星是太阳系中最靠近太阳的行星。在这张图中，从太阳向外寻找最内侧的运行轨迹。' },
    { id: 'venus', name: '金星', en: 'VENUS', short: '明亮的邻近行星', description: '金星位于水星轨道之外、地球轨道之内。它浓厚的大气使表面保持极高的温度。' },
    { id: 'earth', name: '地球', en: 'EARTH', short: '我们所在的蓝色星球', description: '地球是从太阳向外数的第三颗行星。月亮绕地球运行，而地球与月亮一起沿轨道绕太阳前行。' },
    { id: 'mars', name: '火星', en: 'MARS', short: '地球之外的红色邻居', description: '火星位于地球轨道之外。它表面的含铁矿物使这颗岩石行星呈现出独特的红色。' },
    { id: 'jupiter', name: '木星', en: 'JUPITER', short: '太阳系最大的行星', description: '木星是太阳系中体积最大的行星。这颗气态巨行星位于火星轨道之外，拥有醒目的云带。' },
    { id: 'saturn', name: '土星', en: 'SATURN', short: '拥有醒目光环的行星', description: '土星是一颗气态巨行星，以宽阔而明亮的环系著称。图中的双环符号帮助你辨认它的位置。' },
    { id: 'uranus', name: '天王星', en: 'URANUS', short: '倾侧旋转的冰巨星', description: '天王星是一颗冰巨星，自转轴有很大的倾角。它位于土星轨道之外，运行在太阳系外侧。' },
    { id: 'neptune', name: '海王星', en: 'NEPTUNE', short: '八大行星中最远的一颗', description: '海王星同样是一颗冰巨星。它是八大行星中距离太阳最远的一颗，轨道环绕在最外侧。' }
  ];
  const plates = [
    { id: 'moon', index: 'I', title: '月的盈亏', english: 'PHASES OF THE MOON', image: './assets/moon-phases.jpg', alt: '黑底金色月相图版，排列着太阳、地球、月亮与受光示意', description: '从新月到满月，沿着细密的轨迹，读懂月亮的明暗变化。', detail: '这幅图版把月相的循环、月球轨道及日月食的光影关系放在同一张画面里。圆环中的明暗月面与下方投射的阴影，共同呈现了早期天文图解的表达方式。月相变化来自观察角度；日月食则涉及天体遮挡，两者并不相同。', tags: ['月相周期', '光与影', '轨道图解'] },
    { id: 'orbits', index: 'II', title: '行星的轨迹', english: 'ORBITS OF THE PLANETS', image: './assets/planet-orbits.jpg', alt: '羊皮纸边框中的古典行星轨道图，外围绘有星座，中心是太阳与交叠轨道', description: '交织的轨道与环绕的星座，勾勒出一幅有序的宇宙图景。', detail: '太阳位于画面中央，多条倾斜的曲线交叠延伸，外围围绕着星座图像和文字。这张图版把行星、轨道与星空背景结合在一起，既是知识的图解，也保留了古典天文学独特的视觉语言。', tags: ['行星轨道', '太阳系', '星座图绘'] },
    { id: 'atlas', index: 'III', title: '天穹的秩序', english: 'AN ATLAS OF THE HEAVENS', image: './assets/celestial-atlas.jpg', alt: '黑白古典天文图集，包含四季公转、月相、黄道星座、经纬线和浑天仪', description: '四季、月相与天球坐标，在一张图谱里彼此呼应。', detail: '这张法文图集集纳了地球在四季中的位置、月相、黄道星座、经纬线、罗盘与浑天仪等主题。它像一张视觉目录，让我们从不同尺度观察同一个天空。网站中的四季交互，便从左上方的地球公转图获得灵感。', tags: ['四季更替', '天球坐标', '星空图集'] }
  ];
  const seasons = [
    { en: 'VERNAL EQUINOX', title: '春分 · 昼夜相近', description: '阳光直射赤道附近，全球大部分地区的白昼与黑夜长度接近。' },
    { en: 'SUMMER SOLSTICE', title: '夏至 · 长日当空', description: '北半球朝向太阳倾斜，在一年中迎来最长的白昼与最短的黑夜。' },
    { en: 'AUTUMNAL EQUINOX', title: '秋分 · 昼夜相近', description: '阳光再次直射赤道附近。北半球由夏入秋，白昼与黑夜的长度再次接近。' },
    { en: 'WINTER SOLSTICE', title: '冬至 · 长夜星明', description: '北半球背向太阳倾斜，在一年中迎来最短的白昼与最长的黑夜。' }
  ];
  let saved = new Set();
  try { const value = JSON.parse(localStorage.getItem('astra-saved-plates') || '[]'); if (Array.isArray(value)) saved = new Set(value.filter(id => plates.some(plate => plate.id === id))); } catch { /* Storage may be unavailable in private or file contexts. */ }
  let activeFilter = 'all', activePlanet = 'earth', activeTab = 'moon', dialogIndex = 0, toastTimer, playing = false, animationId = null, lastFrame = null;
  const diagrams = window.AtlasDiagrams;

  function announce(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2800); }
  function updateMoon(day) {
    const normalized = ((day % CYCLE) + CYCLE) % CYCLE;
    const fraction = normalized / CYCLE;
    const phase = fraction < .002 || fraction > .998 ? 0 : Math.abs(fraction - .25) < .002 ? 2 : Math.abs(fraction - .5) < .002 ? 4 : Math.abs(fraction - .75) < .002 ? 6 : fraction < .25 ? 1 : fraction < .5 ? 3 : fraction < .75 ? 5 : 7;
    const illumination = (1 - Math.cos(normalized / CYCLE * Math.PI * 2)) * 50;
    $('#large-moon').innerHTML = diagrams.moon(day, 240);
    $('#phase-name').textContent = $('#stage-phase').textContent = phases[phase][0];
    $('#stage-phase-en').textContent = phases[phase][1];
    $('#illumination').textContent = illumination.toFixed(1);
    $('#moon-age').textContent = day.toFixed(1);
    $('#moon-day').value = day;
    $('#moon-day').style.setProperty('--progress', `${day / CYCLE * 100}%`);
    $('#moon-day').setAttribute('aria-valuetext', `月龄 ${day.toFixed(1)} 天，${phases[phase][0]}，受光比例 ${illumination.toFixed(1)}%`);
    $$('#phase-presets button').forEach((button, index) => { button.classList.toggle('active', index === phase); button.setAttribute('aria-pressed', String(index === phase)); });
  }
  $('#phase-presets').innerHTML = phases.map(([name], index) => `<button data-phase="${index}" aria-label="选择${name}" aria-pressed="false">${diagrams.moon(index / 8 * CYCLE, 26)}<span>${name}</span></button>`).join('');
  function stopAnimation() { playing = false; cancelAnimationFrame(animationId); lastFrame = null; $('#moon-play').innerHTML = '<span aria-hidden="true">▷</span> 自动演示'; $('#moon-play').setAttribute('aria-pressed', 'false'); }
  function animate(time) {
    if (!playing) return;
    if (lastFrame !== null && time - lastFrame > 100) { const delta = Math.min((time - lastFrame) / 1000, .3); updateMoon((Number($('#moon-day').value) + delta * 1.6) % CYCLE); lastFrame = time; }
    if (lastFrame === null) lastFrame = time;
    animationId = requestAnimationFrame(animate);
  }
  $('#moon-play').addEventListener('click', () => { if (playing) return stopAnimation(); playing = true; $('#moon-play').innerHTML = '<span aria-hidden="true">Ⅱ</span> 暂停演示'; $('#moon-play').setAttribute('aria-pressed', 'true'); animationId = requestAnimationFrame(animate); });
  $('#moon-day').addEventListener('input', event => { stopAnimation(); updateMoon(Number(event.target.value)); });
  $('#phase-presets').addEventListener('click', event => { const button = event.target.closest('[data-phase]'); if (button) { stopAnimation(); updateMoon(Number(button.dataset.phase) / 8 * CYCLE); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopAnimation(); });
  updateMoon(10);

  function choosePlanet(id, restoreFocus = false, container = null) {
    const planet = planets.find(item => item.id === id); if (!planet) return;
    activePlanet = id;
    $('#hero-chart').innerHTML = diagrams.orbitChart(id);
    $('#detail-orbit-chart').innerHTML = diagrams.orbitChart(id);
    $('#hero-planet-en').textContent = `${planet.en} · ${String(planets.indexOf(planet) + 1).padStart(2, '0')}`;
    $('#hero-planet-name').replaceChildren(document.createTextNode(`${planet.name} `), Object.assign(document.createElement('span'), { textContent: planet.short }));
    $('#selected-planet-en').textContent = planet.en;
    $('#selected-planet-name').textContent = planet.name;
    $('#selected-planet-description').textContent = planet.description;
    $$('#planet-picker button').forEach(button => { button.classList.toggle('active', button.dataset.planet === id); button.setAttribute('aria-pressed', String(button.dataset.planet === id)); });
    if (restoreFocus && container) $(`[data-planet="${id}"]`, container)?.focus({ preventScroll: true });
  }
  $('#planet-picker').innerHTML = planets.map(planet => `<button data-planet="${planet.id}" aria-pressed="${planet.id === activePlanet}">${planet.name}</button>`).join('');
  ['#hero-chart', '#detail-orbit-chart', '#planet-picker'].forEach(selector => {
    const container = $(selector);
    container.addEventListener('click', event => { const target = event.target.closest('[data-planet]'); if (target) choosePlanet(target.dataset.planet); });
    if (selector !== '#planet-picker') container.addEventListener('keydown', event => { const target = event.target.closest('[data-planet]'); if (target && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); choosePlanet(target.dataset.planet, true, container); } });
  });
  choosePlanet('earth');

  function chooseSeason(index) {
    const season = seasons[index]; if (!season) return;
    $('#season-en').textContent = season.en; $('#season-title').textContent = season.title; $('#season-description').textContent = season.description;
    $$('.season-picker button').forEach(button => { const selected = Number(button.dataset.season) === index; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); });
    $$('#seasons-chart [data-season]').forEach(group => { const selected = Number(group.dataset.season) === index; group.style.opacity = selected ? '1' : '.45'; group.setAttribute('aria-pressed', String(selected)); });
  }
  $('#seasons-chart').innerHTML = diagrams.seasonsChart();
  $('#panel-seasons').addEventListener('click', event => { const button = event.target.closest('[data-season]'); if (button) chooseSeason(Number(button.dataset.season)); });
  $('#seasons-chart').addEventListener('keydown', event => { const target = event.target.closest('[data-season]'); if (target && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); chooseSeason(Number(target.dataset.season)); } });
  chooseSeason(0);
  function selectTab(name, focus = false) {
    activeTab = name; stopAnimation();
    $$('[role=tab]').forEach(tab => { const selected = tab.dataset.tab === name; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; if (selected && focus) tab.focus(); });
    $$('[role=tabpanel]').forEach(panel => { panel.hidden = panel.id !== `panel-${name}`; });
  }
  $$('[role=tab]').forEach(tab => {
    tab.addEventListener('click', () => selectTab(tab.dataset.tab));
    tab.addEventListener('keydown', event => { const tabs = $$('[role=tab]'); let index = tabs.indexOf(tab); if (event.key === 'ArrowRight') index = (index + 1) % tabs.length; else if (event.key === 'ArrowLeft') index = (index + tabs.length - 1) % tabs.length; else if (event.key === 'Home') index = 0; else if (event.key === 'End') index = tabs.length - 1; else return; event.preventDefault(); selectTab(tabs[index].dataset.tab, true); });
  });
  $('#hero-moon').addEventListener('click', () => { selectTab('moon'); $('#observatory').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); });

  function renderGallery(focusId) {
    const visible = plates.filter(plate => activeFilter === 'all' || (activeFilter === 'saved' ? saved.has(plate.id) : plate.id === activeFilter));
    $('#gallery-grid').innerHTML = visible.map(plate => `<article class="plate-card" data-category="${plate.id}"><button class="plate-image-button" data-open="${plate.id}" aria-label="查看${plate.title}完整图版"><img src="${plate.image}" alt="${plate.alt}" loading="lazy" width="420" height="320"><span class="plate-index">PLATE ${plate.index}</span><span class="image-open-hint" aria-hidden="true">↗</span></button><button class="save-plate ${saved.has(plate.id) ? 'saved' : ''}" data-save="${plate.id}" aria-label="${saved.has(plate.id) ? '取消收藏' : '收藏'}${plate.title}" aria-pressed="${saved.has(plate.id)}">${saved.has(plate.id) ? '★' : '☆'}</button><div class="plate-body"><span class="plate-category">${plate.english}</span><button class="plate-title" data-open="${plate.id}"><h3>${plate.title}</h3><span aria-hidden="true">↗</span></button><p>${plate.description}</p><div class="plate-tags">${plate.tags.map(tag => `<span>${tag}</span>`).join('')}</div></div></article>`).join('');
    $('#empty-state').hidden = visible.length !== 0;
    $('#saved-count').textContent = saved.size;
    $$('.filter-group button').forEach(button => { const selected = button.dataset.filter === activeFilter; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); });
    if (focusId) ($(`[data-save="${focusId}"]`) || $('.filter-group button[data-filter="saved"]')).focus({ preventScroll: true });
  }
  function toggleSave(id, returnFocus = false) {
    if (saved.has(id)) saved.delete(id); else saved.add(id);
    let persisted = true;
    try { localStorage.setItem('astra-saved-plates', JSON.stringify([...saved])); } catch { persisted = false; }
    renderGallery(returnFocus ? id : undefined); updateDialogSave();
    announce((saved.has(id) ? '已收藏这片星空' : '已取消收藏') + (persisted ? '' : ' · 仅在本次浏览中保留'));
  }
  $('.filter-group').addEventListener('click', event => { const button = event.target.closest('[data-filter]'); if (button) { activeFilter = button.dataset.filter; renderGallery(); } });
  $('#my-collection').addEventListener('click', () => { activeFilter = 'saved'; renderGallery(); $('#collection').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); });
  $('#reset-filter').addEventListener('click', () => { activeFilter = 'all'; renderGallery(); $('.filter-group button').focus({ preventScroll: true }); });
  $('#gallery-grid').addEventListener('click', event => { const save = event.target.closest('[data-save]'); if (save) { toggleSave(save.dataset.save, true); return; } const open = event.target.closest('[data-open]'); if (open) openPlate(plates.findIndex(plate => plate.id === open.dataset.open)); });
  renderGallery();
  const dialog = $('#plate-dialog');
  function updateDialogSave() { const isSaved = saved.has(plates[dialogIndex].id); $('#dialog-save').textContent = isSaved ? '★ 已收藏图版' : '☆ 收藏图版'; $('#dialog-save').setAttribute('aria-pressed', String(isSaved)); }
  function openPlate(index) {
    dialogIndex = (index + plates.length) % plates.length; const plate = plates[dialogIndex];
    $('#dialog-index').textContent = `PLATE ${plate.index} / THE CELESTIAL COLLECTION`;
    $('#dialog-image').src = plate.image; $('#dialog-image').alt = plate.alt;
    $('#dialog-en').textContent = plate.english; $('#dialog-title').textContent = plate.title; $('#dialog-description').textContent = plate.detail;
    $('#dialog-topics').innerHTML = plate.tags.map(tag => `<span>${tag}</span>`).join('');
    $('#dialog-page').textContent = `${String(dialogIndex + 1).padStart(2, '0')} / 03`;
    $('#dialog-image-wrap').classList.remove('zoomed'); $('#zoom-toggle').textContent = '⊕'; $('#zoom-toggle').setAttribute('aria-label', '放大图版'); $('#zoom-toggle').title = '放大图版';
    updateDialogSave(); stopAnimation(); if (!dialog.open) dialog.showModal(); dialog.scrollTop = 0;
  }
  $('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { const target = $(`[data-open="${plates[dialogIndex].id}"]`) || $('.filter-group button.active'); target?.focus({ preventScroll: true }); });
  $('#dialog-save').addEventListener('click', () => toggleSave(plates[dialogIndex].id));
  $('#previous-plate').addEventListener('click', () => openPlate(dialogIndex - 1));
  $('#next-plate').addEventListener('click', () => openPlate(dialogIndex + 1));
  $('#zoom-toggle').addEventListener('click', () => { const zoomed = $('#dialog-image-wrap').classList.toggle('zoomed'); $('#zoom-toggle').textContent = zoomed ? '⊖' : '⊕'; $('#zoom-toggle').setAttribute('aria-label', zoomed ? '缩小图版' : '放大图版'); $('#zoom-toggle').title = zoomed ? '缩小图版' : '放大图版'; });
  $('#dialog-image-wrap').addEventListener('click', () => { if ($('#dialog-image-wrap').classList.contains('zoomed')) $('#zoom-toggle').click(); });
  dialog.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') { event.preventDefault(); openPlate(dialogIndex - 1); } else if (event.key === 'ArrowRight') { event.preventDefault(); openPlate(dialogIndex + 1); } });
  $$('dialog').forEach(modal => modal.addEventListener('click', event => { if (event.target === modal) { const rect = modal.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close(); } }));
  $('#about-open').addEventListener('click', () => $('#about-dialog').showModal());
  $('#about-close').addEventListener('click', () => $('#about-dialog').close());

  const menu = $('.menu-toggle');
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? '关闭导航' : '打开导航'); $('#mobile-nav').hidden = !open; });
  $$('#mobile-nav a').forEach(link => link.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', '打开导航'); $('#mobile-nav').hidden = true; }));
  menu.addEventListener('keydown', event => { if (event.key === 'Escape') { menu.setAttribute('aria-expanded', 'false'); $('#mobile-nav').hidden = true; } });
  const intersection = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) $$('.nav-link').forEach(link => link.classList.toggle('active', link.getAttribute('href') === (entry.target.classList.contains('hero') ? '#main' : `#${entry.target.id}`))); }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  ['.hero', '#observatory', '#collection', '#about'].forEach(selector => intersection.observe($(selector)));
})();
