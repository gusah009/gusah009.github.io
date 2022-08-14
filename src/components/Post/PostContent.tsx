import React, { FunctionComponent } from 'react';

interface PostContentProps {
  html: string;
}

const PostContent: FunctionComponent<PostContentProps> = function ({ html }) {
  return (
    // MarkdownRenderer
    <div
      className="prose lg:prose-xl flex flex-col w-[768px] my-0 mx-auto py-24 px-0 break-all"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ); /* w-md 커스텀 만들어보기 */
};

export default PostContent;
