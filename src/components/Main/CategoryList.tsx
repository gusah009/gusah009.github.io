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
    <div className="flex flex-wrap w-full md:w-[725px] lg:w-[840px] mt-5 md:mt-10 mx-auto mb-0 px-5 md:px-0">
      {Object.entries(categoryList).map(([name, count]) => (
        // categoryItem
        <Link
          to={`/?category=${name}`}
          key={name}
          className={`mr-4 py-1 px-2 rounded-md text-sm md:text-lg text-zinc-800 cursor-pointer last-of-type:mr-0
              ${name === selectedCategory ? 'font-extrabold' : 'font-normal'}`}
        >
          {name} ({count})
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
