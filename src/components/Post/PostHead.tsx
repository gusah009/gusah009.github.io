import React, { FunctionComponent } from 'react';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import PostHeadInfo, { PostHeadInfoProps } from 'components/Post/PostHeadInfo';

type PostHeadProps = PostHeadInfoProps & {
  thumbnail: IGatsbyImageData;
};

const PostHead: FunctionComponent<PostHeadProps> = function ({
  title,
  date,
  categories,
  thumbnail,
}) {
  return (
    // PostHeadWrapper
    <div className="w-full h-72 md:h-96">
      <GatsbyImage
        image={thumbnail}
        alt="thumbnail"
        className="!absolute -z-10 w-full h-72 md:h-96 object-cover brightness-50 bg-white"
      />
      <PostHeadInfo title={title} date={date} categories={categories} />
    </div>
  );
};

export default PostHead;
