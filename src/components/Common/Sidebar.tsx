import { Fragment, useState, useEffect, ReactNode } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  BellIcon,
  HomeIcon,
  MenuAlt2Icon,
  ChevronRightIcon,
  XIcon,
} from '@heroicons/react/outline';
import { SearchIcon } from '@heroicons/react/solid';
import { ClipboardListIcon } from '@heroicons/react/solid';
import SubCategory from './SubCategory';
import { Tab, Disclosure } from '@headlessui/react';
import { Link } from 'gatsby';
const profileImg = 'https://avatars.githubusercontent.com/u/26597702?v=4';

type SidebarProps = {
  children: ReactNode;
};

const userNavigation = [
  { name: 'whoami', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '/signIn' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Sidebar = ({ children }: SidebarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarForDeskOpen, setSidebarForDeskOpen] = useState(true);
  const categories = {
    Home: [],
    JAVA: [
      {
        name: 'Clean Code',
        href: '/?category=clean_code',
      },
      {
        name: 'Effective Java',
        href: '/?category=effective_java',
      },
      {
        name: 'etc',
        href: '/?category=etc',
      },
    ],
    PROJECTS: [
      {
        name: 'PNU-pathfinder',
        href: '/?category=pathfinder',
      },
      {
        name: 'keeper homepage',
        href: '/?category=keeper_homepage',
      },
    ],
    'COMPUTER SCIENCE': [],
    ETC: [
      {
        name: 'Git',
        href: '/?category=Git',
      },
    ],
    일상: [
      {
        name: '후기',
        href: '/?category=후기',
      },
    ],
  };

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="w-full flex flex-col items-center px-4 mt-10">
                  <img
                    className="w-20 h-20 mb-3 rounded-md"
                    src={profileImg}
                    alt="profilte"
                  />
                  <div className=" text-slate-900 text-md font-bold">
                    gusah009
                  </div>
                </div>
                {/*  SubNav -> */}
                <div className="w-full px-5 pt-12">
                  {Object.entries(categories).map(
                    ([category, SubCategories]) => (
                      <Disclosure key={category}>
                        {({ open }) => (
                          <Fragment>
                            <Disclosure.Button className="flex mt-1 w-full justify-between ui-not-open:rounded-md ui-open:rounded-t-md px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-200 ui-not-open:bg-white">
                              <span>{category}</span>
                              <ChevronRightIcon
                                className={`${
                                  open ? 'rotate-90 transform' : ''
                                } h-5 w-5 text-slate-500`}
                              />
                            </Disclosure.Button>
                            <Tab.Group vertical>
                              <div className="ml-4 border-l-2">
                                {SubCategories.map(subCategory => (
                                  <Disclosure.Panel key={subCategory.name}>
                                    <Link to={subCategory.href}>
                                      <Tab
                                        key={subCategory.name}
                                        className={({ selected }) =>
                                          classNames(
                                            selected
                                              ? 'text-slate-600 font-bold'
                                              : 'text-slate-400 hover:bg-slate-200 font-medium',
                                            'w-full group flex items-center px-4 py-2 text-sm',
                                          )
                                        }
                                      >
                                        {subCategory.name}
                                      </Tab>
                                    </Link>
                                  </Disclosure.Panel>
                                ))}
                              </div>
                            </Tab.Group>
                          </Fragment>
                        )}
                      </Disclosure>
                    ),
                  )}
                </div>
                {/* <- SubNav */}
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div
        className={`hidden ${
          sidebarForDeskOpen
            ? 'lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0'
            : ''
        }`}
      >
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-col flex-grow bg-white shadow-lg shadow-slate-200 overflow-y-auto">
          <div className="w-full flex flex-col items-center px-4 mt-10 ">
            <img
              className="w-20 h-20 mb-3 rounded-md"
              src={profileImg}
              alt="profilte"
            />
            <div className=" text-slate-900 text-md font-bold">gusah009</div>
          </div>
          {/*  SubNav -> */}
          <div className="w-full px-3 pt-12">
            {Object.entries(categories).map(([category, SubCategories]) => (
              <Disclosure key={category}>
                {({ open }) => (
                  <Fragment>
                    <Disclosure.Button className="flex mt-1 w-full justify-between ui-not-open:rounded-md ui-open:rounded-t-md px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-200">
                      <span>{category}</span>
                      <ChevronRightIcon
                        className={`${
                          open ? 'rotate-90 transform' : ''
                        } h-5 w-5 text-slate-500`}
                      />
                    </Disclosure.Button>
                    <Tab.Group vertical>
                      <div className="ml-4 border-l-2">
                        {SubCategories.map(subCategory => (
                          <Disclosure.Panel key={subCategory.name}>
                            <Link to={subCategory.href}>
                              <Tab
                                key={subCategory.name}
                                className={({ selected }) =>
                                  classNames(
                                    selected
                                      ? 'text-slate-600 font-extrabold'
                                      : 'text-slate-400 hover:bg-slate-200 font-medium',
                                    'w-full group flex items-center px-4 py-2 text-sm',
                                  )
                                }
                              >
                                {subCategory.name}
                              </Tab>
                            </Link>
                          </Disclosure.Panel>
                        ))}
                      </div>
                    </Tab.Group>
                  </Fragment>
                )}
              </Disclosure>
            ))}
          </div>
          {/* <- SubNav */}
        </div>
      </div>

      <div
        className={` ${
          sidebarForDeskOpen ? 'lg:pl-64' : ''
        } flex flex-col flex-1`}
      >
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-12 shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 hidden ${
              sidebarForDeskOpen ? '' : 'lg:block'
            }`}
            onClick={() => setSidebarForDeskOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`border-r rounded-r-md border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 hidden ${
              sidebarForDeskOpen ? 'lg:block' : ''
            } `}
            onClick={() => setSidebarForDeskOpen(false)}
          >
            <span className="sr-only">Open sidebar</span>
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex items-center">
              {/* Profile dropdown */}
              <Menu as="div" className="mr-2 absolute right-0">
                <div>
                  <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={profileImg}
                      alt=""
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map(item => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <a
                            href={item.href}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700',
                            )}
                          >
                            {item.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main>
          {/* content */}
          {children}
          {/* End content */}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
