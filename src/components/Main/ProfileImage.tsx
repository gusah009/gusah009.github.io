import React, { FunctionComponent } from 'react';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';

type ProfileImageProps = {
  profileImage: IGatsbyImageData;
};

const ProfileImage: FunctionComponent<ProfileImageProps> = function ({
  profileImage,
}) {
  return (
    <GatsbyImage
      className=" w-20 h-20 md:w-32 md:h-32 mb-8 rounded-full"
      image={profileImage}
      alt="Profile Image"
    />
  );
};

export default ProfileImage;
