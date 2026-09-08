(()=>{
let demoActive=false,cancelled=false,current=1;const done=new Set();const favorites=new Set();const modules={};let step=0;const records=[];let channel="공지";const posts=[];
const titles=['연습을 시작하기 전에','빨대 발성, 연습의 출발점','작은 소리에서 연결 찾기','한 구절로 옮겨보기'];

function academy(){return document.getElementById('academy');}
const $=s=>{const root=academy();return root?root.querySelector(s):null;};
const all=s=>{const root=academy();return root?root.querySelectorAll(s):[];};
const tell=t=>{const el=$('#academy-status');if(el)el.textContent=t;};
const tab=name=>{all('[data-panel]').forEach(e=>e.hidden=e.dataset.panel!==name);all('nav [data-tab]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.tab===name)));};

/** Supabase bridge from TrainingApp (data-auth set), or local screen-only demo. */
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
  // No Supabase client: screen demo only (does not write membership).
  return{live:false,loggedIn:false,active:demoActive};
}

function canWatchExclusive(){
  const m=membership();
  if(m.live)return m.active===true;
  return demoActive===true;
}

function goAccount(msg){
  if(msg)tell(msg);
  window.location.href='/account/';
}

function actions(){
  return window.__VOISPEECH_ACTIONS__||null;
}

function update(){
  const root=academy();
  if(!root)return;
  const m=membership();
  const exclusive=canWatchExclusive();
  all('[data-progress]').forEach(e=>e.textContent=`${(modules[e.dataset.progress]||new Set()).size} / 3`);
  all('[data-favorite]').forEach(e=>{const on=favorites.has(Number(e.dataset.favorite));e.setAttribute('aria-pressed',String(on));e.textContent=on?'★ 저장됨':'☆ 저장';});
  const saved=$('#favorites-list');if(saved){saved.replaceChildren();if(!favorites.size)saved.textContent='저장한 코스가 없습니다.';favorites.forEach(id=>{const b=document.createElement('button');b.dataset.lesson=id;b.textContent=titles[id-1];saved.append(b);});}
  const completion=$('#completion-count');if(completion)completion.textContent=`${done.size} / 4`;
  all('[data-access]').forEach(e=>e.textContent=Number(e.dataset.access)===1?'무료 미리보기':exclusive?'시청 가능':'구독 전용');
  all('[data-done]').forEach(e=>e.hidden=!done.has(Number(e.dataset.done)));
  // Membership panel reflects live/demo status; checkout dialog copy stays pretty below.
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
  // Keep the original pretty checkout dialog copy.
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
  const list=$('#progress-list');
  if(list){
    list.replaceChildren();
    if(!done.size){const p=document.createElement('p');p.textContent='아직 완료한 영상이 없어요. 무료 미리보기부터 시작해 보세요.';list.append(p);}
    else[...done].forEach(id=>{const b=document.createElement('button');b.dataset.lesson=id;b.textContent=titles[id-1]+' · 완료 ✓';list.append(b);});
  }
}

function openLesson(id){
  if(id!==1&&!canWatchExclusive()){
    checkout();
    return;
  }
  current=id;step=0;renderModules();
  const playerTitle=$('#player-title');if(playerTitle)playerTitle.textContent=titles[id-1];
  const v=$('#lesson-video');if(v)v.currentTime=0;
  const dialog=$('#player-dialog');if(dialog)dialog.showModal();
}

function checkout(){
  if(canWatchExclusive()){tab('membership');return;}
  // Live + locked: open pretty checkout dialog (no window.confirm).
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
    if(typeof act.refresh==='function')await act.refresh();
    update();
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
    if(typeof act.refresh==='function')await act.refresh();
    update();
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
    if(typeof act.refresh==='function')await act.refresh();
    update();
    tell('이용기간 만료를 체험했습니다. 전용 영상이 다시 잠겼습니다.');
  }catch(err){
    tell('이용기간 만료를 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.');
  }
}

function onAcademyClick(e){
  const root=academy();
  if(!root||!root.contains(e.target))return;
  const b=e.target.closest('button');if(!b||!root.contains(b))return;
  if(b.dataset.close){const d=$('#'+b.dataset.close);if(d)d.close();return;}
  if(b.dataset.tab){tab(b.dataset.tab);return;}
  if(b.dataset.favorite){const id=Number(b.dataset.favorite);favorites.has(id)?favorites.delete(id):favorites.add(id);update();return;}
  if(b.dataset.path){const descriptions=['기초 이해: 연습 전 목표와 환경을 살펴봅니다.','내 발성 관찰: 어려운 구간과 변화를 기록합니다.','루틴 연습: 코치와 정한 연습을 반복해 확인합니다.','노래 적용: 익숙한 곡의 짧은 구절에 적용합니다.'];const pathDesc=$('#path-description');if(pathDesc)pathDesc.textContent=descriptions[Number(b.dataset.path)];return;}
  if(b.dataset.channel){channel=b.dataset.channel;all('[data-channel]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderPosts();return;}
  if(b.dataset.module){step=Number(b.dataset.module);renderModules();return;}
  if(b.dataset.filter){all('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));filterCourses();return;}
  if(b.dataset.lesson){openLesson(Number(b.dataset.lesson));return;}
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
        goAccount('로그인 후 구독 체험을 시작할 수 있습니다.');
        break;
      }
      void startLivePreview();
      break;
    }
    case 'complete':
      if(!modules[current])modules[current]=new Set();
      modules[current].add(step);
      if(modules[current].size===3){done.add(current);const pd=$('#player-dialog');if(pd)pd.close();tell('코스의 세 단계를 모두 완료했습니다.');}
      else{step=[0,1,2].find(n=>!modules[current].has(n));renderModules();tell('단계를 완료했습니다. 다음 단계를 확인하세요.');}
      break;
    case 'cancel':{const cancelDlg=$('#cancel-dialog');if(cancelDlg)cancelDlg.showModal();break;}
    case 'confirm-cancel':
      {const cancelDlg=$('#cancel-dialog');if(cancelDlg)cancelDlg.close();}
      if(membership().live){void liveCancelRenewal();break;}
      cancelled=true;tell('자동 갱신 해지를 체험했습니다. 이용기간 동안 영상은 계속 열려 있습니다.');
      break;
    case 'expire':
      if(membership().live){void liveExpire();break;}
      demoActive=false;cancelled=false;tell('이용기간 만료를 체험했습니다. 전용 영상이 다시 잠겼습니다.');
      break;
    case 'reset':
      demoActive=false;cancelled=false;done.clear();Object.keys(modules).forEach(k=>delete modules[k]);favorites.clear();records.length=0;posts.length=0;renderRecords();renderPosts();tab('library');all('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.filter==='전체')));all('[data-category]').forEach(x=>x.hidden=false);tell('체험을 초기화했습니다.');
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
  const query=search.value.trim().toLowerCase();
  const category=pressed.dataset.filter;
  all('[data-category]').forEach(x=>x.hidden=(category!=='전체'&&x.dataset.category!==category)||!x.textContent.toLowerCase().includes(query));
}

function renderModules(){
  const list=$('#module-list');if(!list)return;
  list.replaceChildren();
  ['안내','루틴','노래에 적용'].forEach((title,i)=>{const b=document.createElement('button');b.dataset.module=i;b.textContent=`${i+1}. ${title} ${(modules[current]||new Set()).has(i)?'✓':''}`;b.setAttribute('aria-pressed',String(i===step));list.append(b);});
  const v=$('#lesson-video');if(v){v.pause();v.currentTime=0;}
}

function renderRecords(){
  const list=$('#checkin-list');if(!list)return;
  list.replaceChildren();
  records.forEach(r=>{const p=document.createElement('p');p.className='record-item';p.textContent=`${r.kind} · ${r.minutes}분 · ${r.note||'메모 없음'}`;list.append(p);});
  const summary=$('#record-summary');
  if(summary)summary.textContent=`기록 ${records.length}회 · 총 ${records.reduce((sum,r)=>sum+r.minutes,0)}분`;
}

function onPracticeSubmit(e){
  e.preventDefault();
  const f=new FormData(e.target);
  const minutes=Number(f.get('minutes'));
  if(!Number.isFinite(minutes)||minutes<1||minutes>600)return;
  records.push({kind:String(f.get('kind')),minutes,note:String(f.get('note')).trim()});
  renderRecords();
  tell('체험 기록을 추가했습니다. 외부 저장은 하지 않습니다.');
}

function renderPosts(){
  const feed=$('#community-feed');if(!feed)return;
  feed.replaceChildren();
  const p=document.createElement('p');p.className='community-post';p.textContent=channel+' · 예시 채널입니다. 작성한 글은 이 화면에만 표시됩니다.';feed.append(p);
  posts.filter(x=>x.channel===channel).forEach(x=>{const a=document.createElement('article');a.className='community-post';a.textContent='체험 회원 · '+x.text;feed.append(a);});
}

function onCommunitySubmit(e){
  e.preventDefault();
  const text=String(new FormData(e.target).get('post')).trim();
  if(!text)return;
  posts.push({channel,text});
  e.target.reset();
  renderPosts();
  tell('체험 글을 화면에 추가했습니다. 외부로 게시하지 않았습니다.');
}

function bindAcademy(root){
  if(!root||root.dataset.bound==='true')return;
  root.dataset.bound='true';
  root.addEventListener('click',onAcademyClick);
  const player=$('#player-dialog');
  if(player)player.addEventListener('close',onPlayerClose);
  all('dialog').forEach(d=>d.addEventListener('click',onDialogBackdrop));
  const search=$('#course-search');
  if(search)search.addEventListener('input',filterCourses);
  const practice=$('#practice-form');
  if(practice)practice.addEventListener('submit',onPracticeSubmit);
  const community=$('#community-form');
  if(community)community.addEventListener('submit',onCommunitySubmit);
}

function sync(){
  const root=academy();
  if(!root)return;
  bindAcademy(root);
  update();
}

window.__VOISPEECH_TRAINING__={sync};
window.addEventListener('voispeech:membership',()=>sync());
sync();
})();
