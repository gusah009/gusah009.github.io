import React, { FunctionComponent } from 'react';

const Footer: FunctionComponent = function () {
  return (
    // FooterWrapper
    <footer className=" grid place-items-center mt-auto p-12 text-xs md:text-sm text-center leading-6 text-gray-600">
      Thank You for Visiting My Blog, Have a Good Day 😆
      <br />© 2022 정현모, Powered By Gatsby.
    </footer>
  );
};

export default Footer;
