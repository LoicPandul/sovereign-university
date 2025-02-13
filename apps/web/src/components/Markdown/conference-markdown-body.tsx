import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeMathjax from 'rehype-mathjax/svg';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { CopyButton } from '../copy-button.tsx';

import { Blockquote } from './blockquote.tsx';

const remarkMathOptions = {
  singleDollarTextMath: false,
};

export const fixEmbedUrl = (src: string) => {
  if (src.includes('embed')) {
    return src;
  }

  if (src.includes('youtu')) {
    // biome-ignore lint/style/noParameterAssign: <explanation>
    src = src.replace('watch?v=', '');
  }

  switch (true) {
    case src.includes('youtu.be'): {
      return src.replace('youtu.be/', 'youtube.com/embed/');
    }
    case src.includes('youtube.com/live/'): {
      return src.replace('youtube.com/live/', 'youtube.com/embed/');
    }
    case src.includes('youtube.com'): {
      return src.replace('youtube.com/', 'youtube.com/embed/');
    }
    case src.includes('peertube.planb.network'): {
      return src.replace(
        'peertube.planb.network/videos/',
        'peertube.planb.network/videos/embed/',
      );
    }
    case src.includes('makertube.net'): {
      return src.replace('makertube.net/w/', 'makertube.net/videos/embed/');
    }
    default: {
      return src;
    }
  }
};

const ConferencesMarkdownBody = ({
  content,
  assetPrefix,
}: {
  content: string;
  assetPrefix?: string;
}) => {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="mt-6 text-xl font-semibold text-white sm:mt-10 sm:text-2xl">
            <div className="flex w-auto items-center">{children}</div>
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="ml-2 text-xl font-semibold text-white">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="desktop-subtitle1 text-newGray-1">{children}</p>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            className="underline text-newBlue-1"
            rel="noreferrer"
          >
            {children}
          </a>
        ),
        ol: ({ children }) => (
          <ol className="flex list-decimal flex-col pl-10 text-base tracking-wide">
            {children}
          </ol>
        ),
        ul: ({ children }) => (
          <ul className="flex list-disc flex-col pl-10 text-base tracking-wide">
            {children}
          </ul>
        ),
        li: ({ children }) => (
          <li className="my-1 text-base tracking-wide last:mb-0">{children}</li>
        ),
        table: ({ children }) => (
          <table className="w-full table-fixed border-collapse border border-blue-900">
            {children}
          </table>
        ),
        th: ({ children }) => (
          <th className="overflow-hidden text-ellipsis break-words border border-blue-900 px-2 py-1">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="overflow-hidden text-ellipsis break-words border border-blue-900 px-2 py-1">
            {children}
          </td>
        ),
        img: ({ src, alt }) =>
          src?.includes('youtube.com') ||
          src?.includes('youtu.be') ||
          src?.includes('peertube') ||
          src?.includes('makertube') ? (
            <div className="mx-auto max-w-full mb-2.5 md:mb-5 w-full aspect-video">
              <iframe
                width={'100%'}
                height={'100%'}
                className="mx-auto mb-2 rounded-lg"
                src={fixEmbedUrl(src)}
                title="Conference Replay"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : (
            <img
              className="mx-auto flex justify-center rounded-lg py-6"
              src={src}
              alt={alt}
            />
          ),
        blockquote: ({ children }) => (
          <Blockquote mode="dark">{children}</Blockquote>
        ),
        code({ className, children }) {
          const childrenText = String(children).replace(/\n$/, '');

          // Default to treating as inline code
          let isCodeBlock = false;

          if ((className || '').startsWith('language-')) {
            isCodeBlock = true;
          } else if (!className && children) {
            // If it contains line breaks, treat as a code block
            isCodeBlock = String(children).includes('\n');
          }

          return isCodeBlock ? (
            <div className="relative">
              <SyntaxHighlighter
                style={atomDark}
                language={/language-(\w+)/.exec(className || '')?.[1] || 'text'}
                PreTag="div"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
              <CopyButton text={childrenText} />
            </div>
          ) : (
            <code className="bg-newGray-4 px-1.5 rounded-lg font-mono inline-block text-sm">
              {children}
            </code>
          );
        },
      }}
      remarkPlugins={[
        remarkGfm,
        rehypeUnwrapImages,
        [remarkMath, remarkMathOptions],
      ]}
      rehypePlugins={[rehypeMathjax]}
      urlTransform={(src) =>
        src.startsWith('http') ? src : `${assetPrefix}/${src}`
      }
    >
      {content}
    </ReactMarkdown>
  );
};

export default ConferencesMarkdownBody;
