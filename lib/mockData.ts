export const valueChainStages = [
  {
    stage: "원료 수급",
    owner: "구매",
    status: "정상",
    progress: 86,
    description: "고추 베이스와 발효 원료의 월간 수급 안정성을 확인합니다.",
  },
  {
    stage: "생산 배치",
    owner: "공장",
    status: "점검",
    progress: 62,
    description: "Gochu Paste 병입 속도와 라벨 부착 일정을 점검합니다.",
  },
  {
    stage: "수출 포장",
    owner: "물류",
    status: "준비",
    progress: 74,
    description: "멕시코 샘플 발송용 박스 규격과 파손 방지 포장을 확정합니다.",
  },
];

export const brandingAssets = [
  {
    title: "VERBOS 브랜드 스토리",
    market: "공통",
    tone: "대표 메시지",
    status: "확정",
    description: "한국형 소스를 남미의 일상 식탁에 연결하는 핵심 서사입니다.",
  },
  {
    title: "Gochu Paste 라벨 문구",
    market: "멕시코",
    tone: "직관적",
    status: "검토",
    description: "타코, 구운 고기, 감자 요리에 어울리는 사용 장면을 강조합니다.",
  },
  {
    title: "Ssam Sauce 매장 카드",
    market: "페루",
    tone: "따뜻함",
    status: "초안",
    description: "아히 소스에 익숙한 고객에게 한국식 감칠맛을 쉽게 설명합니다.",
  },
];

export const marketingCampaigns = [
  {
    name: "Gochu Paste 타코 콘텐츠",
    channel: "TikTok",
    reach: "128K",
    conversion: "3.8%",
    status: "진행",
    description: "멕시코 타코에 한국식 매운 감칠맛을 더하는 짧은 영상입니다.",
  },
  {
    name: "K-Food 첫 구매 세트",
    channel: "Instagram",
    reach: "74K",
    conversion: "2.9%",
    status: "테스트",
    description: "처음 구매하는 고객에게 3종 소스를 한 번에 소개합니다.",
  },
  {
    name: "셰프 샘플 발송",
    channel: "WhatsApp",
    reach: "42건",
    conversion: "18.0%",
    status: "대기",
    description: "현지 셰프에게 샘플을 보낸 뒤 재주문 의향을 확인합니다.",
  },
];

export const cashFlowItems = [
  {
    label: "샘플 수출 예산",
    amount: "$4,800",
    timing: "5월",
    status: "예정",
    description: "멕시코와 페루 샘플 발송에 필요한 포장비와 물류비입니다.",
  },
  {
    label: "인플루언서 테스트비",
    amount: "$1,250",
    timing: "6월",
    status: "확보",
    description: "마이크로 인플루언서 8명에게 제품과 제작비를 배정합니다.",
  },
  {
    label: "디스트리뷰터 선입금",
    amount: "$9,600",
    timing: "7월",
    status: "예상",
    description: "첫 도매 발주 전 선입금 조건으로 회수할 예정인 금액입니다.",
  },
];

export const exportProducts = [
  {
    name: "Gochu Paste",
    category: "고추 발효 소스",
    market: "멕시코",
    status: "라벨 검토",
    description: "타코, 구운 고기, 감자 요리에 맞춘 한국형 고추 베이스입니다.",
  },
  {
    name: "Ssam Sauce",
    category: "디핑 소스",
    market: "페루",
    status: "샘플 발송",
    description: "구이와 채소쌈에 어울리는 고소한 장류 풍미의 소스입니다.",
  },
  {
    name: "Sweet Soy Glaze",
    category: "간장 글레이즈",
    market: "칠레",
    status: "경로 검토",
    description: "튀김, 닭고기, 볶음면에 쓰기 쉬운 달콤한 간장 소스입니다.",
  },
];

export const networkPartners = [
  {
    name: "Casa Corea Foods",
    type: "아시안 마트",
    market: "멕시코시티",
    status: "관심",
    description: "K-Food 구매 경험이 있는 현지 아시안 식품점 후보입니다.",
  },
  {
    name: "Lima Fusion Kitchen",
    type: "외식업",
    market: "리마",
    status: "샘플",
    description: "레시피 적용 가능성이 높은 페루 퓨전 레스토랑 후보입니다.",
  },
  {
    name: "Andes K-Culture Club",
    type: "커뮤니티",
    market: "산티아고",
    status: "신규",
    description: "K-Culture 기반의 시식 이벤트 협업 후보입니다.",
  },
];

export const moduleStats = {
  valueChain: [
    { label: "관리 SKU", value: "3" },
    { label: "준비율", value: "74%" },
    { label: "리스크", value: "2" },
  ],
  branding: [
    { label: "브랜드 자료", value: "12" },
    { label: "대상 시장", value: "4" },
    { label: "검토 중", value: "3" },
  ],
  marketing: [
    { label: "캠페인", value: "6" },
    { label: "예상 도달", value: "244K" },
    { label: "리드", value: "42" },
  ],
  cashFlow: [
    { label: "예정 예산", value: "$15.6K" },
    { label: "확보 예산", value: "$1.25K" },
    { label: "예상 입금", value: "$9.6K" },
  ],
  export: [
    { label: "제품", value: "3" },
    { label: "시장", value: "3" },
    { label: "검토", value: "1" },
  ],
  network: [
    { label: "파트너", value: "9" },
    { label: "관심 리드", value: "4" },
    { label: "샘플", value: "2" },
  ],
};

export const dashboardModules = [
  {
    href: "/dashboard/value-chain",
    title: "밸류체인",
    label: "생산/물류",
    description: "원료, 생산, 포장, 출고 준비 상태를 한눈에 봅니다.",
    health: "74%",
    tone: "red",
  },
  {
    href: "/dashboard/branding",
    title: "브랜딩",
    label: "브랜드 자료",
    description: "시장별 문구, 제품 스토리, 라벨 표현을 관리합니다.",
    health: "12건",
    tone: "yellow",
  },
  {
    href: "/dashboard/marketing",
    title: "마케팅",
    label: "콘텐츠/광고",
    description: "캠페인, 채널 테스트, 인플루언서 진행 상황을 봅니다.",
    health: "244K",
    tone: "red",
  },
  {
    href: "/dashboard/cash-flow",
    title: "자금흐름",
    label: "예산/입금",
    description: "예정 지출, 확보 예산, 회수 예정 금액을 정리합니다.",
    health: "$15.6K",
    tone: "yellow",
  },
  {
    href: "/dashboard/export",
    title: "수출",
    label: "제품/시장",
    description: "SKU별 시장, 샘플, 라벨 검토 상태를 확인합니다.",
    health: "3개 시장",
    tone: "brown",
  },
  {
    href: "/dashboard/network",
    title: "네트워크",
    label: "파트너",
    description: "바이어, 유통사, 외식업, 커뮤니티 후보를 관리합니다.",
    health: "9곳",
    tone: "brown",
  },
] as const;

export const kanbanTasks = [
  {
    title: "Gochu Paste 라벨 체크",
    owner: "수출",
    status: "검토",
    priority: "높음",
    description: "전면 라벨, 영양표, 시장별 표현을 한 번 더 확인합니다.",
  },
  {
    title: "Ssam Sauce 셰프 샘플 리스트",
    owner: "네트워크",
    status: "진행",
    priority: "중간",
    description: "리마 레스토랑 후보를 정리하고 샘플 메모를 붙입니다.",
  },
  {
    title: "Sweet Soy Glaze 영상 후킹",
    owner: "마케팅",
    status: "진행",
    priority: "중간",
    description: "치킨과 볶음면 장면에 맞는 짧은 영상 문구를 준비합니다.",
  },
];

export const assistantMessages = [
  {
    role: "AI 비서",
    message: "오늘은 Gochu Paste 라벨 검토와 샘플 발송 일정 확인이 우선입니다.",
  },
  {
    role: "AI 비서",
    message: "Ssam Sauce는 페루 셰프 샘플 리스트를 먼저 정리하면 좋습니다.",
  },
  {
    role: "대표님",
    message: "오늘 처리할 일만 간단히 보여줘.",
  },
];

export const assistantActions = [
  "오늘 할 일 요약",
  "바이어 회신 초안",
  "수출 리스크 확인",
];
