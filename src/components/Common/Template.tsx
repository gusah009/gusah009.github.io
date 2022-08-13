import React, { FunctionComponent, ReactNode } from 'react';
import Footer from 'components/Common/Footer';

type TemplateProps = {
  children: ReactNode;
};

const Template: FunctionComponent<TemplateProps> = function ({ children }) {
  return (
    /* Container */
    <div className="flex flex-col h-full">
      {children}
      <Footer />
    </div>
  );
};

export default Template;
