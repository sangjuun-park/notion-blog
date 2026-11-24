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
  | "h-unify"
  | "h-sync-window"
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
    "굿닥과 긴트에서 일했습니다. 그중 세 건을 적었습니다. 로그인이 풀리던 문제, 두 OS의 건강 데이터를 하나로 맞춘 모듈, 4시간 안에 죽던 지도 앱입니다.",
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
    slug: "health-native-module",
    index: "02",
    title:
      "iOS와 Android가 다르게 주는 건강 데이터를 하나의 형식으로 맞춘 네이티브 모듈",
    summary:
      "건강관리 탭에 걸음수, 수면, 심박수, 혈당, 혈압 같은 7가지 지표를 보여 주려면 Apple 건강과 삼성 헬스에서 읽어 와야 했습니다. 두 곳이 값을 주는 방식이 달라서 단위, 하루의 경계, 수면 계산 기준부터 정하고, 두 OS가 같은 모양으로 답하는 네이티브 모듈을 만들었습니다.",
    org: "굿닥",
    period: "2025.11 ~ 2026.01",
    role: "iOS HealthKit 모듈 구현, Android 삼성 헬스 모듈 재작성, 두 OS 공통 응답 형식과 호출 인터페이스 설계, 동기화 로직",
    stack:
      "Swift · HealthKit · Kotlin · Samsung Health Data SDK · React Native · TypeScript · Apollo Client · Zustand",
    metric: {
      kind: "fact",
      label: "하나로 맞춘 것",
      before: "2개 OS",
      after: "7개 지표",
      note: "같은 호출, 같은 응답 형식",
    },
    sections: [
      {
        id: "problem",
        label: "문제",
        blocks: [
          {
            type: "p",
            text: "건강관리 탭을 만들면서 걸음수, 수면, 심박수, 수분 섭취량, 활동 칼로리, 혈당, 혈압을 기기에서 읽어 와야 했습니다. 원본은 iOS에서는 Apple 건강(HealthKit), Android에서는 삼성 헬스이고, React Native에서 부르려면 둘 다 네이티브 모듈이 필요했습니다.",
          },
          {
            type: "p",
            text: "앱에는 걸음수만 읽는 만보기 기능이 이미 두 OS에 있었습니다. Android는 구 삼성 헬스 SDK 기반이어서 새 Data SDK 기준으로 모듈을 다시 만들었습니다.",
          },
          {
            type: "p",
            text: "더 신경 쓴 쪽은 두 곳이 같은 지표를 주는 방식이 다르다는 점입니다. OS마다 따로 처리하면 화면과 동기화 코드가 OS별로 갈라지고 서버에도 같은 지표가 두 가지 모양으로 쌓입니다. 그래서 읽는 코드를 쓰기 전에 값을 어떤 모양으로 받을지부터 정했습니다.",
          },
        ],
      },
      {
        id: "analysis",
        label: "분석",
        blocks: [
          {
            type: "p",
            text: "두 OS가 같은 지표를 어떻게 주는지 하나씩 비교하고, 다른 곳마다 맞출 기준을 하나씩 정했습니다.",
          },
          {
            type: "table",
            head: [
              "항목",
              "iOS (Apple 건강)",
              "Android (삼성 헬스)",
              "맞춘 기준",
            ],
            rows: [
              [
                "합계 지표 (걸음수·수분·활동 칼로리)",
                "일 단위 합계 쿼리",
                "일 단위 합계 요청",
                "sum 하나",
              ],
              [
                "시점 지표 (심박수·혈당·혈압)",
                "일 단위 통계 쿼리 (평균·최소·최대·최근값)",
                "측정점을 받아 한국 날짜별로 계산",
                "min · max · avg · last",
              ],
              [
                "혈당 단위",
                "mg/dL",
                "mmol/L",
                "mg/dL. Android 값에 18을 곱해 환산",
              ],
              [
                "혈압",
                "수축기와 이완기를 따로 조회",
                "측정점 하나에 두 값",
                "두 값을 별개 지표로 분리",
              ],
              [
                "수면",
                "단계별 샘플 배열. 세션 없음",
                "세션 단위로 제공",
                "세션 길이에서 깬 시간을 뺀 분 단위 값",
              ],
              [
                "하루 경계",
                "한국 시간 달력",
                "한국 시간 날짜로 묶음",
                "한국 시간 0시~24시로 고정",
              ],
              [
                "시각 표기",
                "UTC ISO 8601",
                "UTC ISO 8601 (초 단위까지)",
                "구간의 끝은 다음 날 0시 1초 전",
              ],
              [
                "데이터 출처 값",
                "healthKit",
                "samsungHealth",
                "서버와 약속한 두 값",
              ],
            ],
            caption:
              "응답은 두 OS 모두 type, dataFrom, dateTimeFrom, dateTimeTo, value와 sum·min·max·avg·last 필드로 같은 모양입니다.",
          },
          {
            type: "p",
            text: "수면이 가장 까다로웠습니다. 밤 9시에 자서 다음 날 아침 9시에 일어나면 0시 기준으로 자를 때 하루 잠이 두 날로 쪼개집니다. 그래서 수면은 날짜가 아니라 세션 단위로 다루고, 세션이 끝난 날에 귀속시켰습니다.",
          },
          {
            type: "p",
            text: "Android는 SDK가 세션을 만들어 주지만 iOS는 단계별 샘플만 줘서, iOS에서는 세션을 만드는 일도 제가 했습니다. 샘플 사이 간격이 1시간 미만이면 한 세션으로 묶고, 전날 밤에 시작한 세션을 놓치지 않도록 조회 범위를 앞뒤로 24시간 넓힌 뒤 세션 종료 시각으로 걸러냅니다. 깬 시간은 1분 이상인 구간만 세고 1분 이내 간격으로 이어지는 구간은 하나로 합칩니다. 이렇게 했을 때 Apple 건강 앱의 수치와 더 잘 맞았습니다.",
          },
        ],
      },
      {
        id: "solution",
        label: "해결",
        blocks: [
          {
            type: "p",
            text: "호출 쪽에는 JS 인터페이스를 하나만 두었습니다. iOS에서는 HealthKit 모듈, Android에서는 삼성 헬스 모듈로 연결되고 두 모듈의 함수 이름과 응답 형식이 같아서, 지표를 읽는 동기화 코드에는 OS 분기가 없습니다.",
          },
          {
            type: "diagram",
            id: "h-unify",
            caption:
              "두 OS가 읽는 방식은 달라도 네이티브 모듈이 단위, 하루 경계, 집계 방식을 맞춰서 같은 모양으로 돌려줍니다.",
          },
          {
            type: "p",
            text: "동기화는 서버에 이미 있는 마지막 기록을 지표별로 확인하고, 그 다음 날부터 어제 23시 59분 59초까지만 읽어서 올립니다. 처음 연동하면 최대 5주 전까지 거슬러 올라갑니다. 오늘 값은 서버에 올리지 않고 기기에서 계산해 화면에만 보여 주고, '오늘'은 기기 시계가 아니라 서버 시각으로 정합니다. 수면은 자정을 걸치기 때문에 마지막 기록의 다음 날이 아니라 마지막 종료 시각부터 다시 읽습니다.",
          },
          {
            type: "diagram",
            id: "h-sync-window",
            caption:
              "동기화 구간. 서버에 있는 기록 다음 날부터 어제까지만 읽어 올리고, 오늘은 기기에서 계산해 화면에만 씁니다.",
          },
          {
            type: "list",
            items: [
              "데이터 출처가 셋입니다. 서버에 올라간 기록, 기기에서 읽은 값, 사용자가 입력한 값입니다. 어제 이전 날짜는 서버 기록을 우선하고, 오늘은 세 출처 중 가장 최근 값을 씁니다.",
              "화면에 보이는 값도 지표별로 정했습니다. 합계 지표는 합계를 반올림하고, 심박수와 혈당은 그날의 마지막 값을 쓰고, 혈압은 수축기와 이완기를 한 칸에 '120/80' 꼴로 합쳐 보여 줍니다.",
              "데이터가 없을 때의 표시를 나눴습니다. 걸음수·활동 칼로리·수분은 0, 심박수·혈당·혈압은 '?'입니다. 안 잰 것과 0은 다르기 때문입니다.",
              "지표마다 읽기 구간을 따로 계산하고 따로 호출합니다. 한 지표를 읽다 실패해도 그 지표만 비고 나머지는 계속 읽습니다.",
              "iOS는 읽기 권한이 있는지 OS가 알려 주지 않습니다. 사용자가 굿닥 앱에서 허용을 눌렀는지를 앱이 따로 확인하고, 삼성 헬스는 권한별로 확인합니다. 오늘 값을 읽을 때 iOS의 '데이터 없음'이나 권한 관련 오류는 실패가 아니라 빈 결과로 처리하고, 그 밖의 오류만 에러로 올립니다.",
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
            text: "건강관리 기능은 2026년 1월 29일 운영에 배포됐습니다. 걸음수, 수면, 심박수, 수분 섭취량, 활동 칼로리, 혈당, 혈압 7가지가 iOS와 Android에서 같은 호출로 같은 모양의 값을 돌려줍니다.",
          },
          {
            type: "p",
            text: "수면 계산은 배포 직전까지 고쳤습니다. 1월 16일에 세션 묶기를 넣었고 19일에 로직을 단순화했으며, 23일과 27일에 iOS의 수집과 분석 로직을, 28일에 삼성 헬스의 수면 시간 반올림을 고쳤습니다.",
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
              "연동률이나 사용자 수 같은 성과 수치는 확인하지 않았습니다.",
              "Apple 건강 앱이 보여 주는 수면 시간과 계산값에는 차이가 있었고, 깬 구간을 합치는 간격을 1분으로 넓혀 가깝게 맞췄습니다. 차이의 원인은 확인하지 못했습니다.",
              "두 OS의 깬 시간 기준이 완전히 같지는 않습니다. iOS는 1분 이상 깬 구간만 세고, Android는 SDK가 깬 단계로 준 구간을 모두 더합니다.",
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
