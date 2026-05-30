import type { DayData, WeatherDay, ChecklistGroup, ExpenseRow } from "./types";

export const TRIP_ID = "yonago-2026";
export const TRIP_NAME = "요나고 2박 3일 여행";
export const TRIP_SHORT_NAME = "요나고 여행";
export const TRIP_SUBTITLE = "Yonago · Jun 2026";
export const TRIP_LOCATION = "돗토리현 · 일본";
export const TRIP_DESCRIPTION = "돗토리현 · 요나고 · 2026.6.1–6.3";
export const TRIP_DATES = "6.1 – 6.3";
export const TRIP_ROUTE = "인천 ↔ 요나고";

export const DAY_LABELS = ["🏯 요나고", "🏖️ 돗토리·구라요시", "🎨 아다치·귀국"];

export const EXPENSE_NOTE = `· 환율 기준: 9.44원/엔 (2026년 5월)
· 숙박 등급 및 식비 수준에 따라 크게 달라질 수 있음
· 쇼핑 예산은 개인 취향에 따라 조정`;

export const WEATHER: WeatherDay[] = [
  {
    label: "6/1 · Day 1",
    icon: "⛅",
    temp: "21° ~ 26°C",
    rain: "🌧 강수 30%",
    note: "도착 후 저녁엔 맑음",
  },
  {
    label: "6/2 · Day 2",
    icon: "🌤",
    temp: "20° ~ 27°C",
    rain: "🌧 강수 25%",
    note: "사구는 오전이 쾌적",
  },
  {
    label: "6/3 · Day 3",
    icon: "☀️",
    temp: "22° ~ 28°C",
    rain: "🌧 강수 15%",
    note: "정원 감상 최적",
  },
];

export const DAYS: DayData[] = [
  {
    day: 1,
    title: "도착 & 요나고 시내",
    subtitle: "성터 노을 · 미나토 야마 공원 · 야간 쇼핑",
    color: "#ef4444",
    items: [
      {
        id: "day1_card_0",
        time: "14:50",
        category: "move",
        name: "요나고 공항 도착",
        desc: "인천 출발 13:25 → 요나고 14:50",
        tip: "입국 수속 후 요나고공항역에서 JR 사카이선 탑승 · 요나고역까지 약 15분 · 패스 이용",
        mapLink:
          "https://www.google.com/maps/dir/?api=1&origin=Yonago+Kitaro+Airport+Japan&destination=Yonago+Station+Japan&travelmode=transit",
      },
      {
        id: "day1_card_1",
        time: "15:40",
        category: "move",
        name: "요나고역 도착 · 짐 보관",
        desc: "역내 코인로커에 큰 짐 보관 · 이후 모든 이동 몸 가볍게",
        tip: "코인로커 요금 300~500엔 · IC카드(ICOCA 등) 또는 현금 사용 · 대형 로커는 수량 한정이므로 도착 즉시 확보 권장",
      },
      {
        id: "day1_card_2",
        time: "15:50",
        category: "move",
        name: "JR 패스 실권 교환",
        desc: "요나고역 미도리노마도구치(みどりの窓口) 창구에서 교환증 → 실물 패스 발급",
        tip: "여권 지참 필수 · 소요 10~15분 · 이용 시작일 지정 가능 · 지정석 예약도 이 창구에서 가능",
      },
      {
        id: "day1_card_3",
        time: "16:10 ~ 19:00",
        category: "sight",
        name: "요나고 성터 노을",
        desc: "17세기 성벽 석축 · 전망대에서 다이센 · 일본해 · 노을 한눈에",
        tip: "입장 무료 · 요나고역에서 도보 약 15분 · 6월 일몰 19:30 전후 · 가는 길에 상점가 통과",
      },
      {
        id: "day1_card_4",
        time: "19:00 ~ 19:30",
        category: "sight2",
        name: "미나토 야마 공원",
        desc: "항구 옆 수변 공원 · 저녁 산책 · 나카우미 호수 야경",
        tip: "성터에서 도보 약 10분 · 입장 무료 · 밤에도 산책하기 좋은 공원",
      },
      {
        id: "day1_card_5",
        time: "19:30",
        category: "food",
        name: "요나고 역전 이자카야",
        desc: "돗토리 지방주(地酒) + 일본해 해산물",
        tip: "요나고역 주변 상점가에 이자카야 다수 · 하마모토스이산(浜本水産) 계열 가게 추천",
      },
      {
        id: "day1_card_6",
        time: "21:00",
        category: "sight",
        name: "메가 돈키호테 요나고점",
        desc: "식품 · 잡화 · 화장품 · 기념품 한번에 · 심야까지 영업",
        tip: "심야 영업 · 면세 카운터 이용 시 소비세 환급 가능",
      },
      {
        id: "day1_card_7",
        time: "22:00",
        category: "move",
        name: "편의점 들르기",
        desc: "내일 아침 간식 · 음료 · 생필품 보충",
        tip: "패밀리마트 · 세븐일레븐 · 로손 모두 역 근처에 있음",
      },
      {
        id: "day1_card_8",
        time: "밤",
        category: "sleep",
        name: "요나고 시내 호텔",
        desc: "요나고역 근처 숙소",
        tip: "요나고역 근처 숙소면 다음날 아침 일찍 JR 탑승이 편리",
      },
    ],
    mapSpots: [
      {
        lat: 35.4922,
        lng: 133.2364,
        emoji: "✈️",
        name: "요나고 공항 (기타로공항)",
        desc: "인천 출발 → 입국 후 JR 사카이선 탑승",
      },
      {
        lat: 35.4281,
        lng: 133.3309,
        emoji: "🚉",
        name: "요나고역 · JR 패스 등록",
        desc: "짐 보관 후 미도리노마도구치에서 패스 실권 교환",
      },
      {
        lat: 35.4269,
        lng: 133.3293,
        emoji: "🏯",
        name: "요나고 성터",
        desc: "다이센 · 일본해 · 노을 전망 · 무료 입장",
      },
      {
        lat: 35.4277,
        lng: 133.3213,
        emoji: "🌿",
        name: "미나토 야마 공원",
        desc: "항구 옆 수변 공원 · 나카우미 호수 야경",
      },
      {
        lat: 35.429,
        lng: 133.335,
        emoji: "🛒",
        name: "메가 돈키호테 요나고",
        desc: "심야 영업 · 면세 쇼핑",
      },
    ],
  },
  {
    day: 2,
    title: "돗토리 사구 · 구라요시 · 코난 마을 · 온천",
    subtitle: "JR 산인본선 · 모래 사막 → 도조 거리 → 코난 성지 → 해안 온천",
    color: "#f59e0b",
    items: [
      {
        id: "day2_card_0",
        time: "07:30 → 08:30",
        category: "move",
        name: "요나고역 → 돗토리역",
        desc: "JR 산인본선 · 약 1시간 · 패스 이용",
        tip: "특급 슈퍼 마쓰카제 이용 시 약 50분 · Yahoo!乗換 앱으로 시간표 미리 확인",
        mapLink:
          "https://www.google.com/maps/dir/?api=1&origin=Yonago+Station+Japan&destination=Tottori+Station+Japan&travelmode=transit",
      },
      {
        id: "day2_card_1",
        time: "08:40 → 09:00",
        category: "move",
        name: "돗토리역 → 돗토리 사구",
        desc: "노선버스 101번 · 약 20분 · 사구센터前 하차",
        tip: "편도 약 300엔 · IC카드 이용 가능 · 배차 간격 15~20분",
        mapLink:
          "https://www.google.com/maps/dir/?api=1&origin=Tottori+Station+Japan&destination=Tottori+Sand+Dunes+Japan&travelmode=transit",
      },
      {
        id: "day2_card_2",
        time: "09:00 ~ 11:00",
        category: "sight",
        name: "돗토리 사구 (鳥取砂丘)",
        desc: "동서 2.4km · 남북 1km · 일본 최대 모래 언덕\n▸ 사구 능선 트레킹 (30~60분)\n▸ 낙타 탑승 체험 (유료 · 약 1,500엔)\n▸ 모래 미술관 Sand Museum (1,000엔)",
        tip: "모래 언덕 정상에서 일본해 전망이 하이라이트 · 여름엔 운동화 권장 · 오전 방문으로 붐비기 전 여유롭게",
      },
      {
        id: "day2_card_3",
        time: "11:10 → 11:40",
        category: "move",
        name: "돗토리역 → 구라요시역",
        desc: "JR 산인본선 · 약 30분 · 패스 이용",
        tip: "사구센터前 버스 → 돗토리역 약 20분 · 열차 시간에 맞춰 여유 있게 이동",
        mapLink:
          "https://www.google.com/maps/dir/?api=1&origin=Tottori+Station+Japan&destination=Kurayoshi+Station+Japan&travelmode=transit",
      },
      {
        id: "day2_card_4",
        time: "11:45 ~ 13:30",
        category: "sight",
        name: "시라카베 도조군 (白壁土蔵群)",
        desc: "에도~메이지시대 흰 벽 창고 거리 · 구라요시의 리틀 교토\n▸ 도보 산책 · 사진 명소 · 수로 옆 고즈넉한 가로수길",
        tip: "구라요시역에서 도보 약 10분 · 입장 무료 · 아카가와 수로 · 주변 카페에서 점심 가능",
      },
      {
        id: "day2_card_5",
        time: "12:00",
        category: "food",
        name: "구라요시 시내 점심",
        desc: "도조 거리 주변 카페·식당 · 현지 정식 or 구라요시 소바",
        tip: "시라카베도조군 주변에 소규모 카페·식당 다수",
      },
      {
        id: "day2_card_6",
        time: "13:35 → 13:55",
        category: "move",
        name: "구라요시역 → 유라역 (코난 마을)",
        desc: "JR 산인본선 · 약 20분 · 패스 이용",
        tip: "由良駅(유라역) 하차 · 역 자체가 코난 테마로 꾸며져 있어 내리는 순간부터 분위기",
        mapLink:
          "https://www.google.com/maps/dir/?api=1&origin=Kurayoshi+Station+Japan&destination=Yura+Station+Tottori+Japan&travelmode=transit",
      },
      {
        id: "day2_card_7",
        time: "14:00 ~ 15:30",
        category: "sight2",
        name: "코난 마을 (名探偵コナン聖地)",
        desc: "명탐정 코난 작가 아오야마 고쇼의 고향 · 유라역 주변\n▸ 코난 동상 포토존\n▸ 코난 기념관 (무료 입장)\n▸ 코난 굿즈 기념품 가게",
        tip: "역 주변 마을 전체가 코난 테마 · 기념품 가게 규모 작으므로 여유 있게",
      },
      {
        id: "day2_card_8",
        time: "15:40 → 16:20",
        category: "move",
        name: "유라역 → 요나고역",
        desc: "JR 산인본선 · 약 40분 · 패스 이용",
        mapLink:
          "https://www.google.com/maps/dir/?api=1&origin=Yura+Station+Tottori+Japan&destination=Yonago+Station+Japan&travelmode=transit",
      },
      {
        id: "day2_card_9",
        time: "16:30 → 16:50",
        category: "move",
        name: "요나고역 → 가이케 온천",
        desc: "노선버스 · 약 20분",
        tip: "요나고역 앞 버스 터미널에서 가이케 온천행 탑승 · 편도 약 340엔",
        mapLink:
          "https://www.google.com/maps/dir/?api=1&origin=Yonago+Station+Japan&destination=Kaike+Onsen+Japan&travelmode=transit",
      },
      {
        id: "day2_card_10",
        time: "17:00 ~ 18:30",
        category: "hot",
        name: "가이케 온천 당일 입욕",
        desc: "일본해를 바라보는 해안 온천 · 하루 이동 피로 해소",
        tip: "당일 입욕 가능 료칸 다수 · 700~1,200엔 · 사전 전화 확인 권장",
      },
      {
        id: "day2_card_11",
        time: "19:00",
        category: "food",
        name: "요나고 시내 저녁 식사",
        desc: "돗토리 와규 · 오징어회 · 지역 이자카야",
        tip: "온천 후 식욕이 살아나면 돗토리 와규 구이 추천",
      },
      {
        id: "day2_card_12",
        time: "밤",
        category: "sleep",
        name: "요나고 시내 숙소 (연박)",
        desc: "요나고역 근처 숙소",
      },
    ],
    mapSpots: [
      {
        lat: 35.4281,
        lng: 133.3309,
        emoji: "🚃",
        name: "요나고역 · 출발",
        desc: "JR 산인본선으로 돗토리역 향해 출발",
      },
      {
        lat: 35.5018,
        lng: 134.2368,
        emoji: "🚉",
        name: "돗토리역",
        desc: "버스 환승 후 사구로 이동",
      },
      {
        lat: 35.5365,
        lng: 134.2295,
        emoji: "🏜",
        name: "돗토리 사구",
        desc: "일본 최대 모래 언덕 · 낙타 체험 · 모래 미술관",
      },
      {
        lat: 35.4317,
        lng: 133.8239,
        emoji: "🏛",
        name: "구라요시역 · 시라카베도조군",
        desc: "에도~메이지시대 흰 벽 창고 거리",
      },
      {
        lat: 35.4789,
        lng: 133.6631,
        emoji: "🔍",
        name: "유라역 · 코난 마을",
        desc: "명탐정 코난 작가 고향",
      },
      {
        lat: 35.4579,
        lng: 133.3634,
        emoji: "♨️",
        name: "가이케 온천",
        desc: "해안 온천 · 당일 입욕",
      },
    ],
  },
  {
    day: 3,
    title: "아다치 미술관 · 귀국",
    subtitle: "일본 정원 1위 · 야스기역 → 요나고 공항 → 귀갓길",
    color: "#22c55e",
    items: [
      {
        id: "day3_card_0",
        time: "09:00 → 09:15",
        category: "move",
        name: "요나고역 → 야스기역",
        desc: "JR 산인본선 · 약 15분 · 패스 이용",
        tip: "야스기역(安来駅)은 시마네현 · 요나고에서 서쪽으로 약 15분",
        mapLink:
          "https://www.google.com/maps/dir/?api=1&origin=Yonago+Station+Japan&destination=Yasugi+Station+Japan&travelmode=transit",
      },
      {
        id: "day3_card_1",
        time: "09:20 → 09:40",
        category: "move",
        name: "야스기역 → 아다치 미술관",
        desc: "미술관 무료 셔틀버스 · 약 20분",
        tip: "야스기역 앞에서 무료 탑승 · 열차 도착 시간에 맞춰 운행 · 약 30분 간격",
        mapLink:
          "https://www.google.com/maps/dir/?api=1&origin=Yasugi+Station+Japan&destination=Adachi+Museum+of+Art+Japan&travelmode=transit",
      },
      {
        id: "day3_card_2",
        time: "09:40 ~ 12:30",
        category: "sight2",
        name: "아다치 미술관 (足立美術館)",
        desc: "미국 원예 잡지 20년 연속 일본 정원 1위 · 요코야마 다이칸 일본화 소장\n▸ 생케이엔 정원 창문 액자 감상\n▸ 관내 카페에서 정원 뷰 휴식",
        tip: "⚠️ 입장료 2,300엔 · 영업 09:00~17:30 (하절기) · 1.5~2시간 소요",
      },
      {
        id: "day3_card_3",
        time: "12:00",
        category: "food",
        name: "미술관 내 레스토랑",
        desc: "정원을 바라보며 점심 · 현지 정식 or 간단 카페 메뉴",
        tip: "창 너머 정원 전망 · 12:30 이전 퇴관 목표",
      },
      {
        id: "day3_card_4",
        time: "12:30 → 13:15",
        category: "move",
        name: "아다치 미술관 → 야스기역 → 요나고역",
        desc: "셔틀버스 약 20분 + JR 산인본선 약 15분 · 패스 이용",
        tip: "요나고역에서 코인로커 짐 찾기 · 공항 이동 전 마지막 편의점 들르기",
        mapLink:
          "https://www.google.com/maps/dir/?api=1&origin=Adachi+Museum+of+Art+Japan&destination=Yonago+Station+Japan&travelmode=transit",
      },
      {
        id: "day3_card_5",
        time: "13:30 → 13:45",
        category: "move",
        name: "요나고역 → 요나고공항역",
        desc: "JR 사카이선 · 약 15분 · 패스 이용",
        tip: "요나고공항역 하차 후 도보 약 5분으로 터미널 도착",
        mapLink:
          "https://www.google.com/maps/dir/?api=1&origin=Yonago+Station+Japan&destination=Yonago+Airport+Station+Japan&travelmode=transit",
      },
      {
        id: "day3_card_6",
        time: "13:50",
        category: "move",
        name: "요나고 공항 도착 · 출국 수속",
        desc: "체크인 · 수하물 위탁 · 출국심사 · 탑승 대기",
        tip: "국제선 수속은 출발 1시간 30분 전 마감 기준 · 면세 구역 쇼핑",
      },
      {
        id: "day3_card_7",
        time: "15:50 → 17:45",
        category: "move",
        name: "요나고 출발 → 한국 도착",
        desc: "요나고 공항 15:50 출발 · 인천 17:45 도착",
      },
    ],
    mapSpots: [
      {
        lat: 35.4281,
        lng: 133.3309,
        emoji: "🚃",
        name: "요나고역 · 출발",
        desc: "야스기역으로 출발",
      },
      {
        lat: 35.428,
        lng: 133.2593,
        emoji: "🚉",
        name: "야스기역",
        desc: "아다치미술관 무료 셔틀버스 탑승",
      },
      {
        lat: 35.38,
        lng: 133.194,
        emoji: "🎨",
        name: "아다치 미술관",
        desc: "일본 정원 1위 · 입장 2,300엔",
      },
      {
        lat: 35.4922,
        lng: 133.2364,
        emoji: "✈️",
        name: "요나고 공항 출발",
        desc: "귀국 · 인천행 탑승",
      },
    ],
  },
];

export const CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    label: "필수 서류",
    items: [
      { id: "checklist_0", label: "여권", note: "유효기간 6개월 이상" },
      { id: "checklist_1", label: "항공권 e-티켓", note: "출력 or 캡처 저장" },
      { id: "checklist_2", label: "숙소 예약 확인서" },
      { id: "checklist_3", label: "여행자 보험 가입" },
    ],
  },
  {
    label: "금융",
    items: [
      { id: "checklist_4", label: "엔화 환전", note: "최소 5만엔 권장" },
      {
        id: "checklist_5",
        label: "해외 결제 신용카드",
        note: "비자 or 마스터",
      },
      { id: "checklist_6", label: "비상용 체크카드" },
    ],
  },
  {
    label: "전자기기",
    items: [
      { id: "checklist_7", label: "스마트폰 충전기" },
      { id: "checklist_8", label: "보조배터리", note: "기내 반입만 가능" },
      {
        id: "checklist_9",
        label: "일본 eSIM 개통",
        note: "출발 전 앱에서 설치",
      },
      { id: "checklist_10", label: "변환 플러그", note: "일본 A타입 · 110V" },
    ],
  },
  {
    label: "의류",
    items: [
      {
        id: "checklist_11",
        label: "여름 옷 (2~3벌)",
        note: "통기성 좋은 소재",
      },
      { id: "checklist_12", label: "가벼운 겉옷", note: "실내 냉방 대비" },
      {
        id: "checklist_13",
        label: "트레킹화 or 운동화",
        note: "사구 트레킹 대비",
      },
      { id: "checklist_14", label: "샌들" },
      {
        id: "checklist_15",
        label: "접이식 우산 or 우비",
        note: "여름 소나기 대비",
      },
      {
        id: "checklist_16",
        label: "온천 타월",
        note: "가이케 온천 · 료칸 대여 가능하나 개인 지참 권장",
      },
    ],
  },
  {
    label: "의약품 · 위생",
    items: [
      { id: "checklist_17", label: "상비약", note: "소화제·진통제·지사제" },
      { id: "checklist_18", label: "선크림", note: "SPF 50 이상 권장" },
      { id: "checklist_19", label: "모기 기피제", note: "여름철 필수" },
      { id: "checklist_20", label: "개인 세면도구" },
    ],
  },
];

export const EXPENSE_ROWS: ExpenseRow[] = [
  {
    id: "budget_0",
    label: "✈️ 항공권 (왕복)",
    estimate: "20~35만원",
  },
  {
    id: "budget_1",
    label: "🏨 숙박 (2박)",
    estimate: "10,000~18,000엔 (약 9.4~17만원)",
    subRows: [{ label: "요나고 시내 호텔 1박 5,000~9,000엔 기준" }],
  },
  {
    id: "budget_2",
    label: "🚃 교통비 (JR 패스)",
    estimate: "4,600~5,600엔 (약 4.3~5.3만원)",
    subRows: [
      {
        label:
          "JR 산인 지역 패스 약 4,000엔 · 사구 버스 왕복 약 600엔 · 가이케 온천 버스 왕복 약 680엔",
      },
    ],
  },
  {
    id: "budget_3",
    label: "🍜 식비 (3일)",
    estimate: "11,000~16,000엔 (약 10.4~15.1만원)",
    subRows: [{ label: "하루 평균 3,700~5,300엔 · 3끼 + 간식" }],
  },
  {
    id: "budget_4",
    label: "♨️ 관광 · 체험",
    estimate: "4,000~5,500엔 (약 3.8~5.2만원)",
    subRows: [
      {
        label:
          "아다치미술관 2,300엔 · 가이케 온천 700~1,200엔 · 모래 미술관 1,000엔(선택) · 낙타 탑승 1,500엔(선택)",
      },
    ],
  },
  {
    id: "budget_5",
    label: "🛍 쇼핑 · 기념품",
    estimate: "5,000~10,000엔 (약 4.7~9.4만원)",
    subRows: [{ label: "코난 굿즈 · 돗토리 특산품 등" }],
  },
];
