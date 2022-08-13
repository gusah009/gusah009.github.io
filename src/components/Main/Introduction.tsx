import React, { FunctionComponent } from 'react';
import { IGatsbyImageData } from 'gatsby-plugin-image';
import ProfileImage from 'components/Main/ProfileImage';

type IntroductionProps = {
  profileImage: IGatsbyImageData;
};

const Introduction: FunctionComponent<IntroductionProps> = function ({
  profileImage,
}) {
  return (
    // Background
    <div className=" w-full bg-gradient-to-bl from-gray-700 via-gray-900 to-black text-white">
      {/* // Wrapper */}
      <div className="flex flex-col justify-center items-start w-full h-72 md:w-[768px] md:h-[400px] m-auto px-5 md:px-0">
        <ProfileImage profileImage={profileImage} />

        <div>
          {/* // SubTitle */}
          <div className=" text-sm md:text-xl font-bold">Nice to Meet You!</div>
          {/* // Title */}
          <div className="mt-1 flex whitespace-pre text-2xl md:text-3xl font-bold">
            I'm developer who always thinks about
            <div className=" text-blue-500"> "Why?"</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
