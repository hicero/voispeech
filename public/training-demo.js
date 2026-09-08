(()=>{
let demoActive=false,cancelled=false,currentId=null;const done=new Set();const favorites=new Set();const modules={};let step=0;const localRecords=[];let channel="공지";const localPosts=[];let dbRecords=[];let dbPosts=[];let lessonsCache=[];const COMMUNITY_PAGE=10;let communityPage=0;let communityHasMore=false;let communityTotal=0;let communityLoading=false;let communityShowLoading=false;let communityFetchSeq=0;const communityCache=new Map();let progressHydrated=false;
const FAV_KEY='voispeech_favorites';

function academy(){return document.getElementById('academy');}
const $=s=>{const root=academy();return root?root.querySelector(s):null;};
const all=s=>{const root=academy();return root?root.querySelectorAll(s):[];};
const tell=t=>{const el=$('#academy-status');if(el)el.textContent=t;};
const tab=name=>{all('[data-panel]').forEach(e=>e.hidden=e.dataset.panel!==name);all('nav [data-tab]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.tab===name)));};

function loadFavorites(){
  try{
    const raw=localStorage.getItem(FAV_KEY);
    if(!raw)return;
    const arr=JSON.parse(raw);
    if(Array.isArray(arr))arr.forEach(id=>{if(typeof id==='string'||typeof id==='number')favorites.add(String(id));});
  }catch(_){}
}
function saveFavorites(){
  try{localStorage.setItem(FAV_KEY,JSON.stringify([...favorites]));}catch(_){}
}
loadFavorites();

function applyProgressRows(rows){
  if(!Array.isArray(rows))return;
  rows.forEach(row=>{
    const id=String(row.lesson_id||'');
    if(!id)return;
    const steps=Array.isArray(row.completed_steps)?row.completed_steps:[];
    if(!modules[id])modules[id]=new Set();
    steps.forEach(n=>{const v=Number(n);if(Number.isFinite(v)&&v>=0)modules[id].add(Math.floor(v));});
    if(row.completed)done.add(id);
  });
}

async function refreshProgress(){
  const m=membership();
  const a=api();
  if(!(m.live&&m.loggedIn&&a&&typeof a.listProgress==='function'))return;
  try{
    const rows=await a.listProgress();
    applyProgressRows(rows);
    progressHydrated=true;
    update();
  }catch(_){
    /* keep local progress */
  }
}

async function persistProgress(lessonId){
  const m=membership();
  const a=api();
  if(!(m.live&&m.loggedIn&&a&&typeof a.saveProgress==='function'))return;
  const id=String(lessonId||'');
  if(!id)return;
  const steps=[...(modules[id]||new Set())].map(n=>Number(n)).filter(n=>Number.isFinite(n)&&n>=0);
  const completed=done.has(id);
  try{
    await a.saveProgress(id,steps,completed);
  }catch(_){
    /* non-blocking */
  }
}


function fallbackLessons(){
  return [
    {id:'1',sort_order:1,category:'기초',title:'연습을 시작하기 전에',description:'목표와 연습 환경을 정리하는 첫 시간',body:'',access:'free',storage_path:null,thumbnail_path:null,thumbnail_url:null,video_url:'/training-sample.mp4',duration_label:'미리보기',tag:'무료 미리보기',sessions:[]},
    {id:'2',sort_order:2,category:'SOVT',title:'빨대 발성, 연습의 출발점',description:'수업에서 배운 연습을 다시 확인하기',body:'',access:'subscribers',storage_path:null,thumbnail_path:null,thumbnail_url:null,video_url:'/training-sample.mp4',duration_label:'',tag:'구독 전용',sessions:[]},
    {id:'3',sort_order:3,category:'기초',title:'작은 소리에서 연결 찾기',description:'소리의 크기와 연결을 살펴보는 시간',body:'',access:'subscribers',storage_path:null,thumbnail_path:null,thumbnail_url:null,video_url:'/training-sample.mp4',duration_label:'',tag:'구독 전용',sessions:[]},
    {id:'4',sort_order:4,category:'노래 적용',title:'한 구절로 옮겨보기',description:'연습과 노래를 연결하는 과정',body:'',access:'subscribers',storage_path:null,thumbnail_path:null,thumbnail_url:null,video_url:'/training-sample.mp4',duration_label:'',tag:'구독 전용',sessions:[]},
  ];
}

function lessons(){
  const fromWindow=window.__VOISPEECH_LESSONS__;
  const loaded=window.__VOISPEECH_LESSONS_LOADED__===true;
  if(Array.isArray(fromWindow)&&(fromWindow.length>0||loaded)){
    lessonsCache=fromWindow.map(l=>{
      const sessions=Array.isArray(l.sessions)?l.sessions.map((s,i)=>({
        id:String(s.id),
        sort_order:Number(s.sort_order)!=null&&!Number.isNaN(Number(s.sort_order))?Number(s.sort_order):i,
        title:s.title||'',
        description:s.description||'',
        storage_path:s.storage_path||null,
        video_url:s.video_url||'/training-sample.mp4',
        duration_label:s.duration_label||'',
      })):[];
      return {
        id:String(l.id),
        sort_order:Number(l.sort_order)||0,
        category:l.category||'',
        title:l.title||'',
        description:l.description||'',
        body:l.body||'',
        access:l.access==='free'?'free':'subscribers',
        storage_path:l.storage_path||null,
        thumbnail_path:l.thumbnail_path||null,
        thumbnail_url:l.thumbnail_url||null,
        video_url:l.video_url||'/training-sample.mp4',
        duration_label:l.duration_label||'',
        tag:l.access==='free'?'무료 미리보기':(l.tag||'구독 전용'),
        sessions,
      };
    });
  }else if(!lessonsCache.length){
    lessonsCache=fallbackLessons();
  }
  return lessonsCache;
}


function lessonHasBaseVideo(lesson){
  if(!lesson)return false;
  const path=lesson.storage_path;
  if(typeof path==='string'&&path.trim())return true;
  const src=lesson.video_url||'';
  return Boolean(src&&src!=='/training-sample.mp4');
}

function lessonHasSessions(lesson){
  return !!(lesson&&Array.isArray(lesson.sessions)&&lesson.sessions.length>0);
}

function lessonIncludesBaseChip(lesson){
  return lessonHasSessions(lesson)&&lessonHasBaseVideo(lesson);
}

function lessonStepCount(lesson){
  if(lessonHasSessions(lesson)){
    const n=lesson.sessions.length;
    return lessonHasBaseVideo(lesson)?1+n:n;
  }
  return 1;
}

function lessonSessionTitles(lesson){
  if(!lessonHasSessions(lesson))return[];
  const sessionTitles=lesson.sessions.map(s=>s.title||'세션');
  if(lessonHasBaseVideo(lesson))return['강의',...sessionTitles];
  return sessionTitles;
}

function lessonVideoForStep(lesson,stepIndex){
  if(!lesson)return'/training-sample.mp4';
  if(lessonHasSessions(lesson)){
    if(lessonHasBaseVideo(lesson)){
      if(stepIndex<=0)return lesson.video_url||'/training-sample.mp4';
      const s=lesson.sessions[stepIndex-1]||lesson.sessions[0];
      return(s&&s.video_url)||'/training-sample.mp4';
    }
    const s=lesson.sessions[stepIndex]||lesson.sessions[0];
    return(s&&s.video_url)||'/training-sample.mp4';
  }
  return lesson.video_url||'/training-sample.mp4';
}

function lessonStepMeta(lesson,stepIndex){
  if(!lesson)return{kind:'base',label:'강의',duration_label:'',description:''};
  if(lessonHasSessions(lesson)){
    if(lessonHasBaseVideo(lesson)){
      if(stepIndex<=0){
        return{kind:'base',label:'강의',duration_label:lesson.duration_label||'',description:lesson.description||''};
      }
      const s=lesson.sessions[stepIndex-1]||lesson.sessions[0];
      return{kind:'session',label:(s&&s.title)||'세션',duration_label:(s&&s.duration_label)||'',description:(s&&s.description)||''};
    }
    const s=lesson.sessions[stepIndex]||lesson.sessions[0];
    return{kind:'session',label:(s&&s.title)||'세션',duration_label:(s&&s.duration_label)||'',description:(s&&s.description)||''};
  }
  return{kind:'base',label:'강의',duration_label:lesson.duration_label||'',description:lesson.description||''};
}

function lessonById(id){
  const sid=String(id);
  return lessons().find(l=>l.id===sid)||null;
}

function membership(){
  const root=academy();
  if(!root)return{live:false,loggedIn:false,active:demoActive};
  const auth=root.dataset.auth;
  if(auth==='anon'||auth==='user'){
    const v=window.__VOISPEECH__;
    const loggedIn=auth==='user';
    const active=!!(v&&v.active)||root.dataset.sub==='active';
    return{live:true,loggedIn,active};
  }
  return{live:false,loggedIn:false,active:demoActive};
}

function canWatchExclusive(){
  const m=membership();
  if(m.live)return m.active===true;
  return demoActive===true;
}

function canWatchLesson(lesson){
  if(!lesson)return false;
  if(lesson.access==='free')return true;
  return canWatchExclusive();
}

function goAccount(msg,intent){
  if(msg)tell(msg);
  try{
    sessionStorage.setItem('voispeech_login_next','/training/');
    if(intent)sessionStorage.setItem('voispeech_login_intent',intent);
    else sessionStorage.removeItem('voispeech_login_intent');
  }catch(_){}
  window.location.href='/account/';
}

function actions(){
  return window.__VOISPEECH_ACTIONS__||null;
}
function api(){
  return window.__VOISPEECH_API__||null;
}

function normalizeSearch(value){
  return String(value||'')
    .normalize('NFC')
    .toLowerCase()
    .replace(/\s+/g,' ')
    .trim();
}

function lessonSearchHaystack(lesson){
  return normalizeSearch([
    lesson.title,
    lesson.description,
    lesson.category,
    lesson.body,
    lesson.tag,
    lesson.duration_label,
  ].filter(Boolean).join(' '));
}

function escapeHtml(value){
  return String(value||'')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function escapeAttr(value){
  return escapeHtml(value).replace(/'/g,'&#39;');
}

function renderFilters(){
  const wrap=$('.academy-filters');
  if(!wrap)return;
  const pressed=$('[data-filter][aria-pressed="true"]');
  const current=pressed?pressed.dataset.filter:'전체';
  const cats=[];
  const seen=new Set();
  lessons().forEach(l=>{
    const c=(l.category||'').trim();
    if(c&&!seen.has(c)){seen.add(c);cats.push(c);}
  });
  const filters=['전체',...cats];
  const keep=filters.includes(current)?current:'전체';
  wrap.replaceChildren();
  filters.forEach(c=>{
    const b=document.createElement('button');
    b.dataset.filter=c;
    b.textContent=c;
    b.setAttribute('aria-pressed',String(c===keep));
    wrap.append(b);
  });
}

function renderLibrary(){
  const grid=$('.lesson-grid');
  if(!grid)return;
  const list=lessons();
  renderFilters();
  grid.replaceChildren();
  list.forEach((l,idx)=>{
    const thumb=l.thumbnail_url||'';
    const artClass=thumb
      ? 'lesson-art lesson-art-thumb'
      : `lesson-art lesson-art-${(idx%4)+1}`;
    const article=document.createElement('article');
    article.className='lesson-card';
    article.dataset.category=l.category;
    article.dataset.lessonId=l.id;
    article.dataset.search=lessonSearchHaystack(l);
    const steps=lessonStepCount(l);
    const artInner=thumb
      ? `<img class="lesson-thumb" src="${escapeAttr(thumb)}" alt="" loading="lazy"/><span class="lesson-art-overlay"><span>${escapeHtml(l.category)}</span><span class="lesson-play">▷</span></span>`
      : `<span>${escapeHtml(l.category)}</span><strong>${String(l.sort_order).padStart(2,'0')}</strong><span class="lesson-play">▷</span>`;
    article.innerHTML=`<button class="${artClass}" data-lesson="${escapeAttr(l.id)}" aria-label="${escapeAttr(l.title)} 열기">${artInner}</button><div class="lesson-copy"><span class="lesson-tag" data-access="${escapeAttr(l.id)}">${escapeHtml(l.tag)}</span><h3><button data-lesson="${escapeAttr(l.id)}">${escapeHtml(l.title)}</button></h3><p>${escapeHtml(l.description)}</p><button class="favorite-button" data-favorite="${escapeAttr(l.id)}" aria-pressed="false" aria-label="${escapeAttr(l.title)} 즐겨찾기">☆ 저장</button><span class="course-progress" data-progress="${escapeAttr(l.id)}">0 / ${steps}</span><span class="lesson-done" data-done="${escapeAttr(l.id)}" hidden>학습 완료 ✓</span></div>`;
    grid.append(article);
  });
  let empty=$('.library-empty');
  if(!empty){
    empty=document.createElement('p');
    empty.className='library-empty';
    empty.hidden=true;
    empty.textContent='검색 결과가 없습니다. 다른 키워드나 분류를 시도해 보세요.';
    grid.after(empty);
  }
  const featureTitle=$('.feature-lesson h2');
  const free=list.find(l=>l.access==='free')||list[0];
  if(featureTitle&&free){
    featureTitle.textContent=free.title;
    const featureBtn=$('.feature-lesson button[data-lesson], .feature-lesson .academy-light');
    if(featureBtn)featureBtn.dataset.lesson=free.id;
  }
  const completion=$('#completion-count');
  if(completion)completion.textContent=`${done.size} / ${list.length||4}`;
  filterCourses();
}

function update(){
  const root=academy();
  if(!root)return;
  const m=membership();
  const exclusive=canWatchExclusive();
  const list=lessons();
  updatePracticeStart();
  all('[data-progress]').forEach(e=>{const lesson=lessonById(e.dataset.progress);const total=lessonStepCount(lesson);e.textContent=`${(modules[e.dataset.progress]||new Set()).size} / ${total}`;});
  all('[data-favorite]').forEach(e=>{const on=favorites.has(String(e.dataset.favorite));e.setAttribute('aria-pressed',String(on));e.textContent=on?'★ 저장됨':'☆ 저장';});
  const saved=$('#favorites-list');if(saved){saved.replaceChildren();if(!favorites.size)saved.textContent='저장한 코스가 없습니다.';favorites.forEach(id=>{const lesson=lessonById(id);const b=document.createElement('button');b.dataset.lesson=id;b.textContent=lesson?lesson.title:id;saved.append(b);});}
  const completion=$('#completion-count');if(completion)completion.textContent=`${done.size} / ${list.length||4}`;
  all('[data-access]').forEach(e=>{
    const lesson=lessonById(e.dataset.access);
    if(!lesson){e.textContent='구독 전용';return;}
    if(lesson.access==='free')e.textContent='무료 미리보기';
    else e.textContent=exclusive?'시청 가능':'구독 전용';
  });
  all('[data-done]').forEach(e=>e.hidden=!done.has(String(e.dataset.done)));
  const subState=$('#subscription-state');
  const subDetail=$('#subscription-detail');
  if(m.live){
    if(m.active){
      if(subState)subState.textContent='구독 중';
      if(subDetail)subDetail.textContent='실제 구독이 활성화되어 전용 예시 영상을 열 수 있습니다.';
      all('[data-action="subscribe"]').forEach(e=>e.textContent='내 구독 확인');
      const cancelBtn=$('[data-action="cancel"]');if(cancelBtn)cancelBtn.hidden=false;
      const expireBtn=$('[data-action="expire"]');if(expireBtn)expireBtn.hidden=false;
    }else{
      if(subState)subState.textContent=m.loggedIn?'구독 전':'로그인 필요';
      if(subDetail)subDetail.textContent=m.loggedIn
        ?'구독 체험을 시작하면 전용 영상이 열립니다. 실제 결제는 없습니다.'
        :'전용 영상을 열려면 먼저 로그인한 뒤 구독 체험을 시작하세요.';
      all('[data-action="subscribe"]').forEach(e=>e.textContent=m.loggedIn?'구독 체험하기 ↗':'로그인 후 구독 체험');
      const cancelBtn=$('[data-action="cancel"]');if(cancelBtn)cancelBtn.hidden=true;
      const expireBtn=$('[data-action="expire"]');if(expireBtn)expireBtn.hidden=true;
    }
  }else{
    if(subState)subState.textContent=demoActive?(cancelled?'갱신 해지 · 이용 가능':'구독 중 · 체험'):'구독 전';
    if(subDetail)subDetail.textContent=demoActive
      ?(cancelled?'갱신이 해지되었습니다. 이용기간 만료를 체험하면 전용 영상이 다시 잠깁니다.':'전체 예시 영상이 열렸습니다. 실제 결제나 정기 청구는 발생하지 않습니다.')
      :'구독 체험을 시작하면 전용 영상이 열립니다.';
    all('[data-action="subscribe"]').forEach(e=>e.textContent=demoActive?'내 구독 확인':'구독 체험하기 ↗');
    const cancelBtn=$('[data-action="cancel"]');if(cancelBtn)cancelBtn.hidden=!demoActive||cancelled;
    const expireBtn=$('[data-action="expire"]');if(expireBtn)expireBtn.hidden=!demoActive;
  }
  const pay=$('[data-action="pay"],[data-action="account"]');
  if(pay){
    pay.textContent='결제 없이 구독자 화면 체험';
    pay.dataset.action='pay';
  }
  const notice=$('.checkout-notice');
  if(notice)notice.textContent='카드번호나 개인정보를 입력하지 않습니다. 구독 상태는 이 화면 안에서만 바뀝니다.';
  const title=$('#checkout-title');
  if(title)title.textContent='구독을 시작해 볼까요?';
  const lead=title&&title.nextElementSibling;
  if(lead&&lead.tagName==='P')lead.textContent='실제 결제 없이 구독자 화면을 체험합니다.';
  const listEl=$('#progress-list');
  if(listEl){
    listEl.replaceChildren();
    if(!done.size){const p=document.createElement('p');p.textContent='아직 완료한 영상이 없어요. 무료 미리보기부터 시작해 보세요.';listEl.append(p);}
    else[...done].forEach(id=>{const lesson=lessonById(id);const b=document.createElement('button');b.dataset.lesson=id;b.textContent=(lesson?lesson.title:id)+' · 완료 ✓';listEl.append(b);});
  }
  updateCommunityHint();
  updatePracticeHint();
}

function firstUnfinishedStep(lesson){
  const completed=modules[lesson.id]||new Set();
  const total=lessonStepCount(lesson);
  for(let i=0;i<total;i++)if(!completed.has(i))return i;
  return 0;
}

function updatePracticeStart(){
  const list=lessons();
  const started=list.find(l=>canWatchLesson(l)&&(modules[l.id]||new Set()).size>0&&(modules[l.id]||new Set()).size<lessonStepCount(l));
  const lesson=started||list.find(l=>l.access==='free')||list[0];
  const title=$('.feature-lesson h2');
  const button=$('.feature-lesson button[data-lesson]');
  const description=$('#practice-start-description');
  const chip=$('#practice-start-label');
  if(!lesson)return;
  if(title)title.textContent=lesson.title;
  if(button){button.dataset.lesson=lesson.id;button.textContent=started?'이어서 연습하기 →':'강의 열기 →';}
  if(chip)chip.textContent=started?'이어서 학습':(lesson.access==='free'?'첫 연습 · 무료 미리보기':'첫 연습');
  if(description)description.textContent=started?`${lessonStepCount(lesson)}개 회차 중 ${firstUnfinishedStep(lesson)+1}번째부터 이어갑니다.`:(lesson.description||'강의 설명을 확인하고 연습을 시작해 보세요.');
}

function selectLearningPath(index){
  const terms=['기초','관찰','루틴','노래'];
  const descriptions=['기초 개념을 다루는 강의를 찾아보세요.','내 발성을 관찰하는 강의를 찾아보세요.','반복할 루틴 강의를 찾아보세요.','노래에 적용하는 강의를 찾아보세요.'];
  if(!Number.isInteger(index)||index<0||index>=terms.length)return;
  all('[data-path]').forEach(x=>x.setAttribute('aria-pressed',String(Number(x.dataset.path)===index)));
  all('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.filter==='전체')));
  const search=$('#course-search');if(search)search.value=terms[index];
  const description=$('#path-description');if(description)description.textContent=descriptions[index]+' 전체 강의는 검색어를 지우면 다시 볼 수 있어요.';
  filterCourses();
  if(search)search.focus();
}

function openLesson(id){
  const lesson=lessonById(id);
  if(!lesson){tell('강의를 찾을 수 없습니다.');return;}
  if(!canWatchLesson(lesson)){
    checkout();
    return;
  }
  currentId=lesson.id;step=firstUnfinishedStep(lesson);renderModules();
  const playerTitle=$('#player-title');if(playerTitle)playerTitle.textContent=lesson.title;
  setPlayerCopy(lesson);
  const dialog=$('#player-dialog');if(dialog)dialog.showModal();
}

function setPlayerCopy(lesson){
  const playerDesc=$('#player-description');
  if(playerDesc){
    const desc=(lesson&&lesson.description||'').trim();
    playerDesc.textContent=desc;
    playerDesc.hidden=!desc;
  }
  const playerBody=$('#player-body');
  if(playerBody){
    const body=(lesson&&lesson.body||'').trim();
    playerBody.textContent=body;
    playerBody.hidden=!body;
  }
}

function checkout(){
  if(canWatchExclusive()){tab('membership');return;}
  const dialog=$('#checkout-dialog');if(dialog)dialog.showModal();
}

async function startLivePreview(){
  const act=actions();
  if(!act||typeof act.startPreview!=='function'){
    tell('구독 체험을 시작할 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.');
    return;
  }
  try{
    await act.startPreview();
    if(!window.__VOISPEECH__)window.__VOISPEECH__={userEmail:null,userId:null,status:null,active:false};
    window.__VOISPEECH__.active=true;
    window.__VOISPEECH__.status=window.__VOISPEECH__.status||'active';
    const root=academy();
    if(root){root.dataset.sub='active';root.dataset.auth='user';}
    window.dispatchEvent(new Event('voispeech:force-membership'));
    if(window.__VOISPEECH_TRAINING__&&typeof window.__VOISPEECH_TRAINING__.sync==='function'){
      window.__VOISPEECH_TRAINING__.sync();
    }else{
      update();
    }
    tell('구독 체험이 시작되었습니다. 전용 영상을 열 수 있습니다.');
  }catch(err){
    tell('구독 체험을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.');
  }
}

async function liveCancelRenewal(){
  const act=actions();
  if(!act||typeof act.cancelRenewal!=='function'){
    tell('자동 갱신 해지를 처리하지 못했습니다. 페이지를 새로고침해 주세요.');
    return;
  }
  try{
    await act.cancelRenewal();
    if(window.__VOISPEECH_TRAINING__&&typeof window.__VOISPEECH_TRAINING__.sync==='function'){
      window.__VOISPEECH_TRAINING__.sync();
    }else{
      update();
    }
    tell('자동 갱신 해지를 체험했습니다. 이용기간 동안 영상은 계속 열려 있습니다.');
  }catch(err){
    tell('자동 갱신 해지를 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.');
  }
}

async function liveExpire(){
  const act=actions();
  if(!act||typeof act.expirePreview!=='function'){
    tell('이용기간 만료를 처리하지 못했습니다. 페이지를 새로고침해 주세요.');
    return;
  }
  try{
    await act.expirePreview();
    if(window.__VOISPEECH_TRAINING__&&typeof window.__VOISPEECH_TRAINING__.sync==='function'){
      window.__VOISPEECH_TRAINING__.sync();
    }else{
      update();
    }
    tell('이용기간 만료를 체험했습니다. 전용 영상이 다시 잠겼습니다.');
  }catch(err){
    tell('이용기간 만료를 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.');
  }
}

function onAcademyClick(e){
  const pageEl=e.target.closest('[data-community-page]');
  if(pageEl){
    e.preventDefault();
    const mode=pageEl.dataset.communityPage;
    if(mode==='next'&&communityHasMore){
      communityPage+=1;
      paintCommunityFromCacheOrLoading();
      void refreshPosts({soft:true});
    }else if(mode==='prev'&&communityPage>0){
      communityPage-=1;
      paintCommunityFromCacheOrLoading();
      void refreshPosts({soft:true});
    }
    return;
  }
  const likeEl=e.target.closest('[data-like]');
  if(likeEl){e.preventDefault();void onCommunityLike(likeEl.dataset.like);return;}
  const delEl=e.target.closest('[data-delete-post]');
  if(delEl){e.preventDefault();void onCommunityDelete(delEl.dataset.deletePost);return;}
  const replyEl=e.target.closest('[data-reply]');
  if(replyEl){
    e.preventDefault();
    const form=$('[data-reply-form="'+replyEl.dataset.reply+'"]');
    if(form)form.hidden=!form.hidden;
    return;
  }

  const root=academy();
  if(!root||!root.contains(e.target))return;
  const b=e.target.closest('button');if(!b||!root.contains(b))return;
  if(b.dataset.close){const d=$('#'+b.dataset.close);if(d)d.close();return;}
  if(b.dataset.tab){
    tab(b.dataset.tab);
    if(b.dataset.tab==='community'){paintCommunityFromCacheOrLoading();void refreshPosts({soft:true});}
    if(b.dataset.tab==='progress')void refreshRecords();
    return;
  }
  if(b.dataset.favorite){
    const id=String(b.dataset.favorite);
    favorites.has(id)?favorites.delete(id):favorites.add(id);
    saveFavorites();
    update();
    return;
  }
  if(b.dataset.path){selectLearningPath(Number(b.dataset.path));return;}
  if(b.dataset.channel){channel=b.dataset.channel;all('[data-channel]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));communityPage=0;paintCommunityFromCacheOrLoading();void refreshPosts({soft:true});return;}
  if(b.dataset.module){step=Number(b.dataset.module);renderModules();return;}
  if(b.dataset.filter){all('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filterCourses();return;}
  if(b.dataset.lesson){openLesson(b.dataset.lesson);return;}
  switch(b.dataset.action){
    case 'subscribe':
      if(canWatchExclusive()){tab('membership');break;}
      checkout();
      break;
    case 'account':{const cd=$('#checkout-dialog');if(cd)cd.close();goAccount();break;}
    case 'pay':{
      const m=membership();
      if(!m.live){
        demoActive=true;cancelled=false;const cd=$('#checkout-dialog');if(cd)cd.close();
        tell('구독자 체험이 시작되었습니다. 실제 결제는 없습니다.');
        break;
      }
      {const cd=$('#checkout-dialog');if(cd)cd.close();}
      if(!m.loggedIn){
        goAccount('로그인 후 구독 체험을 시작할 수 있습니다.','subscribe');
        break;
      }
      void startLivePreview();
      return;
    }
    case 'complete':
      if(!currentId)break;
      if(!modules[currentId])modules[currentId]=new Set();
      modules[currentId].add(step);
      {
        const lesson=lessonById(currentId);
        const total=lessonStepCount(lesson);
        const lessonId=String(currentId);
        if(modules[currentId].size>=total){
          done.add(lessonId);
          const pd=$('#player-dialog');if(pd)pd.close();
          tell(total>1?'코스의 모든 단계를 완료했습니다.':'강의를 완료했습니다.');
        }else{
          const remaining=[];
          for(let n=0;n<total;n++){if(!modules[currentId].has(n))remaining.push(n);}
          step=remaining[0];
          renderModules();
          tell('이 단계를 완료했습니다. 다음 단계를 확인하세요.');
        }
        void persistProgress(lessonId);
      }
      break;
    case 'cancel':{const cancelDlg=$('#cancel-dialog');if(cancelDlg)cancelDlg.showModal();break;}
    case 'confirm-cancel':
      {const cancelDlg=$('#cancel-dialog');if(cancelDlg)cancelDlg.close();}
      if(membership().live){void liveCancelRenewal();return;}
      cancelled=true;tell('자동 갱신 해지를 체험했습니다. 이용기간 동안 영상은 계속 열려 있습니다.');
      break;
    case 'expire':
      if(membership().live){void liveExpire();return;}
      demoActive=false;cancelled=false;tell('이용기간 만료를 체험했습니다. 전용 영상이 다시 잠겼습니다.');
      break;
    case 'reset':
      demoActive=false;cancelled=false;done.clear();Object.keys(modules).forEach(k=>delete modules[k]);favorites.clear();saveFavorites();localRecords.length=0;localPosts.length=0;dbRecords=[];dbPosts=[];communityPage=0;communityHasMore=false;communityTotal=0;communityShowLoading=false;communityCache.clear();progressHydrated=false;renderRecords();renderPosts();tab('library');all('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.filter==='전체')));all('[data-category]').forEach(x=>x.hidden=false);tell('체험을 초기화했습니다.');
      if(membership().live&&membership().loggedIn)void refreshProgress();
      break;
  }
  update();
}

function onPlayerClose(){
  const v=$('#lesson-video');if(v)v.pause();
}

function onDialogBackdrop(e){
  const d=e.currentTarget;
  if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}
}

function filterCourses(){
  const search=$('#course-search');
  const pressed=$('[data-filter][aria-pressed="true"]');
  if(!search||!pressed)return;
  const query=normalizeSearch(search.value);
  const category=pressed.dataset.filter||'전체';
  let visible=0;
  all('.lesson-grid .lesson-card').forEach(card=>{
    const catOk=category==='전체'||card.dataset.category===category;
    const hay=card.dataset.search||normalizeSearch(card.textContent);
    const textOk=!query||hay.includes(query);
    const show=catOk&&textOk;
    card.hidden=!show;
    if(show)visible+=1;
  });
  const empty=$('.library-empty');
  if(empty){
    empty.hidden=visible!==0;
  }
}

let courseSearchTimer=null;
function onCourseSearchInput(){
  clearTimeout(courseSearchTimer);
  courseSearchTimer=setTimeout(filterCourses,180);
}

function renderModules(){
  const list=$('#module-list');if(!list)return;
  list.replaceChildren();
  const lesson=currentId?lessonById(currentId):null;
  const titles=lessonSessionTitles(lesson);
  const hasRealSessions=lessonHasSessions(lesson);
  const includeBase=lessonIncludesBaseChip(lesson);
  const watched=modules[currentId]||new Set();
  if(hasRealSessions){
    titles.forEach((title,i)=>{
      const b=document.createElement('button');
      b.dataset.module=i;
      const mark=watched.has(i)?' ✓':'';
      if(includeBase&&i===0){
        b.textContent=`「강의」${mark}`;
      }else{
        const sessionIndex=includeBase?i:i+1;
        b.textContent=`${sessionIndex}. ${title}${mark}`;
      }
      b.setAttribute('aria-pressed',String(i===step));
      list.append(b);
    });
    list.hidden=false;
  }else{
    list.hidden=true;
  }
  if(lesson)setPlayerCopy(lesson);
  const hintEl=$('#player-hint');
  if(hintEl){
    const total=lessonStepCount(lesson);
    const meta=lessonStepMeta(lesson,step);
    const dur=meta.duration_label?` · ${meta.duration_label}`:'';
    if(hasRealSessions){
      if(meta.kind==='base'){
        const src=lesson?(lesson.video_url||''):'';
        const isDemo=!lesson||(!lesson.storage_path&&(!src||src==='/training-sample.mp4'));
        hintEl.textContent=isDemo
          ?`강의 · ${step+1}/${total} · 10초 재생 테스트 · 무음 · 실제 강의가 아닙니다.`
          :`강의 영상 재생 · ${step+1}/${total}${dur}`;
      }else{
        hintEl.textContent=`${meta.label} · ${step+1}/${total}${dur} · 선택한 세션 영상을 재생합니다.`;
      }
    }else{
      const src=lesson?(lesson.video_url||''):'';
      const isDemo=!lesson||(!lesson.storage_path&&(!src||src==='/training-sample.mp4'));
      if(isDemo){
        hintEl.textContent='10초 재생 테스트 · 무음 · 실제 강의가 아닙니다.';
      }else{
        const label=lesson&&lesson.duration_label?` · ${lesson.duration_label}`:'';
        hintEl.textContent=`강의 영상 재생${label}`;
      }
    }
  }
  const v=$('#lesson-video');
  if(v){
    const src=lessonVideoForStep(lesson,step);
    if(v.getAttribute('src')!==src)v.setAttribute('src',src);
    v.pause();
    v.currentTime=0;
  }
}

function updatePracticeHint(){
  const form=$('#practice-form');
  if(!form)return;
  const lead=form.querySelector('p');
  const m=membership();
  if(m.live&&m.loggedIn){
    if(lead)lead.textContent='로그인 계정에 연습 기록이 저장됩니다. 새로고침 후에도 유지됩니다.';
  }else if(m.live){
    if(lead)lead.textContent='로그인하면 연습 기록이 계정에 저장됩니다. 비로그인 시 이 화면에만 남습니다.';
  }else{
    if(lead)lead.textContent='이 브라우저 화면에서만 보이는 체험 기록입니다.';
  }
}

function renderRecords(){
  const list=$('#checkin-list');if(!list)return;
  list.replaceChildren();
  const m=membership();
  const rows=(m.live&&m.loggedIn)?dbRecords:localRecords;
  rows.forEach(r=>{
    const p=document.createElement('p');
    p.className='record-item';
    p.textContent=`${r.kind} · ${r.minutes}분 · ${r.note||'메모 없음'}`;
    list.append(p);
  });
  const summary=$('#record-summary');
  if(summary)summary.textContent=`기록 ${rows.length}회 · 총 ${rows.reduce((sum,r)=>sum+Number(r.minutes||0),0)}분`;
}

async function refreshRecords(){
  const m=membership();
  const a=api();
  if(m.live&&m.loggedIn&&a&&typeof a.listRecords==='function'){
    try{
      dbRecords=await a.listRecords();
    }catch(_){
      tell('연습 기록을 불러오지 못했습니다.');
    }
  }
  renderRecords();
  updatePracticeHint();
}

async function onPracticeSubmit(e){
  e.preventDefault();
  const f=new FormData(e.target);
  const minutes=Number(f.get('minutes'));
  if(!Number.isFinite(minutes)||minutes<1||minutes>600)return;
  const kind=String(f.get('kind'));
  const note=String(f.get('note')||'').trim();
  const m=membership();
  const a=api();
  if(m.live&&!m.loggedIn){
    goAccount('로그인하면 연습 기록을 저장할 수 있습니다.');
    return;
  }
  if(m.live&&m.loggedIn&&a&&typeof a.createRecord==='function'){
    try{
      await a.createRecord(kind,minutes,note);
      await refreshRecords();
      e.target.reset();
      const minutesInput=e.target.querySelector('[name="minutes"]');
      if(minutesInput)minutesInput.value='10';
      tell('연습 기록을 저장했습니다.');
    }catch(_){
      tell('연습 기록을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    }
    return;
  }
  localRecords.push({kind,minutes,note});
  renderRecords();
  tell('체험 기록을 추가했습니다. 외부 저장은 하지 않습니다.');
}


function isAdmin(){
  const a=api();
  if(a&&a.isAdmin===true)return true;
  const v=window.__VOISPEECH__;
  return !!(v&&v.isAdmin);
}
function viewerUserId(){
  const v=window.__VOISPEECH__;
  return(v&&v.userId)||null;
}
function updateCommunityHint(){
  const desc=$('[data-panel="community"] .academy-description');
  const m=membership();
  const admin=isAdmin();
  if(desc){
    if(m.live&&m.loggedIn){
      desc.textContent=channel==='공지'
        ?(admin?'운영자만 공지를 등록할 수 있습니다. 답글·추천·삭제를 사용할 수 있어요.':'공지는 운영자만 등록할 수 있습니다. 추천과 답글은 가능합니다.')
        :'로그인한 회원글이 채널별로 저장됩니다. 추천·답글·삭제를 사용할 수 있어요.';
    }else if(m.live)desc.textContent='글을 남기려면 로그인해 주세요. 비로그인 상태에서는 게시할 수 없습니다.';
    else desc.textContent='실제 커뮤니티가 아닌 화면 체험입니다. 글은 외부로 전송되지 않습니다.';
  }
  const form=$('#community-form');
  const btn=form&&form.querySelector('button');
  const ta=form&&form.querySelector('textarea');
  const noticeOnly=m.live&&m.loggedIn&&channel==='공지'&&!admin;
  if(form)form.hidden=!!(m.live&&m.loggedIn&&noticeOnly);
  let ban=$('#community-notice-ban');
  if(noticeOnly){
    if(!ban){
      ban=document.createElement('p');
      ban.id='community-notice-ban';
      ban.className='community-ban';
      if(form&&form.parentNode)form.parentNode.insertBefore(ban,form);
    }
    ban.hidden=false;
    ban.textContent='공지 채널은 운영자만 글을 등록할 수 있습니다.';
  }else if(ban){
    ban.hidden=true;
  }
  if(btn){
    btn.disabled=!!(m.live&&!m.loggedIn);
    btn.textContent=(m.live&&m.loggedIn)?'글 등록':(m.live?'로그인 후 작성':'화면에만 추가');
  }
  if(ta){
    ta.disabled=!!(m.live&&!m.loggedIn);
    ta.placeholder=(m.live&&m.loggedIn)?'채널에 남길 글을 적어 주세요.':(m.live?'로그인 후 작성할 수 있습니다.':'이 화면에만 표시됩니다.');
  }
}

function appendPostArticle(feed,x,opts){
  const nested=!!(opts&&opts.nested);
  const m=membership();
  const uid=viewerUserId();
  const admin=isAdmin();
  const a=document.createElement('article');
  a.className=nested?'community-post community-reply':'community-post';
  a.dataset.postId=String(x.id||'');
  const label=x.author_label||'회원';
  const meta=document.createElement('span');
  meta.textContent=nested?`${label} · 답글`:`${label} · ${x.channel||channel}`;
  const body=document.createElement('p');
  body.textContent=x.body||x.text||'';
  a.append(meta,body);
  if(m.live&&m.loggedIn&&x.id){
    const actions=document.createElement('div');
    actions.className='community-actions';
    const likeBtn=document.createElement('button');
    likeBtn.type='button';
    likeBtn.className='community-action';
    likeBtn.dataset.like=String(x.id);
    likeBtn.setAttribute('aria-pressed',String(!!x.liked_by_me));
    likeBtn.textContent=`추천 ${Number(x.like_count)||0}`;
    actions.append(likeBtn);
    if(!nested){
      const replyBtn=document.createElement('button');
      replyBtn.type='button';
      replyBtn.className='community-action';
      replyBtn.dataset.reply=String(x.id);
      replyBtn.textContent='답글';
      actions.append(replyBtn);
    }
    if(admin||(uid&&String(x.user_id)===String(uid))){
      const delBtn=document.createElement('button');
      delBtn.type='button';
      delBtn.className='community-action community-action-danger';
      delBtn.dataset.deletePost=String(x.id);
      delBtn.textContent='삭제';
      actions.append(delBtn);
    }
    a.append(actions);
    if(!nested){
      const replyBox=document.createElement('form');
      replyBox.className='community-reply-form';
      replyBox.hidden=true;
      replyBox.dataset.replyForm=String(x.id);
      replyBox.innerHTML='<label>답글<textarea name="reply" required maxlength="500" rows="5" placeholder="답글을 적어 주세요."></textarea></label><button class="btn-primary" type="submit">답글 등록</button>';
      a.append(replyBox);
    }
  }
  feed.append(a);
  if(!nested&&Array.isArray(x.replies)&&x.replies.length){
    const wrap=document.createElement('div');
    wrap.className='community-replies';
    feed.append(wrap);
    x.replies.forEach(r=>appendPostArticle(wrap,r,{nested:true}));
  }
}

function renderCommunityPager(feed){
  let pager=$('#community-pager');
  if(!pager){
    pager=document.createElement('div');
    pager.id='community-pager';
    pager.className='community-pager';
    if(feed.parentNode)feed.parentNode.insertBefore(pager,feed.nextSibling);
  }
  const m=membership();
  const show=m.live&&m.loggedIn&&(communityTotal>COMMUNITY_PAGE||communityPage>0||communityHasMore);
  pager.hidden=!show;
  if(!show){pager.replaceChildren();return;}
  pager.replaceChildren();
  const info=document.createElement('p');
  info.className='community-pager-info';
  const from=communityTotal?communityPage*COMMUNITY_PAGE+1:0;
  const to=Math.min((communityPage+1)*COMMUNITY_PAGE,communityTotal||dbPosts.length);
  info.textContent=communityTotal
    ?`상위 글 ${from}–${to} / ${communityTotal}`
    :`상위 글 ${dbPosts.length}`;
  pager.append(info);
  const actions=document.createElement('div');
  actions.className='community-pager-actions';
  const prev=document.createElement('button');
  prev.type='button';
  prev.className='btn-outline community-pager-btn';
  prev.dataset.communityPage='prev';
  prev.textContent='이전';
  prev.disabled=communityLoading||communityPage<=0;
  actions.append(prev);
  const next=document.createElement('button');
  next.type='button';
  next.className='btn-primary community-pager-btn';
  next.dataset.communityPage='next';
  next.textContent=communityLoading?'불러오는 중…':'다음';
  next.disabled=communityLoading||!communityHasMore;
  actions.append(next);
  pager.append(actions);
}


function communityCacheKey(ch,page){return String(ch)+'|'+String(page);}
function applyCommunityCached(cached){
  dbPosts=cached.posts;
  communityTotal=cached.total;
  communityHasMore=cached.hasMore;
  communityShowLoading=false;
}
function clearCommunityChannelCache(ch){
  const prefix=String(ch)+'|';
  for(const k of [...communityCache.keys()]){
    if(k.startsWith(prefix))communityCache.delete(k);
  }
}
function paintCommunityFromCacheOrLoading(){
  const cached=communityCache.get(communityCacheKey(channel,communityPage));
  if(cached){
    applyCommunityCached(cached);
    renderPosts();
    return true;
  }
  communityShowLoading=true;
  dbPosts=[];
  communityTotal=0;
  communityHasMore=false;
  renderPosts();
  return false;
}

function renderPosts(){
  const feed=$('#community-feed');if(!feed)return;
  feed.replaceChildren();
  const m=membership();
  if(m.live&&!m.loggedIn){
    const prompt=document.createElement('article');
    prompt.className='community-post';
    prompt.innerHTML='<span>안내</span><h2>로그인 후 커뮤니티에 참여할 수 있어요.</h2><p><a href="/account/">회원 계정으로 이동</a></p>';
    feed.append(prompt);
    renderCommunityPager(feed);
    updateCommunityHint();
    return;
  }
  const rows=(m.live&&m.loggedIn)?dbPosts:localPosts.filter(x=>x.channel===channel);
  if(!rows.length){
    const p=document.createElement('p');
    p.className='community-post';
    p.textContent=communityShowLoading?'불러오는 중…':channel+' · 아직 글이 없습니다. 첫 글을 남겨 보세요.';
    feed.append(p);
    renderCommunityPager(feed);
    updateCommunityHint();
    return;
  }
  rows.forEach(x=>appendPostArticle(feed,x,{nested:false}));
  renderCommunityPager(feed);
  updateCommunityHint();
}

async function refreshPosts(opts){
  const soft=!!(opts&&opts.soft);
  const m=membership();
  const a=api();
  if(m.live&&m.loggedIn&&a&&typeof a.listPosts==='function'){
    if(communityLoading&&!soft)return;
    const seq=++communityFetchSeq;
    const reqChannel=channel;
    const reqPage=communityPage;
    communityLoading=true;
    try{
      const offset=reqPage*COMMUNITY_PAGE;
      const page=await a.listPosts(reqChannel,{limit:COMMUNITY_PAGE,offset});
      if(seq!==communityFetchSeq)return;
      const posts=Array.isArray(page&&page.posts)?page.posts:(Array.isArray(page)?page:[]);
      const total=typeof(page&&page.total)==='number'?page.total:posts.length;
      const hasMore=!!(page&&page.hasMore);
      communityCache.set(communityCacheKey(reqChannel,reqPage),{posts,total,hasMore});
      if(channel!==reqChannel||communityPage!==reqPage)return;
      communityTotal=total;
      communityHasMore=hasMore;
      dbPosts=posts;
      communityShowLoading=false;
      if(!posts.length&&communityPage>0){
        communityPage-=1;
        communityLoading=false;
        await refreshPosts({soft:true});
        return;
      }
    }catch(_){
      if(seq!==communityFetchSeq)return;
      tell('커뮤니티 글을 불러오지 못했습니다.');
      if(communityShowLoading){
        dbPosts=[];communityHasMore=false;communityTotal=0;
      }
      communityShowLoading=false;
    }finally{
      if(seq===communityFetchSeq)communityLoading=false;
    }
  }else{
    communityHasMore=false;
    communityTotal=0;
    communityPage=0;
    communityShowLoading=false;
  }
  renderPosts();
}

async function onCommunitySubmit(e){
  e.preventDefault();
  const text=String(new FormData(e.target).get('post')).trim();
  if(!text)return;
  const m=membership();
  const a=api();
  if(m.live&&!m.loggedIn){
    goAccount('로그인 후 커뮤니티에 글을 남길 수 있습니다.');
    return;
  }
  if(m.live&&m.loggedIn&&channel==='공지'&&!isAdmin()){
    tell('공지 채널은 운영자만 글을 등록할 수 있습니다.');
    return;
  }
  if(m.live&&m.loggedIn&&a&&typeof a.createPost==='function'){
    try{
      await a.createPost(channel,text);
      e.target.reset();
      communityPage=0;
      clearCommunityChannelCache(channel);
      await refreshPosts({soft:true});
      tell('커뮤니티에 글을 등록했습니다.');
    }catch(_){
      tell(channel==='공지'&&!isAdmin()
        ?'공지 채널은 운영자만 글을 등록할 수 있습니다.'
        :'글을 등록하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    }
    return;
  }
  localPosts.push({channel,text,body:text,author_label:'체험 회원',replies:[],like_count:0});
  e.target.reset();
  renderPosts();
  tell('체험 글을 화면에 추가했습니다. 외부로 게시하지 않았습니다.');
}

async function onCommunityLike(id){
  const a=api();
  if(!a||typeof a.toggleLike!=='function')return;
  try{
    const res=await a.toggleLike(id);
    const btn=document.querySelector('[data-like="'+String(id)+'"]');
    if(btn&&res){
      btn.setAttribute('aria-pressed',String(!!res.liked));
      btn.textContent='추천 '+(Number(res.like_count)||0);
    }
    clearCommunityChannelCache(channel);
    await refreshPosts({soft:true});
  }catch(_){
    tell('추천을 처리하지 못했습니다.');
  }
}

async function onCommunityDelete(id){
  const a=api();
  if(!a||typeof a.deletePost!=='function')return;
  if(!window.confirm('이 글을 삭제할까요?'))return;
  try{
    await a.deletePost(id);
    communityPage=0;
    clearCommunityChannelCache(channel);
    await refreshPosts({soft:true});
    tell('글을 삭제했습니다.');
  }catch(_){
    tell('글을 삭제하지 못했습니다.');
  }
}

async function onCommunityReplySubmit(form){
  const id=form.dataset.replyForm;
  const text=String(new FormData(form).get('reply')).trim();
  if(!id||!text)return;
  const a=api();
  if(!a||typeof a.createPost!=='function')return;
  try{
    await a.createPost(channel,text,id);
    form.reset();
    form.hidden=true;
    clearCommunityChannelCache(channel);
    await refreshPosts({soft:true});
    tell('답글을 등록했습니다.');
  }catch(_){
    tell('답글을 등록하지 못했습니다.');
  }
}

function bindAcademy(root){
  if(!root||root.dataset.bound==='true')return;
  root.dataset.bound='true';
  root.addEventListener('click',onAcademyClick);
  const player=$('#player-dialog');
  if(player)player.addEventListener('close',onPlayerClose);
  all('dialog').forEach(d=>d.addEventListener('click',onDialogBackdrop));
  const search=$('#course-search');
  if(search)search.addEventListener('input',onCourseSearchInput);
  const practice=$('#practice-form');
  if(practice)practice.addEventListener('submit',(e)=>{void onPracticeSubmit(e);});
  const community=$('#community-form');
  if(community)community.addEventListener('submit',(e)=>{void onCommunitySubmit(e);});
  root.addEventListener('submit',(e)=>{
    const rf=e.target.closest('[data-reply-form]');
    if(!rf||!root.contains(rf))return;
    e.preventDefault();
    void onCommunityReplySubmit(rf);
  });
}

function sync(){
  const root=academy();
  if(!root)return;
  bindAcademy(root);
  lessons();
  renderLibrary();
  update();
  filterCourses();
  const m=membership();
  if(m.live&&m.loggedIn){
    communityPage=0;paintCommunityFromCacheOrLoading();void refreshPosts({soft:true});
    void refreshRecords();
    if(!progressHydrated)void refreshProgress();
  }else{
    progressHydrated=false;
    renderPosts();
    renderRecords();
  }
}

window.__VOISPEECH_TRAINING__={sync};
window.addEventListener('voispeech:membership',()=>sync());
window.addEventListener('voispeech:lessons',()=>{lessons();renderLibrary();sync();});
sync();
})();
