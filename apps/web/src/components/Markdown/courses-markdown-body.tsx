import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeMathjax from 'rehype-mathjax/svg';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import type { JoinedCourse, JoinedTutorialLight } from '@blms/types';

import { CourseCard } from '#src/organisms/course-card.tsx';
import { TutorialCard } from '#src/routes/_content/tutorials/-components/tutorial-card.js';

import YellowPen from '../../assets/courses/pencil.svg?react';
import VideoSVG from '../../assets/resources/video.svg?react';
import { CopyButton } from '../copy-button.tsx';
import { ReactPlayer } from '../react-player.tsx';

import { Blockquote } from './blockquote.tsx';
import { getCourse, getTutorial } from './utils/link-preview.tsx';

const CoursesMarkdownBody = ({
  content,
  assetPrefix,
  tutorials,
  courses,
  supportInlineLatex = false,
}: {
  content: string;
  assetPrefix: string;
  tutorials: JoinedTutorialLight[];
  courses: JoinedCourse[];
  supportInlineLatex: boolean;
}) => {
  return (
    <ReactMarkdown
      components={{
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
          <p className="text-blue-1000 text-base tracking-wide text-justify has-[>code]:text-left">
            {children}
          </p>
        ),
        a: ({ children, href = '' }) => {
          const tutorial = getTutorial(href, tutorials);
          if (tutorial) {
            return <TutorialCard tutorial={tutorial} href={href} />;
          }

          const course = getCourse(href, courses);
          if (course) {
            return (
              <div className="w-full max-w-[500px] md:max-w-[340px] mx-auto">
                <CourseCard course={course} />
              </div>
            );
          }

          return (
            <a
              href={href}
              target="_blank"
              className="underline text-newBlue-1"
              rel="noreferrer"
            >
              {children}
            </a>
          );
        },
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
          src?.includes('youtube.com') ||
          src?.includes('youtu.be') ||
          src?.includes('rumble.com') ? (
            <div className="mx-auto mb-2 max-w-full rounded-lg py-6">
              <div className=" flex items-center">
                <VideoSVG className="mb-2 ml-4 size-10" />
                <div className="ml-2">
                  <p className="text-lg font-medium text-blue-900">Video</p>
                </div>
              </div>
              <div className="relative pt-[56.25%]">
                {src?.includes('youtube.com') || src?.includes('youtu.be') ? (
                  <ReactPlayer
                    width={'100%'}
                    height={'100%'}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    className="mx-auto mb-2 rounded-lg"
                    controls={true}
                    url={src}
                    src={alt}
                  />
                ) : (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    className="mx-auto mb-2 rounded-lg"
                    src={src}
                    title={alt}
                    allowFullScreen
                  />
                )}
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
          <Blockquote mode={'light'}>{children}</Blockquote>
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

          const languageMatch = /language-(\w+)/.exec(className || '');
          const language = languageMatch
            ? languageMatch[1] === 'text'
              ? 'plaintext'
              : languageMatch[1]
            : 'plaintext';

          const shouldWrapLines =
            !languageMatch || ['text', 'plaintext'].includes(language);

          return isCodeBlock ? (
            <div className="relative">
              <SyntaxHighlighter
                style={atomDark}
                language={language}
                wrapLines={shouldWrapLines}
                PreTag="div"
              >
                {childrenText}
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
        [
          remarkMath,
          {
            singleDollarTextMath: supportInlineLatex,
          },
        ],
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

export default CoursesMarkdownBody;
