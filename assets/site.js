// 博瑞伦特 H5 首页交互：开屏 / Hero 轮换 / 抽屉 / 轮播 / 滚动显现 / 数字滚动 / 表单
(function(){
  "use strict";

  /* ---- 开屏百分比 ---- */
  var pre = document.getElementById('preloader'),
      pct = document.getElementById('prePct'),
      fill = document.getElementById('preBarFill'),
      n = 0;
  var timer = setInterval(function(){
    n += Math.floor(Math.random()*14)+6;
    if(n >= 100){ n = 100; clearInterval(timer);
      setTimeout(function(){ pre.classList.add('done'); document.body.classList.add('loaded'); }, 350);
    }
    pct.textContent = n + '%';
    fill.style.width = n + '%';
  }, 120);

  /* ---- 抽屉菜单 ---- */
  var burger = document.getElementById('burger'),
      drawer = document.getElementById('drawer'),
      mask = document.getElementById('drawerMask'),
      closeBtn = document.getElementById('drawerClose');
  function openDrawer(){ drawer.classList.add('open'); mask.classList.add('open'); }
  function closeDrawer(){ drawer.classList.remove('open'); mask.classList.remove('open'); }
  burger.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  mask.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeDrawer); });

  /* ---- Hero 标题轮换 ---- */
  var titles = [
    '智能体 × 内容生产<br>赋能业务增长',
    'AI 落地找<br>博瑞伦特',
    '让 AI 融入业务<br>让能力持续生长'
  ];
  var heroTitle = document.getElementById('heroTitle'),
      pills = Array.prototype.slice.call(document.querySelectorAll('.hpill')),
      cur = 0, auto;
  function go(i){
    cur = (i + titles.length) % titles.length;
    heroTitle.style.opacity = 0;
    setTimeout(function(){
      heroTitle.innerHTML = titles[cur];
      heroTitle.style.opacity = 1;
    }, 220);
    pills.forEach(function(p, k){ p.classList.toggle('active', k === cur); });
    var act = pills[cur];
    act.scrollIntoView({block:'nearest', inline:'center', behavior:'smooth'});
  }
  heroTitle.style.transition = 'opacity .22s';
  function startAuto(){ auto = setInterval(function(){ go(cur+1); }, 4200); }
  function resetAuto(){ clearInterval(auto); startAuto(); }
  pills.forEach(function(p, k){
    p.addEventListener('click', function(){ go(k); resetAuto(); });
  });
  startAuto();

  /* ---- 通用轮播 ---- */
  function initCarousel(id){
    var root = document.getElementById(id);
    if(!root) return;
    var track = root.querySelector('.car-track'),
        cards = track.children.length,
        ind = root.querySelector('.car-ind'),
        prev = root.querySelector('.car-prev'),
        next = root.querySelector('.car-next');
    function idx(){
      var w = track.children[0].getBoundingClientRect().width + 14;
      return Math.min(cards-1, Math.max(0, Math.round(track.scrollLeft / w)));
    }
    function update(){ ind.textContent = (idx()+1) + ' / ' + cards; }
    function slide(d){
      var w = track.children[0].getBoundingClientRect().width + 14;
      track.scrollBy({left: d * w, behavior:'smooth'});
    }
    prev.addEventListener('click', function(){ slide(-1); });
    next.addEventListener('click', function(){ slide(1); });
    var t;
    track.addEventListener('scroll', function(){
      clearTimeout(t); t = setTimeout(update, 120);
    }, {passive:true});
    /* 触摸滑动手感增强 */
    var sx = 0;
    track.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; }, {passive:true});
    update();
  }
  initCarousel('whyCarousel');
  initCarousel('caseCarousel');

  /* ---- 滚动显现 ---- */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold: .12});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ---- 数字滚动 ---- */
  var cio = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      cio.unobserve(e.target);
      var el = e.target, target = +el.dataset.n, t0 = null;
      function step(ts){
        if(!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / 1200),
            v = Math.floor(target * (1 - Math.pow(1-p, 3)));
        el.textContent = v;
        if(p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, {threshold:.5});
  document.querySelectorAll('.count').forEach(function(el){ cio.observe(el); });

  /* ---- 回到顶部 ---- */
  var fabTop = document.getElementById('fabTop');
  window.addEventListener('scroll', function(){
    fabTop.classList.toggle('show', window.scrollY > 600);
  }, {passive:true});
  fabTop.addEventListener('click', function(){
    window.scrollTo({top:0, behavior:'smooth'});
  });

  /* ---- 表单 ---- */
  var form = document.getElementById('contactForm'),
      ok = document.getElementById('formOk');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    ok.hidden = false;
    form.querySelector('button[type=submit]').textContent = '已提交';
    ok.scrollIntoView({block:'center', behavior:'smooth'});
  });
})();
