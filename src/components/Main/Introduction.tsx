import React, { FunctionComponent } from 'react';
import ProfileImage from 'components/Main/ProfileImage';

const Introduction: FunctionComponent = function () {
  return (
    // Background
    <div className=" w-full bg-gradient-to-bl from-gray-700 via-gray-900 to-black text-white">
      {/* // Wrapper */}
      <div className="flex flex-col justify-center items-start w-[768px] h-[400px] m-auto">
        <ProfileImage />

        <div>
          {/* // SubTitle */}
          <div className="text-xl font-bold">Nice to Meet You!</div>
          {/* // Title */}
          <div className="mt-1 flex whitespace-pre text-3xl font-bold">
            I'm developer who always thinks about
            <div className=" text-blue-500"> "Why?"</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
