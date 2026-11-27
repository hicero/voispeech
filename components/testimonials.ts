// 당근 후기 데이터 (2026-11-27 수집).
// 새 채널(프립 등) 후기가 생기면 REVIEW_PLATFORMS에 플랫폼 한 줄,
// REVIEWS에 후기를 추가하면 같은 카드 틀로 붙는다.
export type ReviewPlatformId = "daangn";

export interface ReviewPlatform {
  id: ReviewPlatformId;
  /** 카드에 표시되는 플랫폼 이름 (예: "당근") */
  label: string;
  /** 플랫폼 문구 (예: "당근에서 작성된 후기") */
  tagline: string;
  /** 테마 색 */
  color: string;
  /** 로고 파일 경로 */
  logo: string;
}

export const REVIEW_PLATFORMS: Record<ReviewPlatformId, ReviewPlatform> = {
  daangn: {
    id: "daangn",
    label: "당근",
    tagline: "당근에서 작성된 후기",
    color: "#FF6F0F",
    logo: "/daangn-logo.svg",
  },
};

export interface Review {
  id: string;
  platform: ReviewPlatformId;
  /** 후기가 달린 곳: "마곡 천원 보컬레슨" | "FindYourVoice 비즈프로필" */
  source: string;
  author: string;
  /** 수집 당시 당근에 표시된 날짜 그대로 ("9일 전", "1년 이상 전" 등) */
  date: string;
  /** 모임 후기는 별점 없음 */
  rating?: number;
  text: string;
}

export const REVIEWS: Review[] = [
  {
    id: "group-01",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "그때",
    date: "9일 전",
    text: `처음인데 친절하셔서 좋았어요
너무 웃기셔서 계속 웃고 너무 재밌었어요
완전 짱짱👍👍
또 뵙고 싶어요~`,
  },
  {
    id: "group-02",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "caleb",
    date: "18일 전",
    text: `저에게도 기회가 오기를 기다리고 있었는데.. 너무 친절하시고 열정을 다해 가르쳐 주셔서 감동했어요
한번 수업을 받았는데도 실력이 좋아지는 것을 느낄 수 있었어요. 꾸준히 배우면 노래에 자신감이 생길 것 같아요. 좋은 시간 마련해 주셔서 감사합니다`,
  },
  {
    id: "group-03",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "클로드",
    date: "18일 전",
    text: `너무 친절하게 잘 가르쳐주셨어요!
보통 학생들 잘 못알아들으면 선생님들 답답해 하는게 느껴지는데 전혀 안느껴지더라구요
감사드리고 또 뵙겠습니다`,
  },
  {
    id: "group-04",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "쥬아나",
    date: "25일 전",
    text: `오늘 보컬레슨 받고 왔습니다
엄청 소심하고 부끄러움 많은탓에 쌤 앞에서 노래부르는 것조차 어려웠지만 간절한 바램이 있어서 용기를 내보았답니다
지난 오픈수업때 쌤들이 너무 열정적으로 가르쳐주셔서 꼭 다시 만나보고 싶은 생각이 들었었는데 오늘도 역시 긴시간동안 너무 열심히 알려주셨답니다
한번 수업으로 소리가 바뀔수 있다는것도 너무 신기하고 원하고 바라는만큼 노력도 필요하다는것도 알게 되었습니다
가르쳐주신것...제가 원하는대로 좋은일에 사용하겠습니다
오늘 눈물나게 감사했습니다~~`,
  },
  {
    id: "group-05",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "파란하늘",
    date: "1개월 전",
    text: `열과 성을 다해 레슨해 주셔서 정말 감사해요!
그동안 몰랐던 발성법도 하나씩 배워가니 정말 뜻깊고 즐거운 시간이었어요.^^`,
  },
  {
    id: "group-06",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "파우에어",
    date: "1개월 전",
    text: `발성, 레슨, 이런걸 처음 접해봤습니다
역시 배워야한다는걸 많이 느꼈고 열정적인 레슨 너무 좋았습니다.
이렇게 좋은기회 만들어주셔서 감사합니다.
기회가 되면 또 뵙고싶네요^^`,
  },
  {
    id: "group-07",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "쥬아나",
    date: "1개월 전",
    text: `쌤들이 너무 열심히 가르쳐주셔서 너무 감사했어요~
수업에 집중하느라 2시간이 후딱 지나갔습니다
알차고 즐거운 수업이었습니다~
함께하신분들도 너무 반가웠습니다
감사해요~~`,
  },
  {
    id: "group-08",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "하얀목련",
    date: "1개월 전",
    text: `열심히 쉽게 가르쳐 주셔서 감사하고~~
의미 있는 시간이었습니다~~!!!♡`,
  },
  {
    id: "group-09",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "연청",
    date: "2개월 전",
    text: `그동안 비염과성대결절과 편도염을 달고 살아왔는데
그원인을 잘설명해주셔서 너무 유익한 시간이었어요.👍`,
  },
  {
    id: "group-10",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "허상윤",
    date: "2개월 전",
    text: `내가 뭐가 문제였는지 정확히 알게 되었습니다
감사해요!!`,
  },
  {
    id: "group-11",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "리어왕",
    date: "2개월 전",
    text: `친절히 잘 알려주시고 즐거운 즐거운 시간이었어요!`,
  },
  {
    id: "group-12",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "문희주세요",
    date: "2개월 전",
    text: `오늘 처음 배웠는데 너무 친절하고 재미있게 알려주시고 되게 열정적으로 잘 알려주세요!!`,
  },
  {
    id: "group-13",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "토끼 천사",
    date: "2개월 전",
    text: `초면에 처음인데 배우는 나의열정보다 가르키는선생님열정이 강한 시간이 였습니다.
1.000원 물값만해도 천원이 넘는데 감사하게 잘 지도받았습니다.
선생님? 감사합니다.`,
  },
  {
    id: "group-14",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "긴뮤",
    date: "2개월 전",
    text: `엄청 친절하시고 너무 재밌게 잘배웠습니다! 감사합니다:)`,
  },
  {
    id: "group-15",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "하니",
    date: "2개월 전",
    text: `노래 10년전에 잠깐배웠지만 아직부족한것도많고 고민되는것도 많았는데 바로 저의 문제점 잡아주시고 👍 쪽집게 선생님이 여기계셨더라구요
50분동안 진짜 알찬 수업이였습니다
제가 다시 노래배워보려고 선생님을 찾는중이라 선생님 진짜 수강생이 되보려 진지하게 고민중입니다!!!
너무 좋은 수업이였거든요 ㅠㅠ😆👍`,
  },
  {
    id: "group-16",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "소리의 질",
    date: "2개월 전",
    text: `저도 다른 사람을 가르치는 쪽의 업을 하고 있지만 긴말 않겠습니다. 그냥 최고엿습니다. 천원짜리?? 짧은 시간의 단기 였음에도 천만원짜리 보다도 값진 시간이었습니다. 감사합니다.🙏🏻`,
  },
  {
    id: "group-17",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "대호",
    date: "2개월 전",
    text: `저에게 맞는 발성법을 찾아주시려고 1시간이라는 시간동안 엄청 집중해서 해주셨어요!
제가 잘 따라갔는지는 모르겠지만 계속 쌤한테 배워서 고쳐나가고싶습니다☺️`,
  },
  {
    id: "group-18",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "레인",
    date: "2개월 전",
    text: `재우쌤을 만나고, 한 시간 동안 제가 계속 고민하던 발성과 노래 습관의 문제점을 정확하게 찾아주셔서 정말 속이 시원했어요~~
요즘 노래가 잘 안 되는 이유를 알게 된 것 같아 너무 좋았고, 집에서도 연습할 수 있는 방법까지 알려주셔서 감사했습니다.
원데이였지만 더 배워보고 싶다는 생각이 들 정도로 좋은 시간이었어요. 😊`,
  },
  {
    id: "group-19",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "bluepiri",
    date: "2개월 전",
    text: `앞에 연속해서 있었던 레슨들에도 불구하고 힘드셨을텐데도 정말 너무 열심히 가르쳐 주셨습니다.
새로운 연습 방법들, 제가 부족한 것들을 알 수 있었던 귀한 시간이었습니다.
고맙습니다 재우샘!`,
  },
  {
    id: "group-20",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "밥공기",
    date: "2개월 전",
    // 마지막 문장은 당근 원문 그대로 ("감시합니다"는 "감사합니다"의 오타로 보임)
    text: `평소 가지고 있던 문제를 잘 확인할 수 있었습니다~
당장 무엇을 어떻게 해야힐지 방향을 조금은 발견하는 좋은 시간이었어요~
참 손볼때 많있을텐데도 힘든 내색 않하시고 마칠때까지 일관된 친절도 너무 감사했습니다~~
선생님께서 식사도 못하시고 종일 고생많으셨습니다~
소중한 가르침 감시합니다~~^^*`,
  },
  {
    id: "group-21",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "민초러버",
    date: "2개월 전",
    text: `자세히 가르쳐주셔서 감사합니다
오늘 배운 방법으로 잘 연습해볼게요^^`,
  },
  {
    id: "group-22",
    platform: "daangn",
    source: "마곡 천원 보컬레슨",
    author: "서PD",
    date: "2개월 전",
    text: `처음 받아보는데 정말 재미있고 유익한 시간이었습니다!!
문제점도 알기쉽게 설명해주시고 조만간 정식레슨 받아보려고요!
등록할때 다시 연락드릴게용!! 재우쌤 짱!!!`,
  },
  {
    id: "biz-01",
    platform: "daangn",
    source: "FindYourVoice 비즈프로필",
    author: "가을",
    date: "5개월 전",
    rating: 5,
    text: `너무 잘 가르쳐주십니다 이론적으로 잘 알고계시고 가르치실때는 어려운 용어가아니라 실질적으로 필요한 용어들을 사용해서 알려주셔서 이해할수있어요 중간에 발성 시범도 보여주시는데 너무 잘하십니다 예전에 다른 선생님 몇분께 배워본적있는데 선생님이 제일 티칭능력이 좋으신거 같아서 원데이 클래스 들은 후에 바로 정식수업을 등록했어요 그 후에 한달정도 수업하고 쓰는 후기입니다`,
  },
  {
    id: "biz-02",
    platform: "daangn",
    source: "FindYourVoice 비즈프로필",
    author: "mandarin",
    date: "1년 이상 전",
    rating: 5,
    text: `노래에 정말 무지한 사람인데 지인 추천으로 받아보니 누가 받아도 이해할 수 있을 정도로 정말 쉽고 친절하게 설명해주셨어요 감사합니다`,
  },
  {
    id: "biz-03",
    platform: "daangn",
    source: "FindYourVoice 비즈프로필",
    author: "조용한괴물",
    date: "1년 이상 전",
    rating: 5,
    text: ``,
  },
  {
    id: "biz-04",
    platform: "daangn",
    source: "FindYourVoice 비즈프로필",
    author: "해질녘",
    date: "1년 이상 전",
    rating: 5,
    text: `레슨이란걸 받아본적이 없어서 걱정반 설렘반으로 갔지만 내 앞으로에대한 기대와 설렘만 커져서 나왔습니다 너무 친절하시고 이해하기 쉽게 설명해주셔서 감사합니다 고민중이라면 정말 시간과 기회있을때 무료레슨 받아보세요 편한분위기에서 쉽게 연습하는 방법등 짧았지만 엄청 유익한 시간이였습니다 !!`,
  },
  {
    id: "biz-05",
    platform: "daangn",
    source: "FindYourVoice 비즈프로필",
    author: "슈슈베베",
    date: "1년 이상 전",
    rating: 5,
    text: `당일 신청했는데 바로 예약잡아주셔서 레슨 받았습니다. 열정가득한 모습으로 가르침주셔서 감동이었습니다~ 보컬레슨이 처음이라 아직 감이 잘 잡히지 않지만 원장님처럼 실력있는 트레이너분과 꾸준히 노력한다면 분명 실력은 상승할 것 같습니다. 좋은 기회주셔서 감사드립니다.👍🏻`,
  },
  {
    id: "biz-06",
    platform: "daangn",
    source: "FindYourVoice 비즈프로필",
    author: "shinezeee",
    date: "1년 이상 전",
    rating: 5,
    text: `재미나게 잘 알려주십니다!!!! 소리 내는 방법을알아가는게 참 힘든데 많이 깨닫게 해주셨습니다🙇🏻♀️🙇🏻♀️🙇🏻♀️ 내일 합주 잘하고 오갯습니더 !!!!!`,
  },
  {
    id: "biz-07",
    platform: "daangn",
    source: "FindYourVoice 비즈프로필",
    author: "탈퇴한 사용자",
    date: "1년 이상 전",
    rating: 5,
    text: `재밌게 잘 가르쳐주셨어요!긴장 많이 했는데 긴장도 풀어주시고 이해하기 쉽게 알려주셨어요~!`,
  },
  {
    id: "biz-08",
    platform: "daangn",
    source: "FindYourVoice 비즈프로필",
    author: "노스",
    date: "1년 이상 전",
    rating: 5,
    text: `오늘 보컬 레슨 무료로 받았는데, 선생님께서 정말 열정적으로 가르쳐주셔서 너무 유익한 시간이었습니다. 그동안 어떻게 연습해야 할지 막막했는데, 덕분에 소리 내는 방법의 감을 잡을 수 있어서 정말 좋았어요. 레슨 끝나고도 이것저것 친절하게 상담해주셔서 감사했고, 선생님의 조언이 큰 도움이 됐습니다. 감사합니다!`,
  },
  {
    id: "biz-09",
    platform: "daangn",
    source: "FindYourVoice 비즈프로필",
    author: "구페",
    date: "1년 이상 전",
    rating: 5,
    text: `보컬 레슨은 처음이라 긴장하고 들었는대 만나보니 친절하시고 잘 알려주셔서 좋아요`,
  },
  {
    id: "biz-10",
    platform: "daangn",
    source: "FindYourVoice 비즈프로필",
    author: "아싸라비아콜롬비아",
    date: "1년 이상 전",
    rating: 5,
    text: `좋았어요!! 열정 넘쳤어요~`,
  },
];
