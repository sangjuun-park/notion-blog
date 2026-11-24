import { ReactNode } from "react"
import { DiagramId } from "./content"

type Tone = "plain" | "signal" | "ok" | "ghost"

type BoxProps = {
  x: number
  y: number
  w: number
  h: number
  lines: string[]
  tone?: Tone
  bold?: boolean
}

const toneStyle = (tone: Tone) => {
  switch (tone) {
    case "signal":
      return { stroke: "var(--pf-signal)", fill: "var(--pf-signal-soft)" }
    case "ok":
      return { stroke: "var(--pf-ok)", fill: "var(--pf-ok-soft)" }
    case "ghost":
      return { stroke: "var(--pf-line-strong)", fill: "none", dash: "5 4" }
    default:
      return { stroke: "var(--pf-line-strong)", fill: "var(--pf-surface)" }
  }
}

const Box = ({ x, y, w, h, lines, tone = "plain", bold }: BoxProps) => {
  const s = toneStyle(tone)
  const lineHeight = 18
  const startY = y + h / 2 - ((lines.length - 1) * lineHeight) / 2 + 5
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        style={{ fill: s.fill, stroke: s.stroke, strokeWidth: 1.4 }}
        strokeDasharray={"dash" in s ? s.dash : undefined}
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={startY + i * lineHeight}
          textAnchor="middle"
          style={{
            fontSize: i === 0 && bold ? 14 : 13,
            fontWeight: i === 0 && bold ? 600 : 400,
          }}
        >
          {line}
        </text>
      ))}
    </g>
  )
}

const Arrow = ({
  d,
  label,
  lx,
  ly,
  tone = "plain",
  id,
  anchor = "start",
}: {
  d: string
  label?: string
  lx?: number
  ly?: number
  tone?: "plain" | "ok" | "signal"
  id: string
  anchor?: "start" | "middle" | "end"
}) => {
  const color =
    tone === "ok"
      ? "var(--pf-ok)"
      : tone === "signal"
      ? "var(--pf-signal)"
      : "var(--pf-ink-soft)"
  return (
    <g>
      <path
        d={d}
        fill="none"
        style={{ stroke: color, strokeWidth: 1.5 }}
        markerEnd={`url(#${id})`}
      />
      {label && lx !== undefined && ly !== undefined && (
        <text
          x={lx}
          y={ly}
          textAnchor={anchor}
          style={{ fontSize: 12, fill: color }}
        >
          {label}
        </text>
      )}
    </g>
  )
}

const Defs = ({ id }: { id: string }) => (
  <defs>
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="9"
      refY="5"
      markerWidth="7"
      markerHeight="7"
      orient="auto-start-reverse"
    >
      <path d="M0 0L10 5L0 10z" style={{ fill: "var(--pf-ink-soft)" }} />
    </marker>
  </defs>
)

type FrameProps = {
  viewBox: string
  label: string
  children: ReactNode
}

const Frame = ({ viewBox, label, children }: FrameProps) => (
  <svg
    className="pf-svg"
    viewBox={viewBox}
    role="img"
    aria-label={label}
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
)

/* ---------------- A-1 failure split ---------------- */
const FailureSplit = () => {
  const total = 5547
  const parts = [
    { key: "rejected", n: 3549, tone: "signal" as Tone },
    { key: "norefresh", n: 1744, tone: "plain" as Tone },
    { key: "other", n: 254, tone: "ghost" as Tone },
  ]
  const W = 780
  const X0 = 20
  let acc = 0
  const widths = parts.map((p) => (p.n / total) * W)
  const xs = widths.map((w) => {
    const v = X0 + acc
    acc += w
    return v
  })
  return (
    <Frame
      viewBox="0 0 820 220"
      label="강제 로그아웃 5,547건 중 server_rejected 3,549건 64%, no_refresh_token 1,744건 31%, 기타 254건 5%"
    >
      <text x={X0} y={26} style={{ fontSize: 13 }} className="pf-muted">
        30일 누적 force_logout 5,547건
      </text>
      {parts.map((p, i) => {
        const s = toneStyle(p.tone)
        return (
          <rect
            key={p.key}
            x={xs[i]}
            y={44}
            width={widths[i]}
            height={46}
            style={{
              fill: p.tone === "signal" ? "var(--pf-signal)" : s.fill,
              stroke: s.stroke,
              strokeWidth: 1.4,
            }}
            strokeDasharray={"dash" in s ? s.dash : undefined}
          />
        )
      })}
      <text
        x={xs[0] + 14}
        y={73}
        style={{ fontSize: 15, fontWeight: 600, fill: "var(--pf-on-signal)" }}
      >
        server_rejected 3,549건 · 64%
      </text>
      <text x={xs[1] + 14} y={73} style={{ fontSize: 15, fontWeight: 600 }}>
        no_refresh_token 1,744건 · 31%
      </text>
      <text
        x={X0 + W}
        y={38}
        textAnchor="end"
        style={{ fontSize: 12 }}
        className="pf-muted"
      >
        기타 254건 · 5%
      </text>
      {/* brackets */}
      <path
        d={`M${xs[0]} 108 V118 H${xs[0] + widths[0]} V108`}
        fill="none"
        style={{ stroke: "var(--pf-signal)", strokeWidth: 1.5 }}
      />
      <text
        x={xs[0]}
        y={142}
        style={{ fontSize: 13, fontWeight: 600, fill: "var(--pf-signal)" }}
      >
        복구 경로가 겨냥한 구간
      </text>
      <text x={xs[0]} y={162} style={{ fontSize: 12 }} className="pf-muted">
        서버가 토큰을 거부 → 복구를 시도하지 않고 바로 로그아웃
      </text>
      <path
        d={`M${xs[1]} 108 V118 H${xs[1] + widths[1]} V108`}
        fill="none"
        style={{ stroke: "var(--pf-line-strong)", strokeWidth: 1.5 }}
      />
      <text x={xs[1]} y={142} style={{ fontSize: 13, fontWeight: 600 }}>
        이번에 건드리지 않은 구간
      </text>
      <text x={xs[1]} y={162} style={{ fontSize: 12 }} className="pf-muted">
        리프레시 토큰이 없음 → 다음 과제
      </text>
      <text x={X0} y={204} style={{ fontSize: 12 }} className="pf-muted">
        두 유형의 합 5,293건이 전체의 95%
      </text>
    </Frame>
  )
}

/* ---------------- A-2 recovery flow ---------------- */
const RecoveryFlow = () => {
  const id = "pf-arrow-recovery"
  return (
    <Frame
      viewBox="0 0 820 330"
      label="토큰 거부를 받으면 1차로 리프레시 토큰 갱신, 거부되면 2차로 액세스 토큰 재발급, 둘 다 거부될 때만 로그아웃하는 흐름"
    >
      <Defs id={id} />
      <Box
        x={10}
        y={34}
        w={190}
        h={56}
        lines={["요청이 토큰 거부", "(401)를 받음"]}
      />
      <Box
        x={270}
        y={34}
        w={230}
        h={56}
        lines={["1차 · 갱신", "보관 중인 리프레시 토큰"]}
        bold
      />
      <Box
        x={590}
        y={34}
        w={220}
        h={56}
        lines={["원래 요청을 한 번", "다시 보냄"]}
        tone="ok"
      />
      <Arrow d="M200 62 H266" id={id} />
      <Arrow
        d="M500 62 H586"
        id={id}
        tone="ok"
        label="성공"
        lx={543}
        ly={52}
        anchor="middle"
      />

      <Box
        x={270}
        y={132}
        w={230}
        h={56}
        lines={["2차 · 재발급", "현재 액세스 토큰만으로"]}
        bold
      />
      <Arrow
        d="M385 90 V128"
        id={id}
        tone="signal"
        label="거부"
        lx={395}
        ly={114}
      />
      <Arrow d="M500 160 H700 V94" id={id} tone="ok" />
      <text x={708} y={138} style={{ fontSize: 12, fill: "var(--pf-ok)" }}>
        성공
      </text>

      <Box
        x={270}
        y={246}
        w={230}
        h={56}
        lines={["로그아웃", "3초 안 중복은 1회로 합침"]}
        tone="signal"
        bold
      />
      <Arrow
        d="M385 188 V242"
        id={id}
        tone="signal"
        label="두 번 모두 거부"
        lx={395}
        ly={222}
      />

      <Box
        x={10}
        y={132}
        w={216}
        h={56}
        lines={["동시에 들어온 거부는", "갱신 요청 하나에 합류"]}
        tone="ghost"
      />
      <Box
        x={560}
        y={246}
        w={250}
        h={56}
        lines={["네트워크 오류 · 5xx", "거부로 보지 않고 따로 분류"]}
        tone="ghost"
      />
    </Frame>
  )
}

/* ---------------- A-3 daily bars ---------------- */
const DailyBars = () => {
  const baseY = 230
  const maxH = 150
  const maxV = 1213
  const scale = (v: number) => (v / maxV) * maxH
  const bars = [
    { x: 70, w: 74, v: 223, label: "06-16", val: "223" },
    { x: 190, w: 74, v: 867, label: "06-17", val: "867" },
    { x: 310, w: 74, v: 1213, label: "06-18~19", val: "1,213", peak: true },
    { x: 430, w: 74, v: 1, label: "06-20", val: "1", after: true },
  ]
  return (
    <Frame
      viewBox="0 0 820 290"
      label="server_rejected 강제 로그아웃 일별 건수: 6월 16일 223, 17일 867, 18~19일 최대 1,213, 수정 배포일인 20일 1, 21일 이후 0~8"
    >
      <line
        x1={40}
        x2={780}
        y1={baseY}
        y2={baseY}
        style={{ stroke: "var(--pf-line-strong)", strokeWidth: 1.2 }}
      />
      {bars.map((b) => (
        <g key={b.label}>
          <rect
            x={b.x}
            y={baseY - Math.max(scale(b.v), 3)}
            width={b.w}
            height={Math.max(scale(b.v), 3)}
            style={{
              fill: b.after ? "var(--pf-ok)" : "var(--pf-signal)",
              opacity: b.peak || b.after ? 1 : 0.55,
            }}
          />
          <text
            x={b.x + b.w / 2}
            y={baseY - Math.max(scale(b.v), 3) - 8}
            textAnchor="middle"
            className="pf-num"
            style={{ fontSize: 15, fontWeight: 600 }}
          >
            {b.val}
          </text>
          <text
            x={b.x + b.w / 2}
            y={baseY + 22}
            textAnchor="middle"
            style={{ fontSize: 12 }}
            className="pf-muted"
          >
            {b.label}
          </text>
        </g>
      ))}
      {/* after band */}
      <rect
        x={570}
        y={baseY - 3}
        width={170}
        height={3}
        style={{ fill: "var(--pf-ok)" }}
      />
      <text
        x={655}
        y={baseY - 14}
        textAnchor="middle"
        className="pf-num"
        style={{ fontSize: 15, fontWeight: 600 }}
      >
        0 ~ 8
      </text>
      <text
        x={655}
        y={baseY + 22}
        textAnchor="middle"
        style={{ fontSize: 12 }}
        className="pf-muted"
      >
        06-21 이후
      </text>
      {/* deploy marker */}
      <line
        x1={520}
        x2={520}
        y1={30}
        y2={baseY}
        style={{ stroke: "var(--pf-ink-soft)", strokeWidth: 1.2 }}
        strokeDasharray="4 4"
      />
      <text x={528} y={48} style={{ fontSize: 12, fontWeight: 600 }}>
        수정 배포 당일(06-20)부터
      </text>
      <text
        x={310 + 37}
        y={32}
        textAnchor="middle"
        style={{ fontSize: 12, fill: "var(--pf-signal)", fontWeight: 600 }}
      >
        하루 최대
      </text>
      <text x={40} y={270} style={{ fontSize: 12 }} className="pf-muted">
        세로축: 하루 server_rejected 로그아웃 건수 (Amplitude)
      </text>
    </Frame>
  )
}

/* ---------------- H-1 unify ---------------- */
const Unify = () => {
  const id = "pf-arrow-unify"
  return (
    <Frame
      viewBox="0 0 820 350"
      label="iOS의 Apple 건강과 Android의 삼성 헬스가 각각 네이티브 모듈을 거치며 하루 경계, 단위, 집계 방식, 수면 귀속, 시각 표기가 맞춰지고 같은 응답 형식이 되어 JS 인터페이스 하나로 호출된다"
    >
      <Defs id={id} />
      <Box
        x={10}
        y={30}
        w={210}
        h={96}
        lines={[
          "iOS",
          "Apple 건강 (HealthKit)",
          "수면 · 단계별 샘플",
          "혈당 · mg/dL",
        ]}
        bold
      />
      <Box
        x={10}
        y={170}
        w={210}
        h={96}
        lines={[
          "Android",
          "삼성 헬스 (Data SDK)",
          "수면 · 세션 단위",
          "혈당 · mmol/L",
        ]}
        bold
      />
      <Arrow d="M220 78 H266" id={id} />
      <Arrow d="M220 218 H266" id={id} />
      <Box
        x={270}
        y={30}
        w={270}
        h={236}
        lines={[
          "네이티브 모듈 (OS별)",
          "하루 경계 · 한국 시간",
          "단위 · mg/dL, mmHg, mL, kcal",
          "합계 지표 · sum",
          "시점 지표 · min max avg last",
          "수면 · 세션 종료일에 귀속",
          "시각 · UTC ISO 8601",
        ]}
        tone="signal"
        bold
      />
      <Arrow d="M540 148 H586" id={id} />
      <Box
        x={590}
        y={96}
        w={220}
        h={104}
        lines={[
          "같은 응답 형식",
          "type · dataFrom",
          "dateTimeFrom · dateTimeTo",
          "sum · min · max · avg · last",
        ]}
        tone="ok"
        bold
      />
      <Arrow d="M700 200 V292" id={id} label="전달" lx={710} ly={250} />
      <Box
        x={270}
        y={296}
        w={540}
        h={46}
        lines={[
          "JS 인터페이스 하나",
          "iOS면 HealthKit 모듈, Android면 삼성 헬스 모듈로 연결",
        ]}
      />
    </Frame>
  )
}

/* ---------------- H-2 sync window ---------------- */
const SyncWindow = () => {
  return (
    <Frame
      viewBox="0 0 820 270"
      label="이미 연동한 경우 서버의 마지막 기록 다음 날부터 어제 23시 59분 59초까지를 기기에서 읽어 서버에 올리고, 처음 연동하면 최대 5주 전부터 읽는다. 오늘 0시부터 지금까지는 서버에 올리지 않고 기기에서 계산해 화면에만 쓴다"
    >
      <text
        x={20}
        y={22}
        style={{ fontSize: 12, fontWeight: 600 }}
        className="pf-muted"
      >
        이미 연동한 경우
      </text>
      <Box
        x={20}
        y={32}
        w={230}
        h={60}
        lines={["서버에 이미 있는 기록", "다시 읽지 않음"]}
        tone="ghost"
      />
      <Box
        x={250}
        y={32}
        w={320}
        h={60}
        lines={[
          "기기에서 읽어 서버에 올림",
          "마지막 기록 다음 날 ~ 어제 23:59:59",
        ]}
        bold
      />
      <Box
        x={570}
        y={32}
        w={230}
        h={60}
        lines={["오늘 0시 ~ 지금", "기기에서 계산, 화면에만 씀"]}
        tone="ok"
      />

      <text
        x={20}
        y={128}
        style={{ fontSize: 12, fontWeight: 600 }}
        className="pf-muted"
      >
        처음 연동한 경우
      </text>
      <Box
        x={20}
        y={138}
        w={550}
        h={60}
        lines={["기기에서 읽어 서버에 올림", "최대 5주 전 ~ 어제 23:59:59"]}
        bold
      />
      <Box
        x={570}
        y={138}
        w={230}
        h={60}
        lines={["오늘 0시 ~ 지금", "기기에서 계산, 화면에만 씀"]}
        tone="ok"
      />

      <line
        x1={570}
        x2={570}
        y1={26}
        y2={204}
        style={{ stroke: "var(--pf-ink-soft)", strokeWidth: 1.2 }}
        strokeDasharray="4 4"
      />
      <text
        x={562}
        y={222}
        textAnchor="end"
        style={{ fontSize: 12 }}
        className="pf-muted"
      >
        오늘 0시 · 서버 시각, 한국 시간 기준
      </text>
      <text x={20} y={248} style={{ fontSize: 12 }} className="pf-muted">
        수면은 자정을 걸치므로 마지막 기록의 종료 시각부터 읽고, 지표마다 구간을
        따로 계산합니다.
      </text>
    </Frame>
  )
}

/* ---------------- D two causes ---------------- */
const TwoCauses = () => {
  const id = "pf-arrow-causes"
  return (
    <Frame
      viewBox="0 0 820 300"
      label="크래시의 원인 둘, 좌표 데이터 누적은 Douglas-Peucker 압축으로, 라이브러리 업그레이드 후 네이티브 해제 시점 불일치는 포크 수정으로 해결하고 24시간 연속 운영으로 검증"
    >
      <Defs id={id} />
      <Box
        x={10}
        y={10}
        w={250}
        h={46}
        lines={["측정 도구", "Android Profiler · Leak Instrument"]}
        tone="ghost"
      />
      <Box
        x={10}
        y={64}
        w={250}
        h={64}
        lines={["원인 1", "좌표 데이터가 해제되지 않고", "메모리에 쌓임"]}
        tone="signal"
      />
      <Box
        x={10}
        y={158}
        w={250}
        h={64}
        lines={[
          "원인 2",
          "라이브러리 업그레이드 후",
          "네이티브 메모리 해제 시점 불일치",
        ]}
        tone="signal"
      />

      <Arrow d="M260 96 H340" id={id} />
      <Arrow d="M260 190 H340" id={id} />
      <Box
        x={344}
        y={64}
        w={240}
        h={64}
        lines={["좌표 경로를", "Douglas-Peucker로 압축"]}
        bold
      />
      <Box
        x={344}
        y={158}
        w={240}
        h={64}
        lines={["라이브러리를 포크해", "Swift · Kotlin 수정"]}
        bold
      />

      <Arrow d="M584 96 H624 V150" id={id} tone="ok" />
      <Arrow d="M584 190 H624 V160" id={id} tone="ok" />
      <Box
        x={628}
        y={124}
        w={182}
        h={70}
        lines={["24시간 연속 운영", "검증 통과", "(4시간 → 24시간)"]}
        tone="ok"
        bold
      />
      <text x={10} y={260} style={{ fontSize: 12 }} className="pf-muted">
        원인 둘을 각각 특정하고 각각 고친 뒤, 24시간 연속 운영으로 검증했습니다.
      </text>
    </Frame>
  )
}

const REGISTRY: Record<DiagramId, () => JSX.Element> = {
  "a-failure-split": FailureSplit,
  "a-recovery-flow": RecoveryFlow,
  "a-daily": DailyBars,
  "h-unify": Unify,
  "h-sync-window": SyncWindow,
  "d-two-causes": TwoCauses,
}

export const Diagram = ({ id }: { id: DiagramId }) => {
  const C = REGISTRY[id]
  return <C />
}
