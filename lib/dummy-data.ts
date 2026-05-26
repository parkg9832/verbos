export const projectStatuses = [
  "진행중",
  "진행예정",
  "검토중",
  "완료",
  "보류",
] as const;

export const projectPriorities = ["높음", "보통", "낮음"] as const;

export type ProjectStatus = (typeof projectStatuses)[number];
export type ProjectPriority = (typeof projectPriorities)[number];

export interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  client: string;
  assignee: string;
  dateRange: string;
  category: string;
  priority: ProjectPriority;
  contact: string;
  budget: string;
  nextAction: string;
  memo: string;
  tasks: string[];
  schedule: string[];
}

export const initialProjects: Project[] = [
  {
    id: "project-001",
    title: "AOC OA 수출 제안",
    status: "진행중",
    client: "AOC Foods",
    assignee: "윤은송",
    dateRange: "2026.05.12 - 2026.06.13",
    category: "수출 영업",
    priority: "높음",
    contact: "Mariana Lopez",
    budget: "$18,000",
    nextAction: "멕시코용 가격표와 샘플 발송 조건 확정",
    memo: "바이어가 매운맛 단계와 병당 MOQ를 우선 확인하고 있습니다.",
    tasks: ["샘플 구성표 확정", "영문 제품 소개서 전달", "WhatsApp 후속 연락"],
    schedule: ["5/27 바이어 화상 미팅", "6/03 1차 견적 회신"],
  },
  {
    id: "project-002",
    title: "Wina Market 영업 자동화",
    status: "진행예정",
    client: "Wina Market",
    assignee: "문오",
    dateRange: "2026.06.01 - 2026.06.20",
    category: "CRM 구축",
    priority: "보통",
    contact: "Carlos Mendez",
    budget: "$7,500",
    nextAction: "리드 상태값과 담당자 배정 기준 정리",
    memo: "초기 MVP에서는 고객, 프로젝트, 일정 데이터 흐름만 보여주면 충분합니다.",
    tasks: ["리드 단계 정의", "담당자 권한 정리", "대시보드 화면 검수"],
    schedule: ["6/02 요구사항 확인", "6/10 화면 리뷰"],
  },
  {
    id: "project-003",
    title: "TongO Retail 캠페인",
    status: "진행중",
    client: "TongO Retail",
    assignee: "김서연",
    dateRange: "2026.05.19 - 2026.07.05",
    category: "마케팅",
    priority: "높음",
    contact: "Ana Torres",
    budget: "$24,000",
    nextAction: "릴스 소재 3종과 인플루언서 후보 리스트 승인",
    memo: "K-Food 입문자를 대상으로 현지 음식과 소스 사용 장면을 연결합니다.",
    tasks: ["릴스 콘티 작성", "마이크로 인플루언서 12명 선별", "광고 예산 배분"],
    schedule: ["5/30 콘텐츠 시안 제출", "6/07 1차 캠페인 시작"],
  },
  {
    id: "project-004",
    title: "PartnerO Kitchen HORECA 납품",
    status: "검토중",
    client: "PartnerO Kitchen",
    assignee: "정다은",
    dateRange: "2026.05.26 - 2026.06.30",
    category: "B2B 납품",
    priority: "보통",
    contact: "Jorge Salazar",
    budget: "$12,400",
    nextAction: "업소용 패키지 단가와 유통기한 자료 검토",
    memo: "레스토랑 테스트용 2kg 파우치 요청이 있어 생산 가능 여부 확인이 필요합니다.",
    tasks: ["업소용 SKU 원가 확인", "라벨 표기 항목 검토", "테스트 키친 일정 조율"],
    schedule: ["5/29 생산팀 확인", "6/05 시식 테스트"],
  },
  {
    id: "project-005",
    title: "SO Living 2026 운영",
    status: "보류",
    client: "SO Living",
    assignee: "박지훈",
    dateRange: "2026.06.14 - 2026.08.01",
    category: "운영",
    priority: "낮음",
    contact: "Lucia Fernandez",
    budget: "$5,200",
    nextAction: "파트너 내부 예산 승인 대기",
    memo: "진행 가능성은 있으나 회신 속도가 느려 우선순위를 낮게 둡니다.",
    tasks: ["월 1회 상태 확인", "계약서 초안 보관", "예산 승인 후 재가동"],
    schedule: ["6/14 상태 확인"],
  },
  {
    id: "project-006",
    title: "Noah Trade 오프라인 행사",
    status: "완료",
    client: "Noah Trade",
    assignee: "이하린",
    dateRange: "2026.04.20 - 2026.05.15",
    category: "오프라인",
    priority: "보통",
    contact: "Miguel Rojas",
    budget: "$9,800",
    nextAction: "성과 리포트 공유 및 재주문 조건 협의",
    memo: "시식 행사 반응은 좋았고, 단맛이 있는 매운 소스 선호가 높았습니다.",
    tasks: ["성과 리포트 발송", "재주문 조건 협상", "후기 콘텐츠 정리"],
    schedule: ["5/28 결과 공유"],
  },
];

export function createEmptyProject(): Project {
  return {
    id: `project-${Date.now()}`,
    title: "",
    status: "진행예정",
    client: "",
    assignee: "",
    dateRange: "",
    category: "프로젝트",
    priority: "보통",
    contact: "",
    budget: "",
    nextAction: "",
    memo: "",
    tasks: [],
    schedule: [],
  };
}
