import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { Link } from 'gatsby';

const NotFoundPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const NotFoundText = styled.div`
  font-size: 150px;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 100px;
  }
`;
const NotFoundDescription = styled.div`
  font-size: 25px;
  text-align: center;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const GoToMainButton = styled(Link)`
  margin-top: 30px;
  font-size: 20px;
  text-decoration: underline;

  &:hover {
    text-decoration: underline;
  }
`;

const NotFoundPage: FunctionComponent = function () {
  return (
    // NotFoundPageWrapper
    <div className="flex flex-col justify-center items-center">
      {/* NotFoundText */}
      <div className="text-7xl md:text-9xl font-extrabold">404</div>
      {/* NotFoundDescription */}
      <div className=" text-lg md:text-2xl text-center leading-5">
        찾을 수 없는 페이지입니다. <br />
        다른 콘텐츠를 보러 가보시겠어요?
      </div>
      <Link className="mt-7 text-xl underline hover:underline" to="/">
        메인으로
      </Link>
    </div>
  );
};

export default NotFoundPage;
