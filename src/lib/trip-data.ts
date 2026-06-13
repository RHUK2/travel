import type {
  AirportBlock,
  ChecklistGroup,
  DayData,
  ExpenseRow,
  TravelTip,
} from "./types";

export const TRIP_NAME = "여행 이름";
export const TRIP_SHORT_NAME = "여행";
export const TRIP_SUBTITLE = "Destination · Month Year";
export const TRIP_LOCATION = "목적지 · 국가";
export const TRIP_DESCRIPTION = "목적지 · YYYY.MM.DD–MM.DD";
export const TRIP_DATES = "MM.DD – MM.DD";
export const TRIP_ROUTE = "출발지 ↔ 목적지";
export const TRIP_FOOTER = "목적지 · N박 N일 여행";

export const EXPENSE_NOTE = `· 숙박 등급 및 식비 수준에 따라 크게 달라질 수 있음
· 쇼핑 예산은 개인 취향에 따라 조정`;

export const DAYS: DayData[] = [
  {
    day: 1,
    title: "도착 & 시내 탐방",
    subtitle: "공항 도착 · 체크인 · 첫날 저녁",
    color: "#ef4444",
    items: [
      {
        id: "item_0",
        category: "move",
        name: "목적지 공항 도착",
        desc: "출발지 출발 → 목적지 도착",
        badge: "이동 수단",
        tip: "입국 수속 후 숙소로 이동. 이동 수단 사전 확인.",
      },
      {
        id: "item_1",
        category: "move",
        name: "호텔 체크인 · 짐 정리",
        desc: "숙소 체크인 후 짐 보관 or 정리",
        badge: "체크인",
        tip: "체크인 가능 시간 미리 확인. 이른 도착 시 짐만 먼저 맡기고 외출 가능.",
      },
      {
        id: "item_2",
        category: "sight",
        name: "남산 N서울타워",
        desc: "서울 대표 랜드마크 · 전망대 & 남산공원",
        badge: "관광",
        tip: "케이블카 or 남산 순환버스 이용. 야경 명소로 일몰 전후 방문 추천.",
        mapLink: "https://maps.google.com/?q=남산+N서울타워",
      },
      {
        id: "item_3",
        category: "food",
        name: "저녁 식사",
        desc: "현지 맛집 또는 숙소 근처 식당",
        badge: "저녁",
      },
      {
        id: "item_4",
        category: "sleep",
        name: "숙소",
        desc: "첫날 숙박",
      },
    ],
    mapSpots: [
      {
        lat: 37.5512,
        lng: 126.9882,
        emoji: "🗼",
        name: "남산 N서울타워",
        desc: "서울 대표 전망 명소 · 남산공원",
      },
    ],
  },
  {
    day: 2,
    title: "주요 관광지",
    subtitle: "오전 · 오후 · 저녁 일정",
    color: "#f59e0b",
    items: [
      {
        id: "item_5",
        category: "sight",
        name: "오전 관광",
        desc: "주요 명소 방문",
        badge: "관광",
      },
      {
        id: "item_6",
        category: "food",
        name: "점심 식사",
        desc: "현지 음식 체험",
        badge: "점심",
      },
      {
        id: "item_7",
        category: "sight",
        name: "오후 관광",
        desc: "추가 명소 또는 자유 시간",
        badge: "관광",
      },
      {
        id: "item_8",
        category: "food",
        name: "저녁 식사",
        desc: "현지 레스토랑",
        badge: "저녁",
      },
      {
        id: "item_9",
        category: "sleep",
        name: "숙소",
        desc: "둘째날 숙박",
      },
    ],
    mapSpots: [],
  },
  {
    day: 3,
    title: "마지막 관광 & 귀국",
    subtitle: "오전 관광 · 공항 이동 · 귀국",
    color: "#22c55e",
    items: [
      {
        id: "item_10",
        category: "sight",
        name: "오전 관광",
        desc: "마지막 명소 방문 또는 쇼핑",
        badge: "관광",
      },
      {
        id: "item_11",
        category: "food",
        name: "점심 식사",
        desc: "귀국 전 마지막 현지 식사",
        badge: "점심",
      },
      {
        id: "item_12",
        category: "move",
        name: "공항 이동",
        desc: "숙소 체크아웃 후 공항으로 이동",
        badge: "이동 수단",
        tip: "국제선 수속은 출발 2시간 전까지. 짐 찾기 후 이동 수단 확인.",
      },
      {
        id: "item_13",
        category: "move",
        name: "출국 수속 & 귀국",
        desc: "체크인 · 보안 검색 · 출국심사 · 탑승",
        badge: "귀국",
      },
    ],
    mapSpots: [],
  },
];

export const CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    section: "해외",
    label: "필수 서류",
    items: [
      { id: "checklist_0", label: "여권", note: "유효기간 6개월 이상" },
      { id: "checklist_1", label: "항공권 e-티켓", note: "출력 or 캡처 저장" },
      { id: "checklist_2", label: "숙소 예약 확인서" },
      { id: "checklist_3", label: "여행자 보험 가입" },
    ],
  },
  {
    section: "해외",
    label: "금융",
    items: [
      { id: "checklist_4", label: "현지 화폐 환전" },
      {
        id: "checklist_5",
        label: "해외 결제 신용카드",
        note: "비자 or 마스터",
      },
      { id: "checklist_6", label: "비상용 체크카드" },
    ],
  },
  {
    section: "국내",
    label: "전자기기",
    items: [
      { id: "checklist_7", label: "스마트폰 충전기" },
      { id: "checklist_8", label: "보조배터리", note: "기내 반입만 가능" },
      {
        id: "checklist_9",
        label: "현지 유심 / eSIM",
        note: "출발 전 미리 준비",
      },
      {
        id: "checklist_10",
        label: "변환 플러그",
        note: "국가별 규격 사전 확인",
      },
    ],
  },
  {
    section: "국내",
    label: "의류",
    items: [
      {
        id: "checklist_11",
        label: "옷 (일수에 맞게)",
        note: "현지 날씨 기준",
      },
      { id: "checklist_12", label: "가벼운 겉옷", note: "실내 냉방 대비" },
      {
        id: "checklist_13",
        label: "편한 신발",
        note: "많이 걷는 일정 대비",
      },
      {
        id: "checklist_14",
        label: "접이식 우산 or 우비",
      },
    ],
  },
  {
    section: "국내",
    label: "의약품 · 위생",
    items: [
      { id: "checklist_15", label: "상비약", note: "소화제·진통제·지사제" },
      { id: "checklist_16", label: "선크림", note: "SPF 50 이상 권장" },
      { id: "checklist_17", label: "모기 기피제" },
      { id: "checklist_18", label: "개인 세면도구" },
    ],
  },
];

export const EXPENSE_ROWS: ExpenseRow[] = [
  {
    id: "budget_0",
    label: "✈️ 항공권 (왕복)",
    estimate: "–",
  },
  {
    id: "budget_1",
    label: "🏨 숙박",
    estimate: "–",
    subRows: [{ label: "숙박 일수 × 1박 단가" }],
  },
  {
    id: "budget_2",
    label: "🚃 교통비",
    estimate: "–",
    subRows: [{ label: "공항 이동 · 시내 교통 · 교통패스 등" }],
  },
  {
    id: "budget_3",
    label: "🍜 식비",
    estimate: "–",
    subRows: [{ label: "하루 평균 식비 × 일수 · 3끼 + 간식" }],
  },
  {
    id: "budget_4",
    label: "🎫 관광 · 체험",
    estimate: "–",
    subRows: [{ label: "입장료 · 체험 비용 합계" }],
  },
  {
    id: "budget_5",
    label: "🛍 쇼핑 · 기념품",
    estimate: "–",
  },
  {
    id: "budget_6",
    label: "🗂 기타 비용",
    estimate: "자유 입력",
  },
];

export const TRAVEL_TIPS: TravelTip[] = [
  {
    title: "🛂 사전 입국 신청 확인",
    body: "목적지에 따라 사전 입국 허가(e-비자, ETA 등)가 필요할 수 있음. 출발 최소 2주 전에 확인 및 신청.",
  },
  {
    title: "📋 현지 면세 한도 확인",
    body: "주류·담배·식품 등 반입 가능 수량은 국가마다 다름. 초과 시 세관 신고 또는 압수될 수 있으므로 사전 확인 필수.",
  },
  {
    title: "💰 현지 화폐 잔돈 처리",
    body: "귀국 전 공항·편의점·자판기에서 소진 권장. 동전은 국내 환전 불가한 경우가 많음.",
  },
  {
    title: "🆘 비상 연락처 저장",
    body: "주재국 대한민국 대사관·영사관 번호와 현지 긴급번호(경찰·구급)를 스마트폰에 미리 저장.",
  },
];

export const AIRPORT_BLOCKS: AirportBlock[] = [
  {
    title: "🇰🇷 국내 공항 출국 절차 (한국 출발)",
    steps: [
      {
        num: 1,
        tag: "공항 도착",
        title: "출발 2시간 30분~3시간 전 도착",
        body: "터미널 확인 필수 — 항공사마다 다름. 사전에 공항 이동 시간 확인.",
      },
      {
        num: 2,
        tag: "체크인",
        title: "탑승 수속 + 수하물 위탁",
        body: "카운터 줄 서기 또는 셀프 키오스크로 탑승권 발급. 보조배터리·라이터는 기내 직접 소지.",
      },
      {
        num: 3,
        tag: "보안 검색",
        title: "출국장 → 보안 검색대 통과",
        body: "액체류 100ml 이하 + 지퍼백 포장. 노트북·태블릿은 가방에서 꺼내기.",
      },
      {
        num: 4,
        tag: "출국심사",
        title: "자동화 게이트 (스마트 출입국)",
        body: "만 19세 이상 내국인은 자동화 게이트 이용 가능 — 여권 스캔 후 바로 통과.",
        tip: "사전 등록 없이 당일 여권으로 바로 이용 가능.",
      },
      {
        num: 5,
        tag: "면세 & 탑승",
        title: "면세점 이용 후 탑승 게이트 이동",
        body: "공항 규모에 따라 게이트까지 이동 시간 여유 있게 확보.",
      },
    ],
  },
  {
    title: "🛬 현지 공항 입국 절차",
    steps: [
      {
        num: 1,
        tag: "검역",
        title: "검역 확인 후 통과",
        body: "사전 등록 서비스 이용 시 QR 제시로 신속 통과.",
      },
      {
        num: 2,
        tag: "입국심사",
        title: "여권 심사 + 지문·사진 촬영",
        body: "외국인 심사대 줄 서기 → 여권 제출 → 양 검지 지문 채취 → 카메라 촬영.",
        tip: "소요시간 5~20분. 공항 규모에 따라 대기 시간 상이.",
      },
      {
        num: 3,
        tag: "수하물",
        title: "짐 찾기",
        body: "전광판에서 항공편 벨트 번호 확인 후 수취.",
      },
      {
        num: 4,
        tag: "세관",
        title: "세관 신고",
        body: "신고 물품 없으면 면세 통로(녹색 라인)로 통과. 현지 면세 한도 사전 확인 권장.",
      },
      {
        num: 5,
        tag: "도착 로비",
        title: "입국 완료 → 시내 이동",
        body: "대중교통 또는 택시·셔틀버스 이용. 사전에 시내 이동 수단 확인.",
      },
    ],
  },
  {
    title: "🛫 현지 공항 출국 절차",
    steps: [
      {
        num: 1,
        tag: "공항 도착",
        title: "출발 2시간 전까지 공항 도착",
        body: "국제선 체크인 마감은 출발 1시간 30분 전. 여유 있게 이동.",
      },
      {
        num: 2,
        tag: "체크인",
        title: "탑승 수속 + 수하물 위탁",
        body: "여권 + 항공권(e-티켓 캡처 or 앱) 제시. 보조배터리·라이터는 기내 직접 소지.",
      },
      {
        num: 3,
        tag: "보안 검색",
        title: "보안 검색대 통과",
        body: "액체류 100ml 이하 지퍼백 포장. 국가마다 검색 방식이 다를 수 있음.",
      },
      {
        num: 4,
        tag: "출국심사",
        title: "여권 + 탑승권 제시",
        body: "외국인 유인 심사대 또는 자동화 게이트 이용. 지문 채취 후 출국 스탬프.",
      },
      {
        num: 5,
        tag: "탑승 대기",
        title: "면세 구역 · 탑승",
        body: "탑승 시작 15분 전까지 게이트 도착. 현지 화폐 잔돈은 출국 전 소진.",
      },
    ],
  },
  {
    title: "🇰🇷 국내 공항 입국 절차 (한국 도착)",
    steps: [
      {
        num: 1,
        tag: "입국심사",
        title: "자동입국심사 or 유인 심사대",
        body: "한국인은 자동화 게이트(스마트 출입국) 이용 가능. 소요 1~3분.",
      },
      {
        num: 2,
        tag: "수하물",
        title: "수하물 벨트에서 짐 찾기",
        body: "도착 모니터에서 편명으로 벨트 번호 확인.",
      },
      {
        num: 3,
        tag: "세관 신고",
        title: "세관 신고 (해외 구매 물품)",
        body: "면세 한도: 미화 800달러 이하. 초과 시 세관 신고서 작성.",
        tip: "자진신고 키오스크로 신고하면 30% 관세 감면.",
      },
      {
        num: 4,
        tag: "입국 완료",
        title: "입국장 → 귀가",
        body: "대중교통 또는 버스·택시 이용. 사전에 귀가 수단 확인.",
      },
    ],
  },
];
