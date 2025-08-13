import React from 'react'
import MarkdownIt from "markdown-it"

interface MarkdownRendererProps {
  markdownText: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdownText }) => {
  const md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true
  })

  const htmlContent = md.render(markdownText)

  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}

export default MarkdownRenderer
