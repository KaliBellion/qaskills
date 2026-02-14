'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

interface SkillDescriptionProps {
  content: string;
}

export function SkillDescription({ content }: SkillDescriptionProps) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:mt-6 prose-headings:mb-3 prose-p:my-2 prose-pre:bg-muted prose-pre:text-foreground prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
