import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeMathjax from 'rehype-mathjax';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import YellowPen from '../../assets/courses/pencil.svg?react';
import VideoSVG from '../../assets/resources/video.svg?react';
import { ReactPlayer } from '../react-player.tsx';

import { Blockquote } from './blockquote.tsx';

const GeneralMarkdownBody = ({
  content,
  assetPrefix,
}: {
  content: string;
  assetPrefix: string;
}) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h2 className="mt-6 text-2xl font-bold text-orange-600 sm:mt-10 sm:text-3xl ">
            <div className="flex  w-auto items-center">
              <YellowPen className="mr-2 size-6 bg-contain sm:hidden " />
              {children}
            </div>
          </h2>
        ),
        h2: ({ children }) => (
          <h2 className="mt-6 text-3xl font-semibold text-orange-600 sm:mt-10 sm:text-2xl ">
            <div className="flex w-auto items-center">
              <YellowPen className="mr-2 size-6 bg-contain sm:hidden " />
              {children}
            </div>
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-3xl font-medium text-orange-500">{children}</h3>
        ),
        h4: ({ children }) => (
          <h3 className="text-2xl font-medium">{children}</h3>
        ),
        p: ({ children }) => (
          <p className=" text-blue-1000 text-base tracking-wide text-justify">
            {children}
          </p>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            className=" text-blue-500 "
            rel="noreferrer"
          >
            {children}
          </a>
        ),
        ol: ({ children }) => (
          <ol className="flex list-decimal flex-col pl-10 text-base tracking-wide text-justify">
            {children}
          </ol>
        ),
        ul: ({ children }) => (
          <ul className="flex list-disc flex-col pl-10 text-base tracking-wide text-justify">
            {children}
          </ul>
        ),
        li: ({ children }) => (
          <li className="my-1 text-base tracking-wide last:mb-0 text-justify">
            {children}
          </li>
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
          src?.includes('youtube.com') || src?.includes('youtu.be') ? (
            <div className="mx-auto mb-2 max-w-full rounded-lg py-6">
              <div className=" flex items-center">
                <VideoSVG className="mb-2 ml-4 size-10" />
                <div className="ml-2">
                  <p className="text-lg font-medium text-blue-900">Video</p>
                </div>
              </div>
              <div className="relative pt-[56.25%]">
                <ReactPlayer
                  width={'100%'}
                  height={'100%'}
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  className="mx-auto mb-2 rounded-lg"
                  controls={true}
                  url={src}
                  src={alt}
                />
              </div>
            </div>
          ) : (
            <img
              className="mx-auto flex justify-center rounded-lg py-6"
              src={src}
              alt={alt}
            />
          ),
        blockquote: ({ children }) => (
          <Blockquote mode="light">{children}</Blockquote>
        ),
        code({ className, children }) {
          const match = /language-(\w+)/.exec(className || '');
          return (
            <SyntaxHighlighter
              style={atomDark}
              language={match ? match[1] : undefined}
              PreTag="div"
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          );
        },
      }}
      remarkPlugins={[remarkGfm, rehypeUnwrapImages, remarkMath]}
      rehypePlugins={[rehypeMathjax]}
      urlTransform={(src) =>
        src.startsWith('http') ? src : `${assetPrefix}/${src}`
      }
    >
      {content}
    </ReactMarkdown>
  );
};

export default GeneralMarkdownBody;
