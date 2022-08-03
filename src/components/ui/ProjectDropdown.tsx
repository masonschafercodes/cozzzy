import React from 'react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon, PencilAltIcon } from '@heroicons/react/solid';
import { Button } from './Button';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

export default function ProjectDropdown() {
	return (
		<>
			<Menu as="div" className="relative inline-block text-left">
				<div>
					<Menu.Button className="bg-transparent rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-brand-500">
						<span className="sr-only">Open options</span>
						<DotsVerticalIcon className="h-5 w-5" aria-hidden="true" />
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
					<Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-brand-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
						<div className="py-1">
							<Menu.Item>
								{({ active }) => (
									<Button
										href="/projects/new"
										className={classNames(
											active ? 'bg-brand-500 text-gray-200' : 'text-gray-200',
											'group flex items-center px-4 py-2 text-sm',
										)}
									>
										<PencilAltIcon
											className="mr-3 h-5 w-5 text-gray-200 group-hover:text-gray-300"
											aria-hidden="true"
										/>
										New Project
									</Button>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</>
	);
}
