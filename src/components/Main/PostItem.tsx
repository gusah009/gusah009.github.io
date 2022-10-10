import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { PostFrontmatterType } from 'types/PostItem.types';

type PostItemProps = PostFrontmatterType & { link: string };

const PostItem: FunctionComponent<PostItemProps> = function ({
  title,
  date,
  categories,
  summary,
  thumbnail: {
    childImageSharp: { gatsbyImageData },
  },
  link,
}) {
  return (
    // PostItemWrapper
    <Link
      to={link}
      className="flex flex-col rounded-lg shadow-md cursor-pointer hover:shadow-lg"
    >
      {/* ThumbnailImage */}
      <GatsbyImage
        className="w-full h-44 rounded-lg object-cover"
        image={gatsbyImageData}
        alt="Post Item Image"
      />
      {/* PostItemContent */}
      <div className=" flex-1 flex flex-col p-4">
        {/* Title */}
        <div className="h-14 overflow-hidden mb-1 text-ellipsis whitespace-normal break-words text-xl font-bold line-clamp-2">
          {title}
        </div>
        {/* Date */}
        <div className="text-sm font-normal opacity-70">{date}</div>
        {/* Category */}
        <div className="flex flex-wrap my-2">
          {categories.map(category => (
            // CategoryItem
            <div
              className="my-0.5 py-1 px-2 rounded-md bg-teal-700 text-sm font-semibold text-white"
              key={category}
            >
              {category}
            </div>
          ))}
        </div>
        {/* Summary */}
        <div className="h-12 overflow-hidden mt-auto text-ellipsis whitespace-normal break-words text-base opacity-80 line-clamp-2">
          {summary}
        </div>
      </div>
    </Link>
  );
};

export default PostItem;
