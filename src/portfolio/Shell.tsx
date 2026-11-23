import Head from "next/head"
import Link from "next/link"
import { ReactNode } from "react"
import { PortfolioGlobal } from "./styles"
import { PROFILE } from "./content"

type Props = {
  title: string
  description: string
  path: string
  children: ReactNode
}

const SITE = "https://parkaward.dev"

export const Shell = ({ title, description, path, children }: Props) => (
  <>
    <PortfolioGlobal />
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`${SITE}${path}`} />
      <meta name="twitter:card" content="summary" />
      <link rel="canonical" href={`${SITE}${path}`} />
    </Head>
    <div className="pf-wrap">
      <header className="pf-top">
        <Link href="/portfolio" className="pf-brand">
          {PROFILE.name} · {PROFILE.role}
        </Link>
        <nav className="pf-links" aria-label="링크">
          {PROFILE.links.map((l) =>
            l.href.startsWith("/") ? (
              <Link key={l.label} href={l.href}>
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            )
          )}
        </nav>
      </header>
      <main>{children}</main>
      <footer className="pf-foot">
        <span>
          수치는 당시 로그와 측정값입니다. 근거가 없는 항목은 비워 두고 그렇게
          적었습니다.
        </span>
        <a href="https://github.com/sangjuun-park">github.com/sangjuun-park</a>
      </footer>
    </div>
  </>
)
