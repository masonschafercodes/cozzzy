/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import React from 'react';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

export default function Navbar({ session }: { session: Session | null }) {
	const router = useRouter();
	return (
		<Disclosure as="nav">
			{({ open }) => (
				<>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<h1
										onClick={() => router.push('/')}
										className="hidden lg:block h-8 w-auto font-semibold text-2xl hover:cursor-pointer"
									>
										Cozzzy
									</h1>
									<h1
										onClick={() => router.push('/')}
										className="block lg:hidden h-8 w-auto font-semibold text-2xl hover:cursor-pointer"
									>
										Cozzzy
									</h1>
								</div>
							</div>
							{session ? (
								<div className="hidden sm:ml-6 sm:block">
									<div className="flex items-center">
										{/* Profile dropdown */}
										<Menu as="div" className="ml-3 relative">
											<div>
												<Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
													<span className="sr-only">Open user menu</span>
													<img
														className="h-8 w-8 rounded-full"
														src={
															session
																? (session.user?.image as string)
																: 'https://st4.depositphotos.com/4329009/19956/v/600/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg'
														}
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
												<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 z-40 rounded-md shadow-lg py-1 bg-brand-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
													<Menu.Item>
														{({ active }) => (
															<a
																href="/team"
																className={classNames(
																	active ? 'bg-brand-500' : '',
																	'block px-4 py-2 text-sm text-gray-400',
																)}
															>
																Team
															</a>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<a
																href="/projects"
																className={classNames(
																	active ? 'bg-brand-500' : '',
																	'block px-4 py-2 text-sm text-gray-400',
																)}
															>
																Projects
															</a>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<a
																href="/settings"
																className={classNames(
																	active ? 'bg-brand-500' : '',
																	'block px-4 py-2 text-sm text-gray-400',
																)}
															>
																Settings
															</a>
														)}
													</Menu.Item>
													<Menu.Item>
														{({ active }) => (
															<button
																className={classNames(
																	active ? 'bg-brand-500' : '',
																	'block px-4 py-2 text-sm text-gray-400 w-full text-left',
																)}
																onClick={() => signOut()}
															>
																Sign out
															</button>
														)}
													</Menu.Item>
												</Menu.Items>
											</Transition>
										</Menu>
									</div>
								</div>
							) : (
								<button
									onClick={() => signIn()}
									className="font-semibold rounded-full inline-flex items-center justify-center border border-transparent transition whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none text-gray-700 border-gray-400 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800 dark:hover:border-gray-600 dark:hover:text-gray-200 text-base px-4 py-2"
								>
									Sign in
								</button>
							)}
							<div className="-mr-2 flex sm:hidden">
								{/* Mobile menu button */}
								<Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
									<span className="sr-only">Open main menu</span>
									{open ? (
										<XIcon className="block h-6 w-6" aria-hidden="true" />
									) : (
										<MenuIcon className="block h-6 w-6" aria-hidden="true" />
									)}
								</Disclosure.Button>
							</div>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						{session ? (
							<div className="pt-4 pb-3 border-t border-gray-700">
								<div className="flex items-center px-5">
									<div className="flex-shrink-0">
										<img
											className="h-10 w-10 rounded-full"
											src={
												session
													? (session.user?.image as string)
													: 'https://st4.depositphotos.com/4329009/19956/v/600/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg'
											}
											alt=""
										/>
									</div>
									<div className="ml-3">
										<div className="text-base font-medium text-white">
											{session.user?.name}
										</div>
										<div className="text-sm font-medium text-gray-400">
											{session.user?.email}
										</div>
									</div>
								</div>
								<div className="mt-3 px-2 space-y-1">
									<Disclosure.Button
										as="a"
										href="/team"
										className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:bg-brand-800"
									>
										Team
									</Disclosure.Button>
									<Disclosure.Button
										as="a"
										href="/projects"
										className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:bg-brand-800"
									>
										Projects
									</Disclosure.Button>
									<Disclosure.Button
										as="a"
										href="/settings"
										className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:bg-brand-800"
									>
										Settings
									</Disclosure.Button>
									<Disclosure.Button
										as="button"
										onClick={() => signOut()}
										className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:bg-brand-800 w-full text-left"
									>
										Sign out
									</Disclosure.Button>
								</div>
							</div>
						) : (
							<div className="pt-4 pb-3 border-t border-gray-700">
								<div className="mt-3 px-2 space-y-1">
									<Disclosure.Button
										as="button"
										onClick={() => signIn()}
										className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 w-full text-left"
									>
										Sign in
									</Disclosure.Button>
								</div>
							</div>
						)}
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
