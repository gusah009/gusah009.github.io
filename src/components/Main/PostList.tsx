import React, { FunctionComponent } from 'react';
import PostItem from 'components/Main/PostItem';

const POST_ITEM_DATA = {
  title: 'Post Item Title',
  date: '2020.01.29.',
  categories: ['Web', 'Frontend', 'Testing'],
  summary:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident repellat doloremque fugit quis rem temporibus! Maxime molestias, suntrem debitis odit harum impedit. Modi cupiditate harum dignissimos eos in corrupti!',
  thumbnail:
    'https://spring.io/images/spring-logo-9146a4d3298760c2e7e49595184e1975.svg',
  link: 'https://www.google.co.kr/',
};

const PostList: FunctionComponent = function () {
  return (
    // PostListWrapper
    <div className=" grid grid-cols-2 gap-5 w-[768px] my-0 mx-auto pt-12 pb-24">
      <PostItem {...POST_ITEM_DATA} />
      <PostItem {...POST_ITEM_DATA} />
      <PostItem {...POST_ITEM_DATA} />
      <PostItem {...POST_ITEM_DATA} />
    </div>
  );
};

export default PostList;
