import { createResource } from "solid-js"
import { Markdown, MaybeLoading } from "~/components"
import { useT, useManageTitle } from "~/hooks"

const fetchReadme = async () =>
  await (
    await fetch("https://gh-proxy.com/raw.githubusercontent.com/dinghy421/articles/refs/heads/main/%E5%B1%9E%E6%80%A7%E9%80%9F%E5%88%B7.md")
  ).text()

const About = () => {
  const t = useT()
  useManageTitle("article.sidemenu.about")
  const [readme] = createResource(fetchReadme)
  return (
    <MaybeLoading loading={readme.loading}>
      <Markdown children={readme()} />
    </MaybeLoading>
  )
}

export default About
