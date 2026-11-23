import Link from "next/link"
import { NextPageWithLayout } from "src/types"
import { Shell } from "src/portfolio/Shell"
import { Metric } from "src/portfolio/Metric"
import { CASES, PROFILE } from "src/portfolio/content"

const PortfolioPage: NextPageWithLayout = () => (
  <Shell
    title={`${PROFILE.name} · 포트폴리오`}
    description={PROFILE.tagline}
    path="/portfolio"
  >
    <section className="pf-hero">
      <h1>{PROFILE.tagline}</h1>
      <p>{PROFILE.intro}</p>
    </section>
    <section aria-label="사례 목록">
      <div className="pf-list-head">
        <span>사례 {CASES.length}건</span>
        <span>결과</span>
      </div>
      {CASES.map((c) => (
        <Link key={c.slug} href={`/portfolio/${c.slug}`} className="pf-row">
          <span className="pf-row-index">{c.index}</span>
          <div>
            <div className="pf-row-meta">
              {c.org} · {c.period}
            </div>
            <h2 className="pf-row-title">{c.title}</h2>
            <p className="pf-row-summary">{c.summary}</p>
          </div>
          <Metric metric={c.metric} />
        </Link>
      ))}
    </section>
  </Shell>
)

PortfolioPage.bare = true

export default PortfolioPage
