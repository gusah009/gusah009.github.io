import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';

type PostItemProps = {
  title: string;
  date: string;
  categories: string[];
  summary: string;
  thumbnail: string;
  link: string;
};

const PostItem: FunctionComponent<PostItemProps> = function ({
  title,
  date,
  categories,
  summary,
  thumbnail,
  link,
}) {
  return (
    // PostItemWrapper
    <Link
      to={link}
      className="flex flex-col rounded-lg shadow-md cursor-pointer hover:shadow-lg"
    >
      {/* ThumbnailImage */}
      <img
        className="w-full h-44 rounded-lg object-cover"
        src={thumbnail}
        alt="Post Item Image"
      />
      {/* PostItemContent */}
      <div className=" flex-1 flex flex-col p-4">
        {/* Title */}
        <div className=" overflow-hidden mb-1 text-ellipsis whitespace-normal break-words text-xl font-bold line-clamp-2">
          {title}
        </div>
        {/* Date */}
        <div className="text-sm font-normal opacity-70">{date}</div>
        {/* Category */}
        <div className="flex flex-wrap my-2">
          {categories.map(category => (
            // CategoryItem
            <div
              className="my-0.5 mx-1 p-1 rounded-sm bg-black text-sm font-bold text-white"
              key={category}
            >
              {category}
            </div>
          ))}
        </div>
        {/* Summary */}
        <div className="overflow-hidden mt-auto text-ellipsis whitespace-normal break-words text-base opacity-80 line-clamp-2">
          {summary}
        </div>
      </div>
    </Link>
  );
};

export default PostItem;
