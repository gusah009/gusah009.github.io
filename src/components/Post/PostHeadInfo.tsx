import React, { FunctionComponent } from 'react';
import { ArrowCircleLeftIcon } from '@heroicons/react/solid';

export type PostHeadInfoProps = {
  title: string;
  date: string;
  categories: string[];
};

const PostHeadInfo: FunctionComponent<PostHeadInfoProps> = function ({
  title,
  date,
  categories,
}) {
  const goBackPage = () => window.history.back(); // TODO 훅 사용해서 해보기

  return (
    // PostHeadInfoWrapper
    <div className="flex flex-col w-full md:w-[725px] lg:w-[840px] h-full my-0 mx-auto py-10 px-5 md:py-14 md:px-0 text-white">
      <ArrowCircleLeftIcon
        className=" grid place-items-center w-7 h-7 md:w-10 md:h-10 text-white cursor-pointer"
        onClick={goBackPage}
      />
      {/* Title */}
      <div className=" overflow-hidden break-words mt-auto text-ellipsis whitespace-normal line-clamp-2 text-2xl md:text-5xl font-bold">
        {title}
      </div>
      {/* PostData */}
      <div className="flex justify-between items-start md:items-center mt-4 text-base md:text-lg font-normal md:font-semibold">
        <div>{categories.join(' / ')}</div>
        <div>{date}</div>
      </div>
    </div>
  );
};

export default PostHeadInfo;
