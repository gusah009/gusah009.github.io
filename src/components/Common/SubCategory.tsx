import React, { FunctionComponent } from 'react';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

type SubCategoryProps = {
  category: {
    name: string;
    href?: string;
    icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
    current: boolean;
    subNav:
      | {
          name: string;
          href: string;
          current: boolean;
        }[]
      | null;
  };
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const SubCategory: FunctionComponent<SubCategoryProps> = function ({
  category,
}) {
  return (
    <Menu>
      <Menu.Button
        className={classNames(
          category.current
            ? 'bg-indigo-200 text-slate-600'
            : 'text-slate-400 hover:bg-indigo-100',
          'relative w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md',
        )}
      >
        <category.icon
          className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300"
          aria-hidden="true"
        />
        {category.name}
        {category.subNav && (
          <ChevronDownIcon
            className={classNames(
              category.current ? 'text-violet-500' : 'text-violet-200',
              'mr-3 absolute right-0 h-5 w-5',
            )}
            aria-hidden="true"
          />
        )}
      </Menu.Button>
      <Menu.Items className="space-y-1">
        {category.subNav &&
          category.subNav.map(element => {
            return (
              <Menu.Item key={element.name}>
                <a
                  className={classNames(
                    element.current
                      ? 'bg-indigo-300 text-slate-600'
                      : 'text-slate-400 hover:bg-indigo-200',
                    'ml-6 pl-5 group flex items-center px-2 py-2 text-sm font-medium rounded-md bg-indigo-100',
                  )}
                  href={element.href}
                >
                  {element.name}
                </a>
              </Menu.Item>
            );
          })}
      </Menu.Items>
    </Menu>
  );
};

export default SubCategory;
