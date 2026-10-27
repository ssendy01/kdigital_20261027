(function(){
  'use strict';

  /* =========================================================
     ANALYTICS STUB
     실제 분석 도구(GA4/GTM 등)가 연결되지 않았으므로, 이벤트가
     실시간으로 수집된다고 주장하지 않습니다. window.__v4Events에
     순서대로 쌓이고 콘솔에 로그만 남기는 "연동 준비용 구조"입니다.
     실제 연동 시 이 함수 본문만 교체하면 됩니다.
     ========================================================= */
  window.__v4Events = window.__v4Events || [];
  function trackEvent(name, detail){
    var payload = {event:name, detail:detail||{}, at:new Date().toISOString()};
    window.__v4Events.push(payload);
    if(window.console && console.debug){ console.debug('[v4-event:stub]', payload); }
  }
  window.v4Track = trackEvent; // exposed for inline/manual testing

  /* =========================================================
     MOBILE MENU
     ========================================================= */
  var menuBtn = document.getElementById('v4MenuBtn');
  var mobileMenu = document.getElementById('v4MobileMenu');
  if(menuBtn && mobileMenu){
    menuBtn.addEventListener('click', function(){
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ mobileMenu.classList.remove('open'); });
    });
  }

  /* =========================================================
     HERO / FINAL CTA event wiring
     ========================================================= */
  document.querySelectorAll('[data-event="hero_cta_click"]').forEach(function(el){
    el.addEventListener('click', function(){ trackEvent('hero_cta_click', {label: el.textContent.trim()}); });
  });
  document.querySelectorAll('[data-event="benefit_course_click"]').forEach(function(el){
    el.addEventListener('click', function(){ trackEvent('benefit_course_click', {label: el.textContent.trim()}); });
  });
  document.querySelectorAll('[data-event="support_info_click"]').forEach(function(el){
    el.addEventListener('click', function(){ trackEvent('support_info_click', {label: el.textContent.trim()}); });
  });
  document.querySelectorAll('[data-event="application_guide_click"]').forEach(function(el){
    el.addEventListener('click', function(){ trackEvent('application_guide_click', {label: el.textContent.trim()}); });
  });

  /* =========================================================
     shared course data (single source of truth, matches the 9 cards in SECTION 09)
     ========================================================= */
  var COURSES = {
    mobility:  {name:'미래모빌리티 자율주행의 이해와 실습',        type:'physical', meta:'41h · 496,000원'},
    print3d:   {name:'3D프린팅 실무와 시제품제작(Fusion)',         type:'physical', meta:'41h · 496,000원'},
    robotArm:  {name:'AI 로봇팔로 배우는 협동로봇 제어 원리',       type:'physical', meta:'41h · 496,000원'},
    webAI:     {name:'AI로 완성하는 홈페이지',                     type:'practical', meta:'20h · 242,000원'},
    pptAI:     {name:'AI로 쉽게 만드는 PPT 끝판왕',                type:'practical', meta:'16h · 193,600원'},
    drone:     {name:'파이썬으로 제어하는 AI드론',                 type:'physical', meta:'시간·비용 확인 필요'},
    ev:        {name:'파이썬으로 제어하는 자율주행 전기차',         type:'physical', meta:'시간·비용 확인 필요'},
    automation:{name:'누구나 쉽게 배우는 AI 업무자동화 풀코스',     type:'practical', meta:'시간·비용 확인 필요'},
    aiBasic:   {name:'파이썬으로 배우는 딥러닝 & 인공지능 기초',    type:'basic', meta:'시간·비용 확인 필요'}
  };

  /* =========================================================
     SECTION 08 — INTEREST SELECTOR
     ========================================================= */
  var typeCards = document.querySelectorAll('.type-card');
  var resultBox = document.getElementById('selectorResult');
  var resultGrid = document.getElementById('selRecoGrid');
  var resultTitle = document.getElementById('selResultTitle');
  var goBtn = document.getElementById('selGoBtn');
  var resetLink = document.getElementById('selReset');

  function coursesOfType(type){
    return Object.keys(COURSES).filter(function(k){ return COURSES[k].type === type; });
  }

  function renderSelectorResult(type, label){
    var keys = coursesOfType(type);
    resultTitle.innerHTML = '<span>' + label + '</span>에 해당하는 실제 운영 과정이에요';
    resultGrid.innerHTML = keys.map(function(k){
      var c = COURSES[k];
      return '<div class="sel-reco-card"><div class="n">' + c.name + '</div><div class="m">' + c.meta + '</div></div>';
    }).join('');
    goBtn.setAttribute('data-type', type);
    resultBox.classList.add('show');
    trackEvent('interest_select', {type:type, label:label, matchedCount:keys.length});
  }

  typeCards.forEach(function(card){
    card.addEventListener('click', function(){
      typeCards.forEach(function(c){ c.classList.remove('on'); });
      card.classList.add('on');
      renderSelectorResult(card.getAttribute('data-type'), card.getAttribute('data-label'));
    });
  });

  if(resetLink){
    resetLink.addEventListener('click', function(){
      typeCards.forEach(function(c){ c.classList.remove('on'); });
      resultBox.classList.remove('show');
    });
  }

  if(goBtn){
    goBtn.addEventListener('click', function(e){
      e.preventDefault();
      var type = goBtn.getAttribute('data-type');
      applyFilter(type || 'all');
      document.getElementById('courses').scrollIntoView({behavior:'smooth'});
    });
  }

  /* =========================================================
     SECTION 09 — COURSE SHOWCASE FILTER
     ========================================================= */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var courseCards = document.querySelectorAll('#courseGrid .course-card');
  var countEl = document.getElementById('filterCount');
  var emptyEl = document.getElementById('emptyState');

  window.applyFilter = function applyFilter(f){
    filterBtns.forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-filter') === f); });
    var shown = 0;
    courseCards.forEach(function(card){
      var match = (f === 'all')
        ? true
        : (f === 'kit' ? card.getAttribute('data-kit') === 'true' : card.getAttribute('data-cat') === f);
      card.classList.toggle('is-hidden', !match);
      if(match) shown++;
    });
    countEl.innerHTML = '전체 ' + courseCards.length + '개 과정 중 <b>' + shown + '개</b> 표시 중';
    emptyEl.classList.toggle('show', shown === 0);
  };

  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){ applyFilter(btn.getAttribute('data-filter')); });
  });

  var resetFromEmpty = document.getElementById('resetFromEmpty');
  if(resetFromEmpty){
    resetFromEmpty.addEventListener('click', function(){ applyFilter('all'); });
  }

  applyFilter('all');

  // course detail CTA click tracking (pending links still log intent)
  document.querySelectorAll('.course-cta').forEach(function(el){
    el.addEventListener('click', function(){
      var card = el.closest('.course-card');
      var name = card ? card.querySelector('.course-name').textContent.trim() : '';
      trackEvent('course_detail_click', {course:name, pending: el.classList.contains('pending')});
    });
  });

  /* =========================================================
     SECTION 05 — "실습 교구 제공 과정 보기" CTA → kit filter
     ========================================================= */
  var kitCta = document.getElementById('kitFilterCta');
  if(kitCta){
    kitCta.addEventListener('click', function(e){
      e.preventDefault();
      applyFilter('kit');
      document.getElementById('courses').scrollIntoView({behavior:'smooth'});
      trackEvent('benefit_course_click', {label:'실습 교구 제공 과정 보기'});
    });
  }

  /* =========================================================
     SECTION 12 — FINAL CTA → back to interest selector
     ========================================================= */
  var finalCta = document.getElementById('finalCta');
  if(finalCta){
    finalCta.addEventListener('click', function(e){
      e.preventDefault();
      document.getElementById('selector').scrollIntoView({behavior:'smooth'});
      trackEvent('hero_cta_click', {label:'내 교육과정 선택하기 (final)'});
    });
  }
})();
