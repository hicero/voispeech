const programs = [
 {num:"01",name:"처음 시작하는 발성",tag:"기초 · 입문",desc:"어떻게 소리를 내야 할지 막막하다면, 현재 편하게 낼 수 있는 소리부터 시작합니다.",points:["숨과 소리의 연결","음정과 리듬의 기초","반복할 수 있는 연습 찾기"]},
 {num:"02",name:"막히는 구간 살펴보기",tag:"고음 · 성구 연결",desc:"특정 음에서 끊기거나 힘이 들어간다면, 조건을 바꿔보며 차이를 확인합니다.",points:["음높이에 따른 변화 관찰","소리의 크기와 무게 조절","모음을 바꿔 연결 연습"]},
 {num:"03",name:"내 노래에 적용하기",tag:"취미 · 표현",desc:"연습할 때 찾은 소리를 좋아하는 곡의 한 구절에 옮겨봅니다.",points:["어려운 구절 나누기","발음과 프레이징 조절","곡 안에서 반복해 확인"]}
];
export default function Programs(){return <section id="programs" className="section-pad bg-page"><div className="mx-auto max-w-6xl px-5 md:px-8"><div className="section-heading"><div><p className="eyebrow">YOUR STARTING POINT</p><h2>지금, 어디서 막히나요?</h2></div><p>정해진 틀에 나를 맞추기보다,<br/>내 목표와 현재 발성에서 출발합니다.</p></div><div className="program-grid">{programs.map(p=><article className="program-card" key={p.num}><div className="program-top"><span>{p.num}</span><span>{p.tag}</span></div><h3>{p.name}</h3><p>{p.desc}</p><ul>{p.points.map(t=><li key={t}>{t}</li>)}</ul><a href="#booking">원데이 예약 안내 <span aria-hidden>↗</span></a></article>)}</div><p className="section-note">위 내용은 수업에서 다룰 수 있는 주제입니다. 세부 구성과 비용은 상담 시 안내합니다.</p></div></section>}
