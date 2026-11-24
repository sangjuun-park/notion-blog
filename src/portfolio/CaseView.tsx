import Link from "next/link"
import { Block, CASES, PortfolioCase } from "./content"
import { Diagram } from "./Diagrams"
import { Metric } from "./Metric"

const BlockView = ({ block }: { block: Block }) => {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>
    case "list":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case "note":
      return <p className="pf-note">{block.text}</p>
    case "table":
      return (
        <div>
          <div className="pf-tablewrap">
            <table>
              <thead>
                <tr>
                  {block.head.map((h, i) => (
                    <th key={i} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && <p className="pf-tablecap">{block.caption}</p>}
        </div>
      )
    case "diagram":
      return (
        <figure className="pf-figure">
          <Diagram id={block.id} />
          <figcaption>{block.caption}</figcaption>
        </figure>
      )
  }
}

export const CaseView = ({ item }: { item: PortfolioCase }) => {
  const i = CASES.findIndex((c) => c.slug === item.slug)
  const prev = i > 0 ? CASES[i - 1] : undefined
  const next = i < CASES.length - 1 ? CASES[i + 1] : undefined
  return (
    <>
      <Link href="/portfolio" className="pf-back">
        ← 전체 목록
      </Link>
      <article>
        <div className="pf-case-head">
          <div className="pf-kicker">
            {item.index} · {item.org} · {item.period}
          </div>
          <h1>{item.title}</h1>
          <dl className="pf-facts">
            <div>
              <dt>맡은 일</dt>
              <dd>{item.role}</dd>
            </div>
            <div>
              <dt>기술</dt>
              <dd>{item.stack}</dd>
            </div>
          </dl>
        </div>
        <div className="pf-result">
          <Metric metric={item.metric} />
        </div>
        {item.sections.map((s) => (
          <section key={s.id} className="pf-sec" aria-labelledby={`h-${s.id}`}>
            <h2 id={`h-${s.id}`} className="pf-sec-label">
              {s.label}
            </h2>
            <div className="pf-sec-body">
              {s.blocks.map((b, k) => (
                <BlockView key={k} block={b} />
              ))}
            </div>
          </section>
        ))}
      </article>
      <nav className="pf-pager" aria-label="다른 사례">
        {prev && (
          <Link href={`/portfolio/${prev.slug}`}>
            <small>← 이전 사례</small>
            <span className="pf-pager-title">{prev.title}</span>
          </Link>
        )}
        {next && (
          <Link href={`/portfolio/${next.slug}`} className="pf-next">
            <small>다음 사례 →</small>
            <span className="pf-pager-title">{next.title}</span>
          </Link>
        )}
      </nav>
    </>
  )
}
