import React, { FunctionComponent, useMemo } from 'react';
import PostItem from 'components/Main/PostItem';
import { PostListItemType } from 'types/PostItem.types';

type PostListProps = {
  selectedCategory: string;
  posts: PostListItemType[];
};

const PostList: FunctionComponent<PostListProps> = function ({
  selectedCategory,
  posts,
}) {
  const postListData = useMemo(
    () =>
      posts.filter(
        ({
          node: {
            frontmatter: { categories },
          },
        }: PostListItemType) =>
          selectedCategory !== 'All'
            ? categories.includes(selectedCategory)
            : true,
      ),
    [selectedCategory],
  );

  return (
    // PostListWrapper
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-5 w-full md:w-[768px] my-0 mx-auto py-12 px-5 md:px-0 md:pt-12 md:pb-24">
      {postListData.map(({ node: { id, frontmatter } }: PostListItemType) => (
        <PostItem {...frontmatter} link="https://www.google.co.kr/" key={id} />
      ))}
    </div>
  );
};

export default PostList;
