import React, { FunctionComponent } from 'react';
import '../tailwind.css';
import Introduction from 'components/Main/Introduction';
import CategoryList from 'components/Main/CategoryList';
import PostList from 'components/Main/PostList';
import Footer from 'components/Common/Footer';
import { PostListItemType } from 'types/PostItem.types';
import { graphql } from 'gatsby';

type IndexPageProps = {
  data: {
    allMarkdownRemark: {
      edges: PostListItemType[];
    };
  };
};

const CATEGORY_LIST = {
  All: 5,
  Web: 3,
  Mobile: 2,
};

const IndexPage: FunctionComponent<IndexPageProps> = function ({
  data: {
    allMarkdownRemark: { edges },
  },
}) {
  return (
    // Container
    <div className="flex flex-col h-full">
      <Introduction />
      <CategoryList selectedCategory="Web" categoryList={CATEGORY_LIST} />
      <PostList posts={edges} />
      <Footer />
    </div>
  );
};

export default IndexPage;

export const getPostList = graphql`
  query getPostList {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date, frontmatter___title] }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            categories
            thumbnail {
              publicURL
            }
          }
        }
      }
    }
  }
`;
