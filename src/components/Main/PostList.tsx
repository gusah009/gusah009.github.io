import React, { FunctionComponent } from 'react';
import PostItem from 'components/Main/PostItem';
import { PostListItemType } from 'types/PostItem.types';

type PostListProps = {
  posts: PostListItemType[];
};

const PostList: FunctionComponent<PostListProps> = function ({ posts }) {
  return (
    // PostListWrapper
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-5 w-full md:w-[768px] my-0 mx-auto py-12 px-5 md:px-0 md:pt-12 md:pb-24">
      {posts.map(({ node: { id, frontmatter } }: PostListItemType) => (
        <PostItem {...frontmatter} link="https://www.google.co.kr/" key={id} />
      ))}
    </div>
  );
};

export default PostList;
