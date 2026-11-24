export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | { type: "diagram"; id: DiagramId; caption: string }
  | { type: "note"; text: string }

export type DiagramId =
  | "a-failure-split"
  | "a-recovery-flow"
  | "a-daily"
  | "e-deploy-paths"
  | "d-two-causes"

export type Section = {
  id: string
  label: string
  blocks: Block[]
}

export type Metric = {
  // change: 전 → 후 비교, fact: 비교가 아닌 사실 두 개(예: 기간, 인원)
  kind?: "change" | "fact"
  label: string
  before: string
  after: string
  note: string
}

export type PortfolioCase = {
  slug: string
  index: string
  title: string
  summary: string
  org: string
  period: string
  role: string
  stack: string
  metric: Metric
  sections: Section[]
}

export const PROFILE = {
  name: "박상준",
  role: "프론트엔드 개발자",
  tagline: "React Native 앱과 웹을 만드는 프론트엔드 개발자입니다.",
  intro:
    "굿닥과 긴트에서 일했습니다. 그중 세 건을 적었습니다. 로그인이 풀리던 문제, 앱 구조를 바꾼 결정, 4시간 안에 죽던 지도 앱입니다.",
  links: [
    { label: "GitHub", href: "https://github.com/sangjuun-park" },
    { label: "Email", href: "mailto:parksangjun1363@gmail.com" },
    { label: "Blog", href: "/" },
  ],
}

export const CASES: PortfolioCase[] = [
  {
    slug: "force-logout",
    index: "01",
    title: "원인 모를 강제 로그아웃, 계측부터 시작해 하루 1,213건을 1건으로",
    summary:
      "로그인이 풀리는 이유를 아무도 몰랐습니다. 로그아웃이 일어나는 경로와 실패 유형을 먼저 기록해 원인을 좁히고, 서버 배포 없이 앱 쪽 복구 경로로 해결했습니다.",
    org: "굿닥",
    period: "2026.06",
    role: "인증 경로 계측, 원인 분석, 복구 로직 설계·구현, 배포 후 검증",
    stack:
      "TypeScript · React Native · Apollo Client · Axios · Amplitude · Sentry",
    metric: {
      label: "강제 로그아웃 / 하루",
      before: "1,213",
      after: "1",
      note: "하루 최대치와 수정 배포 당일 값",
    },
    sections: [
      {
        id: "problem",
        label: "문제",
        blocks: [
          {
            type: "p",
            text: "굿닥 앱에서 사용자가 이유 없이 로그아웃된다는 신고가 이어졌습니다. 로그아웃은 앱이 저장된 토큰을 지울 때 일어나는데, 어느 코드 경로에서 어떤 실패 때문에 지우는지 기록이 없어서 원인을 말할 수 있는 사람이 없었습니다.",
          },
          {
            type: "p",
            text: "원인을 모르면 고쳤는지도 알 수 없어서, 고치기 전에 측정부터 만들었습니다.",
          },
        ],
      },
      {
        id: "analysis",
        label: "분석",
        blocks: [
          {
            type: "p",
            text: "토큰을 지우기 직전에 force_logout 이벤트를 보내도록 모든 경로를 바꿨습니다. 이벤트는 두 축으로 나눴습니다. trigger는 어디서 일어났는지(앱 시작, Apollo 링크, axios, WebSocket 등), failure_type은 토큰 갱신이 어떻게 실패했는지(네트워크 오류, 서버 오류, 서버 거부, 리프레시 토큰 없음, 알 수 없음)입니다. 네트워크 실패와 토큰 거부를 구분하려고 갱신 요청도 HTTP 상태와 GraphQL 오류 코드로 분류하게 바꿨습니다.",
          },
          {
            type: "p",
            text: "첫 데이터 763건 중 91%가 server_rejected였습니다. 네트워크가 불안정해서 생기는 문제가 아니라, 서버가 토큰을 거부하고 있었습니다. 30일을 모으자 총 5,547건이 쌓였고 두 유형이 95%를 차지했습니다.",
          },
          {
            type: "diagram",
            id: "a-failure-split",
            caption:
              "30일 누적 강제 로그아웃 5,547건의 실패 유형. 복구 경로가 겨냥한 것은 server_rejected 64%입니다.",
          },
          {
            type: "p",
            text: "서버 코드를 읽어 보니 원인이 보였습니다. 서버는 계정마다 리프레시 토큰을 하나만 보관하고 갱신 요청이 들어올 때마다 그 값을 새로 만들어 덮어쓰기 때문에, 새 토큰을 담은 응답이 중간에 사라지면 앱은 이미 무효가 된 옛 토큰만 갖게 됩니다. 한 계정이 두 기기에서 동시에 갱신해도 한쪽 토큰이 무효가 됩니다. 앱은 이 거부를 받으면 복구를 시도하지 않고 바로 로그아웃했습니다.",
          },
          {
            type: "table",
            head: ["검토한 방법", "판단"],
            rows: [
              [
                "앱이 토큰 거부를 받으면 복구를 시도한 뒤, 실패했을 때만 로그아웃",
                "채택. 서버에 이미 있던 재발급 요청을 연결하는 방식이라 서버 배포 없이 앱 배포만으로 적용됩니다.",
              ],
            ],
            caption: "비교한 다른 방법은 기록에 남아 있지 않습니다.",
          },
        ],
      },
      {
        id: "solution",
        label: "해결",
        blocks: [
          {
            type: "p",
            text: "토큰 거부를 받으면 바로 지우지 않고 두 번 복구를 시도하도록 만들었습니다. 1차는 보관 중인 리프레시 토큰으로 갱신, 거부되면 2차로 현재 액세스 토큰만으로 새 토큰 쌍을 다시 발급받습니다. 2차는 서버에 이미 있었지만 앱에서 쓰이지 않던 요청이고, 서버가 만료된 액세스 토큰도 받아 주는 설정이라 응답 유실이나 다기기 충돌로 리프레시 토큰을 잃은 경우를 구제합니다. 두 번 모두 서버가 명확히 거부했을 때만 로그아웃합니다.",
          },
          {
            type: "diagram",
            id: "a-recovery-flow",
            caption:
              "토큰 거부 이후의 경로. 네트워크 오류와 5xx는 토큰 거부와 구분해서 따로 처리합니다.",
          },
          {
            type: "list",
            items: [
              "여러 요청이 동시에 거부를 받아도 갱신은 한 번만 실행됩니다. 첫 요청이 만든 Promise에 나머지가 합류합니다. 갱신이 겹치면 이 문제와 같은 방식으로 스스로 토큰을 무효로 만들 수 있기 때문입니다.",
              "토큰을 다루는 경로(Apollo 링크, axios, WebSocket, 앱 시작)가 각자 로그아웃을 호출하던 것을 하나의 진입점으로 모았습니다.",
              "3초 안에 들어온 중복 로그아웃은 한 번으로 합치고, 실제로 로그아웃이 일어났을 때만 안내 메시지를 한 번 보여 줍니다.",
            ],
          },
        ],
      },
      {
        id: "result",
        label: "결과",
        blocks: [
          {
            type: "p",
            text: "수정을 배포한 날 Amplitude로 확인했습니다. 하루 최대 1,213건이던 server_rejected 로그아웃이 배포 당일 1건이 됐고 이후에도 0~8건 사이에 머물렀습니다.",
          },
          {
            type: "diagram",
            id: "a-daily",
            caption:
              "server_rejected 로그아웃 일별 건수. 1,213건은 하루 최대치이고, 배포 이후에는 0~8건으로 유지됐습니다.",
          },
          {
            type: "p",
            text: "의도한 경로만 막혔는지도 같은 기간 데이터로 확인했습니다. 리프레시 토큰이 없어서 생기는 no_refresh_token 로그아웃은 하루 100~150건 그대로였습니다. 복구 경로는 server_rejected만 차단했고 다른 유형에는 영향을 주지 않았습니다.",
          },
        ],
      },
      {
        id: "remaining",
        label: "남은 것",
        blocks: [
          {
            type: "list",
            items: [
              "no_refresh_token(31%)은 해결하지 못했습니다. 하루 100~150건이 남아 있고 다음 대상으로 분류만 해 두었습니다.",
              "서버가 토큰을 덮어쓰는 구조는 그대로입니다. 앱이 그 구조를 우회하게 만들었을 뿐 근본 원인은 서버에 남아 있습니다.",
              "수치는 로그아웃 이벤트 수입니다. 영향받은 사용자 수는 첫 데이터로 하루 약 350명이라고 추정한 값만 있습니다.",
            ],
          },
          {
            type: "note",
            text: "이어진 문제: 스토어 별점 1점 리뷰에서 시작해 로그인 실패 1,599명을 추적했더니 87%가 CodePush 설치 실패 직후였습니다. 설치 실패 후 실패율 93.2%, 성공 후 0.26%였고, 앱 초기화 누락과 서버 헤더 누락이 겹친 문제였습니다.",
          },
        ],
      },
    ],
  },
  {
    slug: "webview-hybrid",
    index: "02",
    title:
      "네이티브 앱 계획을 WebView 하이브리드로 바꿔, 혼자 5개월에 iOS·Android 출시",
    summary:
      "개발 인원이 부족한 상황에서 처음 계획인 네이티브 앱 대신 웹을 앱 안에 올리는 구조를 제안했습니다. 앱과 웹이 주고받는 규격을 설계해 단독으로 출시했습니다.",
    org: "긴트",
    period: "2023.03 ~ 2023.07",
    role: "구조 제안과 설득, 앱-웹 통신 규격 설계, 웹과 앱 연동 구현 (단독)",
    stack: "React · TypeScript · Zustand · React Query · react-native-webview",
    metric: {
      kind: "fact",
      label: "개발 기간 · 인원",
      before: "5개월",
      after: "1명",
      note: "iOS와 Android 동시 출시",
    },
    sections: [
      {
        id: "problem",
        label: "문제",
        blocks: [
          {
            type: "p",
            text: "농기계 마켓 앱(PM)을 처음에는 네이티브 앱으로 만들 계획이었습니다. 팀에는 앱을 맡을 개발 인원이 부족했고, 네이티브로 가면 일정과 비용을 감당하기 어려운 상황이었습니다.",
          },
        ],
      },
      {
        id: "analysis",
        label: "분석",
        blocks: [
          {
            type: "p",
            text: "개발 비용과 배포 유연성을 따져 팀에 설명하고, 방향을 바꾸자고 제안했습니다. 기준은 적은 인원으로 끝낼 수 있는지, 출시한 뒤 기능을 얼마나 빨리 고칠 수 있는지였습니다.",
          },
          {
            type: "table",
            head: ["", "네이티브 앱 (처음 계획)", "WebView 하이브리드 (제안)"],
            rows: [
              [
                "개발 비용",
                "인원 부족으로 감당하기 어려움",
                "웹 개발로 대부분을 처리",
              ],
              [
                "수정 반영",
                "앱을 새로 배포해야 반영",
                "웹 배포만으로 즉시 반영",
              ],
              [
                "치르는 대가",
                "-",
                "앱과 웹 사이 통신 규격을 설계하고, iOS·Android별 WebView 차이를 해결",
              ],
            ],
            caption:
              "비교 기준은 비용과 배포 유연성입니다. 마지막 줄은 하이브리드를 택하면서 떠안은 일입니다.",
          },
        ],
      },
      {
        id: "solution",
        label: "해결",
        blocks: [
          {
            type: "p",
            text: "서비스는 React 웹으로 만들고, 앱은 그 웹을 담는 껍데기 역할을 하도록 나눴습니다. 웹이 할 수 없는 일은 앱에 맡기는 통신 규격을 만들었습니다. 로그인 상태는 앱이 웹에 넘겨 주고, 결제와 카메라 접근, 공유는 웹이 앱에 요청해 앱이 실행합니다.",
          },
          {
            type: "diagram",
            id: "e-deploy-paths",
            caption:
              "앱은 껍데기로 두고 서비스는 웹에서 배포합니다. 결제·카메라·공유처럼 웹이 못 하는 일만 앱이 대신 실행합니다.",
          },
          {
            type: "p",
            text: "iOS와 Android의 WebView 동작이 달라서 생기는 호환성 문제는 하나씩 해결했습니다.",
          },
        ],
      },
      {
        id: "result",
        label: "결과",
        blocks: [
          {
            type: "p",
            text: "혼자 5개월 만에 iOS와 Android를 동시에 지원하는 MVP를 출시했습니다. 이후에는 앱 심사를 거치지 않고 웹 배포만으로 모든 플랫폼에 기능을 반영할 수 있었습니다.",
          },
        ],
      },
      {
        id: "remaining",
        label: "남은 것",
        blocks: [
          {
            type: "list",
            items: [
              "사용자 수, 성능, 반영 속도 같은 측정값은 남아 있지 않습니다. 위 내용은 구조 결정과 출시까지입니다.",
              "WebView 하이브리드와 순수 네이티브의 체감 성능을 비교한 기록은 없습니다.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "realtime-map-crash",
    index: "03",
    title:
      "4시간 안에 죽던 실시간 지도 앱, 프로파일러로 원인 둘을 찾아 24시간 연속 운영으로",
    summary:
      "0.5초마다 좌표를 받아 그리는 지도에서 4시간 안에 앱이 반복해서 종료됐습니다. 프로파일러로 재서 메모리 누수와 네이티브 문제를 각각 찾았습니다.",
    org: "긴트",
    period: "2022.10 ~ 2024.11",
    role: "원인 측정과 특정, 좌표 데이터 압축, 네이티브 라이브러리 패치, 연속 운영 검증",
    stack: "React Native · Swift · Kotlin · Android Profiler · Leak Instrument",
    metric: {
      label: "무중단 연속 운영",
      before: "4시간",
      after: "24시간",
      note: "6배, 24시간 연속 운영 검증",
    },
    sections: [
      {
        id: "problem",
        label: "문제",
        blocks: [
          {
            type: "p",
            text: "자율주행 관제 앱(PA)은 0.5초마다 들어오는 GPS 좌표를 지도 위에 실시간으로 그립니다. 이 앱이 4시간 넘게 켜져 있으면 반복해서 강제 종료됐습니다.",
          },
        ],
      },
      {
        id: "analysis",
        label: "분석",
        blocks: [
          {
            type: "p",
            text: "크래시 로그만으로는 원인을 좁힐 수 없어서 쟀습니다. Android는 프로파일러로 메모리 사용량을 실시간으로 보고, iOS는 Leak Instrument로 누수 지점을 찾았습니다. 원인은 둘이었습니다.",
          },
          {
            type: "diagram",
            id: "d-two-causes",
            caption:
              "원인 두 가지와 각각의 해결, 그리고 24시간 연속 운영 검증.",
          },
          {
            type: "table",
            head: ["원인", "증상", "해결"],
            rows: [
              [
                "수신한 좌표 데이터가 메모리에서 해제되지 않고 쌓임",
                "시간이 갈수록 메모리 증가",
                "좌표 경로를 Douglas-Peucker 알고리즘으로 압축해 보관량 감소",
              ],
              [
                "지도 라이브러리 버전을 올린 뒤 네이티브 쪽 메모리 해제 시점이 어긋남",
                "앱 종료",
                "라이브러리를 포크해 Swift·Kotlin 네이티브 코드를 수정",
              ],
            ],
          },
        ],
      },
      {
        id: "solution",
        label: "해결",
        blocks: [
          {
            type: "p",
            text: "경로를 압축하는 쪽은 눈에 보이는 선의 모양은 유지하면서 점의 수를 줄이는 방식입니다. 라이브러리 쪽은 네이티브 코드를 고친 버전을 사내에 배포해 앱이 그 버전을 쓰게 했습니다.",
          },
        ],
      },
      {
        id: "result",
        label: "결과",
        blocks: [
          {
            type: "p",
            text: "4시간 안에 반복되던 크래시가 사라졌고, 24시간 연속 운영 검증을 통과했습니다. 앱이 견디는 시간이 6배 이상 늘었습니다.",
          },
        ],
      },
      {
        id: "remaining",
        label: "남은 것",
        blocks: [
          {
            type: "list",
            items: [
              "메모리 사용량 그래프는 남아 있지 않아서, 수치는 4시간과 24시간뿐입니다.",
              "압축으로 좌표가 얼마나 줄었는지, 라이브러리 패치가 따로 얼마나 효과가 있었는지는 분리해 재지 않았습니다.",
            ],
          },
        ],
      },
    ],
  },
]

export const getCase = (slug: string) => CASES.find((c) => c.slug === slug)
