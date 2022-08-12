import React, { FunctionComponent } from 'react';
import '../tailwind.css';
import Introduction from 'components/Main/Introduction';
import CategoryList from 'components/Main/CategoryList';
import Footer from 'components/Common/Footer';

const CATEGORY_LIST = {
  All: 5,
  Web: 3,
  Mobile: 2,
};

const IndexPage: FunctionComponent = function () {
  return (
    // Container
    <div className="flex flex-col h-full">
      <Introduction />
      <CategoryList selectedCategory="Web" categoryList={CATEGORY_LIST} />
      <Footer />
    </div>
  );
};

export default IndexPage;
