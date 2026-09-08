const areas = [
  {num:"01", name:"호흡 · 발성", desc:"숨과 소리의 시작, 그리고 이어짐", question:"소리를 시작하고 이어갈 때 숨과 힘을 어떻게 쓰나요?"},
  {num:"02", name:"소리의 무게 · 성구 연결", desc:"음높이에 따른 소리의 변화", question:"높아지거나 작아질 때 소리가 어디서 달라지나요?"},
  {num:"03", name:"목 · 턱 · 혀의 긴장", desc:"발성할 때 함께 나타나는 움직임", question:"소리를 내는 동안 어디에 힘이 더해지나요?"},
  {num:"04", name:"모음 · 울림", desc:"발음과 입 모양에 따른 차이", question:"모음을 바꾸면 소리와 편안함이 어떻게 달라지나요?"},
  {num:"05", name:"소리 이해 · 연습", desc:"듣고 느낀 것을 연습으로 연결", question:"수업에서 찾은 소리를 혼자서도 다시 낼 수 있나요?"}
];
export default function VoiceCheck() {
 return <section id="voice-check" className="section-pad bg-surface"><div className="mx-auto max-w-6xl px-5 md:px-8">
  <div className="section-heading"><div><p className="eyebrow">5 VOICE CHECK</p><h2>발성의 5가지 영역</h2></div><p>잘 되고 있는 부분과 조정이 필요한 부분을<br className="hidden md:block"/> 함께 살펴, 연습의 우선순위를 정합니다.</p></div>
  <ol className="voice-rows">{areas.map(a=><li key={a.num}><span className="voice-number">{a.num}</span><div><h3>{a.name}</h3><p>{a.desc}</p></div><p className="voice-question">{a.question}</p></li>)}</ol>
  <p className="section-note">수업 중 소리와 수행을 관찰하는 코칭 기준입니다. 의학적 검사나 성대 근육의 상태를 확정하는 진단은 아닙니다.</p>
 </div></section>;
}
