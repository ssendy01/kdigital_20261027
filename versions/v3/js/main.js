(function(){
  'use strict';

  // ---- shared course data (single source of truth, matches the 9 cards rendered in SECTION 07) ----
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
     SECTION 06 — INTEREST SELECTOR
     3 types only (no multi-question quiz, per PRD §SECTION 06)
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
     SECTION 07 — COURSE SHOWCASE FILTER
     filters: all / practical / physical / basic / kit
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

  /* =========================================================
     SECTION 04 — "실습 교구 제공 과정 보기" CTA → kit filter
     ========================================================= */
  var kitCta = document.getElementById('kitFilterCta');
  if(kitCta){
    kitCta.addEventListener('click', function(e){
      e.preventDefault();
      applyFilter('kit');
      document.getElementById('courses').scrollIntoView({behavior:'smooth'});
    });
  }

  /* =========================================================
     SECTION 09 — FINAL CTA → back to interest selector
     ========================================================= */
  var finalCta = document.getElementById('finalCta');
  if(finalCta){
    finalCta.addEventListener('click', function(e){
      e.preventDefault();
      document.getElementById('selector').scrollIntoView({behavior:'smooth'});
    });
  }
})();
