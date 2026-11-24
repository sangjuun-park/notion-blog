import { GetStaticPaths, GetStaticProps } from "next"
import { NextPageWithLayout } from "src/types"
import { Shell } from "src/portfolio/Shell"
import { CaseView } from "src/portfolio/CaseView"
import { CASES, getCase, PortfolioCase } from "src/portfolio/content"

type Props = { slug: string }

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: CASES.map((c) => ({ params: { slug: c.slug } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const slug = context.params?.slug
  if (typeof slug !== "string" || !getCase(slug)) {
    return { notFound: true }
  }
  return { props: { slug } }
}

const CasePage: NextPageWithLayout<Props> = ({ slug }) => {
  const item = getCase(slug) as PortfolioCase
  return (
    <Shell
      title={`${item.title} · 박상준`}
      description={item.summary}
      path={`/portfolio/${item.slug}`}
    >
      <CaseView item={item} />
    </Shell>
  )
}

CasePage.bare = true

export default CasePage
