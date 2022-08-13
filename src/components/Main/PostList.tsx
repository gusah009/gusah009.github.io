import React, { FunctionComponent, useMemo } from 'react';
import PostItem from 'components/Main/PostItem';
import { PostListItemType } from 'types/PostItem.types';
import useInfiniteScroll, {
  useInfiniteScrollType,
} from 'hooks/useInfiniteScroll';

type PostListProps = {
  selectedCategory: string;
  posts: PostListItemType[];
};

const PostList: FunctionComponent<PostListProps> = function ({
  selectedCategory,
  posts,
}) {
  const { containerRef, postList }: useInfiniteScrollType = useInfiniteScroll(
    selectedCategory,
    posts,
  );

  return (
    // PostListWrapper
    <div
      ref={containerRef}
      className=" grid grid-cols-1 md:grid-cols-2 gap-5 w-full md:w-[768px] my-0 mx-auto py-12 px-5 md:px-0 md:pt-12 md:pb-24"
    >
      {postList.map(
        ({
          node: {
            id,
            fields: { slug },
            frontmatter,
          },
        }: PostListItemType) => (
          <PostItem {...frontmatter} link={slug} key={id} />
        ),
      )}
    </div>
  );
};

export default PostList;
