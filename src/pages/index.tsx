import React, { FunctionComponent } from 'react';
import '../tailwind.css';
import Introduction from 'components/Main/Introduction';
import Footer from 'components/Common/Footer';

const IndexPage: FunctionComponent = function () {
  return (
    // Container
    <div className="flex flex-col h-full">
      <Introduction />
      <Footer />
    </div>
  );
};

export default IndexPage;
