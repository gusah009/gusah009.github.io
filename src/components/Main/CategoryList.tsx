import React, { FunctionComponent } from 'react';
import { Link } from 'gatsby';

export type CategoryListProps = {
  selectedCategory: string;
  categoryList: {
    // 프로퍼티 이름은 문자열, 프로퍼티 값은 숫자임을 나타내는 타입 표기 방법
    [key: string]: number;
  };
};

const CategoryList: FunctionComponent<CategoryListProps> = function ({
  selectedCategory,
  categoryList,
}) {
  return (
    // CategoryListWrapper
    <div className="flex flex-wrap w-full md:w-[768px] mt-12 md:mt-24 mx-auto mb-0 px-5 md:px-0">
      {Object.entries(categoryList).map(([name, count]) => (
        // categoryItem
        <Link
          to={`/?category=${name}`}
          key={name}
          className={`mr-5 py-1 px-0 text-sm md:text-lg cursor-pointer last-of-type:mr-0
              ${name === selectedCategory ? 'font-extrabold' : 'font-normal'}`}
        >
          #{name}({count})
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
