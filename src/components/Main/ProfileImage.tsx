import React, { FunctionComponent } from 'react';

const PROFILE_IMAGE_LINK =
  'https://avatars.githubusercontent.com/u/26597702?v=4';

const ProfileImage: FunctionComponent = function () {
  return (
    <img
      className=" w-20 h-20 md:w-32 md:h-32 mb-8 rounded-full"
      src={PROFILE_IMAGE_LINK}
      alt="Profile Image"
    />
  );
};

export default ProfileImage;
