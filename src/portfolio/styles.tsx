import { Global, css } from "@emotion/react"
import { pretendard } from "src/assets"

export const PortfolioGlobal = () => (
  <Global
    styles={css`
      :root {
        --pf-bg: #eef0f2;
        --pf-surface: #f8f9fa;
        --pf-ink: #0d1117;
        --pf-ink-soft: #444d5b;
        --pf-muted: #596373;
        --pf-line: #d5dae0;
        --pf-line-strong: #8b95a3;
        --pf-signal: #c2321c;
        --pf-signal-soft: #f8e4e0;
        --pf-on-signal: #ffffff;
        --pf-ok: #0b6b4d;
        --pf-ok-soft: #ddf0e8;
        --pf-mono: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas,
          monospace;
        color-scheme: light;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --pf-bg: #0b0e12;
          --pf-surface: #12161c;
          --pf-ink: #e9edf1;
          --pf-ink-soft: #aab3bf;
          --pf-muted: #8f99a6;
          --pf-line: #222a34;
          --pf-line-strong: #4a5563;
          --pf-signal: #ff7b64;
          --pf-signal-soft: #2b1511;
          --pf-on-signal: #1a0b07;
          --pf-ok: #4fd1a1;
          --pf-ok-soft: #0f2a21;
          color-scheme: dark;
        }
      }

      html {
        scroll-behavior: smooth;
      }
      body {
        margin: 0;
        padding: 0;
        background: var(--pf-bg);
        color: var(--pf-ink);
        font-family: ${pretendard.style.fontFamily}, system-ui, sans-serif;
        line-height: 1.7;
        word-break: keep-all;
        -webkit-font-smoothing: antialiased;
      }
      * {
        box-sizing: border-box;
      }
      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto;
        }
        * {
          transition: none !important;
        }
      }

      .pf-wrap {
        max-width: 1080px;
        margin: 0 auto;
        padding-left: max(24px, env(safe-area-inset-left, 0px));
        padding-right: max(24px, env(safe-area-inset-right, 0px));
      }
      .pf-top {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px 24px;
        padding-top: 28px;
        padding-bottom: 28px;
        border-bottom: 1px solid var(--pf-line);
      }
      .pf-top a,
      .pf-foot a {
        color: var(--pf-ink-soft);
        text-decoration: none;
        font-size: 14px;
      }
      .pf-top a:hover,
      .pf-foot a:hover {
        color: var(--pf-ink);
        text-decoration: underline;
        text-underline-offset: 4px;
      }
      .pf-brand {
        font-weight: 700;
        font-size: 16px;
        color: var(--pf-ink) !important;
      }
      .pf-links {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
      }
      a:focus-visible {
        outline: 2px solid var(--pf-ink);
        outline-offset: 3px;
        border-radius: 2px;
      }

      /* index */
      .pf-hero {
        padding-top: clamp(48px, 9vw, 112px);
        padding-bottom: clamp(36px, 6vw, 72px);
      }
      .pf-hero h1 {
        margin: 0;
        font-size: clamp(32px, 5.6vw, 60px);
        line-height: 1.18;
        letter-spacing: -0.025em;
        font-weight: 700;
        max-width: 18em;
        text-wrap: balance;
      }
      .pf-hero p {
        margin: 24px 0 0;
        max-width: 38em;
        color: var(--pf-ink-soft);
        font-size: 17px;
      }
      .pf-list-head {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: var(--pf-muted);
        padding: 10px 0;
        border-top: 1px solid var(--pf-ink);
      }
      .pf-row {
        display: grid;
        grid-template-columns: 56px minmax(0, 1fr) minmax(180px, 260px);
        gap: 12px 32px;
        align-items: start;
        padding: 32px 0;
        border-top: 1px solid var(--pf-line);
        color: inherit;
        text-decoration: none;
        transition: background 0.15s;
      }
      .pf-row:hover {
        background: var(--pf-surface);
      }
      .pf-row:hover .pf-row-title {
        text-decoration: underline;
        text-underline-offset: 5px;
        text-decoration-thickness: 1px;
      }
      .pf-row-index {
        font-family: var(--pf-mono);
        color: var(--pf-muted);
        font-size: 14px;
        padding-top: 6px;
      }
      .pf-row-meta {
        font-size: 13px;
        color: var(--pf-muted);
        margin-bottom: 8px;
      }
      .pf-row-title {
        margin: 0;
        font-size: clamp(20px, 2.6vw, 26px);
        line-height: 1.4;
        letter-spacing: -0.015em;
        font-weight: 650;
        text-wrap: balance;
      }
      .pf-row-summary {
        margin: 12px 0 0;
        color: var(--pf-ink-soft);
        font-size: 15px;
        max-width: 40em;
      }
      .pf-metric-label {
        font-size: 12px;
        color: var(--pf-muted);
        margin-bottom: 4px;
      }
      .pf-metric-value {
        font-family: var(--pf-mono);
        font-weight: 600;
        letter-spacing: -0.03em;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 4px 10px;
      }
      .pf-metric-before {
        font-size: clamp(22px, 3vw, 30px);
        color: var(--pf-signal);
        text-decoration: line-through;
        text-decoration-thickness: 2px;
      }
      .pf-metric-arrow {
        color: var(--pf-muted);
        font-size: 18px;
      }
      .pf-metric-after {
        font-size: clamp(28px, 4vw, 44px);
        color: var(--pf-ok);
      }
      .pf-metric-fact {
        font-size: clamp(28px, 4vw, 44px);
        color: var(--pf-ink);
      }
      .pf-metric-note {
        font-size: 12px;
        color: var(--pf-muted);
        margin-top: 6px;
      }

      /* case */
      .pf-back {
        display: inline-block;
        margin-top: 28px;
        font-size: 14px;
        color: var(--pf-ink-soft);
        text-decoration: none;
      }
      .pf-back:hover {
        color: var(--pf-ink);
        text-decoration: underline;
        text-underline-offset: 4px;
      }
      .pf-case-head {
        padding-top: clamp(28px, 5vw, 56px);
        padding-bottom: 36px;
      }
      .pf-case-head .pf-kicker {
        font-family: var(--pf-mono);
        font-size: 13px;
        color: var(--pf-muted);
      }
      .pf-case-head h1 {
        margin: 12px 0 0;
        font-size: clamp(26px, 4.2vw, 44px);
        line-height: 1.28;
        letter-spacing: -0.025em;
        font-weight: 700;
        max-width: 22em;
        text-wrap: balance;
      }
      .pf-facts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px 32px;
        margin: 32px 0 0;
        padding: 20px 0 0;
        border-top: 1px solid var(--pf-line);
      }
      .pf-facts dt {
        font-size: 12px;
        color: var(--pf-muted);
        margin-bottom: 2px;
      }
      .pf-facts dd {
        margin: 0;
        font-size: 14px;
        color: var(--pf-ink-soft);
        line-height: 1.6;
      }
      .pf-result {
        margin: 8px 0 0;
        padding: 28px 0;
        border-top: 1px solid var(--pf-ink);
        border-bottom: 1px solid var(--pf-line);
      }
      .pf-sec {
        display: grid;
        grid-template-columns: 150px minmax(0, 1fr);
        gap: 12px 40px;
        padding: 44px 0;
        border-bottom: 1px solid var(--pf-line);
      }
      .pf-sec-label {
        margin: 0;
        font-size: 14px;
        font-weight: 700;
        color: var(--pf-ink);
        position: sticky;
        top: 24px;
        align-self: start;
      }
      .pf-sec-body {
        min-width: 0;
        max-width: 46em;
      }
      .pf-sec-body > * {
        margin: 0;
      }
      .pf-sec-body > * + * {
        margin-top: 20px;
      }
      .pf-sec-body p {
        font-size: 16.5px;
      }
      .pf-sec-body ul {
        padding-left: 1.2em;
      }
      .pf-sec-body li {
        margin-bottom: 8px;
        font-size: 16px;
      }
      .pf-note {
        border-left: 3px solid var(--pf-line-strong);
        padding: 4px 0 4px 16px;
        color: var(--pf-ink-soft);
        font-size: 15px;
      }
      .pf-figure {
        padding: 20px;
        background: var(--pf-surface);
        border: 1px solid var(--pf-line);
        border-radius: 6px;
        max-width: none;
        overflow-x: auto;
      }
      .pf-figure .pf-svg {
        display: block;
        width: 100%;
        min-width: 680px;
        height: auto;
        color: var(--pf-ink);
      }
      .pf-figure figcaption {
        margin-top: 14px;
        font-size: 13px;
        color: var(--pf-muted);
        line-height: 1.6;
        max-width: 60em;
      }
      .pf-svg text {
        fill: var(--pf-ink);
        font-family: inherit;
      }
      .pf-svg .pf-muted {
        fill: var(--pf-muted);
      }
      .pf-svg .pf-num {
        font-family: var(--pf-mono);
      }
      .pf-tablewrap {
        overflow-x: auto;
        border: 1px solid var(--pf-line);
        border-radius: 6px;
        background: var(--pf-surface);
      }
      .pf-tablewrap table {
        border-collapse: collapse;
        width: 100%;
        min-width: 520px;
        font-size: 14.5px;
      }
      .pf-tablewrap th,
      .pf-tablewrap td {
        text-align: left;
        vertical-align: top;
        padding: 12px 16px;
        border-bottom: 1px solid var(--pf-line);
        line-height: 1.6;
      }
      .pf-tablewrap th {
        font-size: 12.5px;
        color: var(--pf-muted);
        font-weight: 600;
      }
      .pf-tablewrap tr:last-child td {
        border-bottom: 0;
      }
      .pf-tablecap {
        margin: 8px 0 0 !important;
        font-size: 13px !important;
        color: var(--pf-muted);
      }
      .pf-pager {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        padding: 40px 0 8px;
      }
      .pf-pager a {
        display: block;
        text-decoration: none;
        color: inherit;
        padding: 16px 0;
        border-top: 1px solid var(--pf-ink);
      }
      .pf-pager a:hover .pf-pager-title {
        text-decoration: underline;
        text-underline-offset: 4px;
      }
      .pf-pager small {
        display: block;
        font-size: 12px;
        color: var(--pf-muted);
        margin-bottom: 4px;
      }
      .pf-pager-title {
        font-size: 15px;
        font-weight: 600;
        line-height: 1.5;
      }
      .pf-pager .pf-next {
        text-align: right;
        grid-column: 2;
      }
      .pf-foot {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 8px 24px;
        padding-top: 32px;
        padding-bottom: max(48px, env(safe-area-inset-bottom, 0px));
        margin-top: 24px;
        font-size: 13px;
        color: var(--pf-muted);
      }

      @media (max-width: 760px) {
        .pf-row {
          grid-template-columns: minmax(0, 1fr);
          padding: 28px 0;
        }
        .pf-row-index {
          padding-top: 0;
        }
        .pf-sec {
          grid-template-columns: minmax(0, 1fr);
          padding: 32px 0;
        }
        .pf-sec-label {
          position: static;
        }
        .pf-pager {
          grid-template-columns: minmax(0, 1fr);
        }
        .pf-pager .pf-next {
          grid-column: 1;
          text-align: left;
        }
      }
    `}
  />
)
