import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';

interface PostContentProps {
  html: string;
}

const MarkdownRenderer = styled.div`
  // Markdown Style
  line-height: 1.8;
  font-size: 16px;
  font-weight: 400;

  // Apply Padding Attribute to All Elements
  p {
    padding: 3px 0;
  }

  // Adjust Heading Element Style
  h1,
  h2,
  h3 {
    font-weight: 800;
    margin-bottom: 5px;
  }

  * + h1,
  * + h2,
  * + h3 {
    margin-top: 25px;
  }

  hr + h1,
  hr + h2,
  hr + h3,
  h2 + h3 {
    margin-top: 0;
  }

  h1 {
    font-size: 30px;
  }

  h2 {
    font-size: 25px;
  }

  h3 {
    font-size: 20px;
  }

  // Adjust Quotation Element Style
  blockquote {
    margin: 30px 0;
    padding: 5px 15px;
    border-left: 2px solid #000000;
    font-weight: 800;
    font-style: italic;
  }

  // Adjust List Element Style
  ol,
  ul {
    margin-left: 20px;
    padding: 30px 0;
  }

  // Adjust Horizontal Rule style
  hr {
    border: 1px solid #000000;
    margin: 100px 0;
  }

  // Adjust Link Element Style
  a {
    color: #4263eb;
    text-decoration: underline;
  }
`;
/* // Adjust Code Style
  pre[class*='language-'] {
    margin: 10px 0;
    padding: 15px;
    font-size: 15px;
    background: black;
    border-radius: 5px;

    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.5);
      border-radius: 3px;
    }

    .token.keyword {
      color: #349eda;
    }
    .token.class-name {
      color: #00ccb0;
    }
    .token.function {
      color: #ffc15f;
    }
    .token.number {
      color: #afce9a;
    }
    .token.comment {
      color: #6ec55f;
    }
  }

  code[class*='language-'],
  pre[class*='language-'] {
    tab-size: 2;
  }

  .language-text {
    padding: 2px 4px;
    background: #e2e2e2;
    color: #f44;
  } */
const PostContent: FunctionComponent<PostContentProps> = function ({ html }) {
  return (
    // MarkdownRenderer
    <MarkdownRenderer
      className="flex flex-col w-auto md:w-[725px] lg:w-[768px] mx-3 sm:mx-auto my-0 py-14 px-5 md:py-16 md:px-0 break-all"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ); /* w-md 커스텀 만들어보기 */
};

export default PostContent;
