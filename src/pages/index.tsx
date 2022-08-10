import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';
import './tailwind.css';

const IndexPage: FunctionComponent = function () {
  return (
    <div>
      <Link to="/info/">To Info</Link>
    </div>
  );
};

export default IndexPage;
