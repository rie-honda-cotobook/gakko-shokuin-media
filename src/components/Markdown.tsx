import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { TocItem } from './Toc';

export function Markdown({
  content,
  headingIds,
}: {
  content: string;
  headingIds?: TocItem[];
}) {
  let index = 0;
  const components = headingIds
    ? {
        h2: ({ children }: { children?: React.ReactNode }) => {
          const item = headingIds[index];
          index += 1;
          const id = item?.level === 2 ? item.id : undefined;
          return id ? <h2 id={id}>{children}</h2> : <h2>{children}</h2>;
        },
        h3: ({ children }: { children?: React.ReactNode }) => {
          const item = headingIds[index];
          index += 1;
          const id = item?.level === 3 ? item.id : undefined;
          return id ? <h3 id={id}>{children}</h3> : <h3>{children}</h3>;
        },
      }
    : undefined;

  return (
    <div className="prose-article">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
