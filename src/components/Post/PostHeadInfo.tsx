import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { ArrowCircleLeftIcon } from '@heroicons/react/solid';

export type PostHeadInfoProps = {
  title: string;
  date: string;
  categories: string[];
};

const PrevPageIcon = styled.div`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffffff;
  color: #000000;
  font-size: 22px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

const PostHeadInfo: FunctionComponent<PostHeadInfoProps> = function ({
  title,
  date,
  categories,
}) {
  const goBackPage = () => window.history.back(); // TODO 훅 사용해서 해보기

  return (
    // PostHeadInfoWrapper
    <div className="flex flex-col w-[768px] h-full my-0 mx-auto py-14 px-0 text-white">
      <ArrowCircleLeftIcon
        className=" grid place-items-center w-10 h-10 text-white cursor-pointer"
        onClick={goBackPage}
      />
      {/* Title */}
      <div className=" overflow-hidden break-words mt-auto text-ellipsis whitespace-normal line-clamp-2 text-5xl font-bold">
        {title}
      </div>
      {/* PostData */}
      <div className="flex justify-between items-center mt-4 text-lg font-semibold">
        <div>{categories.join(' / ')}</div>
        <div>{date}</div>
      </div>
    </div>
  );
};

export default PostHeadInfo;
