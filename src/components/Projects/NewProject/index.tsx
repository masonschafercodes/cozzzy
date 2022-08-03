import { TEAM_SUBSCRIPTION } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react';
import { Button } from '~/components/ui/Button';
import { Locked } from '~/components/ui/Locked';
import Navbar from '~/components/ui/Navbar';

export function NewProject({
	teamId,
	subscriptionType,
	numberOfProjects,
}: {
	teamId: string;
	subscriptionType: TEAM_SUBSCRIPTION;
	numberOfProjects: number;
}) {
	const { data: session } = useSession();
	return (
		<>
			<Navbar session={session} />
			<div className="max-w-7xl my-10 mx-auto px-4 sm:px-6 lg:px-8">
				{subscriptionType === TEAM_SUBSCRIPTION.FREE &&
				numberOfProjects === 3 ? (
					<div>
						<Locked />
					</div>
				) : (
					<div>
						<h1 className="text-3xl font-bold leading-tight text-gray-300">
							New Project
						</h1>
						<div className="my-4 w-full">
							<div className="flex flex-col items-center justify-center w-full">
								<div className="mt-1 relative rounded-md shadow-sm w-1/3">
									<label
										htmlFor="project-name"
										className="block text-sm font-medium text-gray-300"
									>
										Project Name
									</label>
									<input
										type="text"
										name="project-name"
										id="project-name"
										className="shadow-sm p-3 mt-2 text-gray-300 bg-brand-700 focus:ring-brand-500 focus:border-brand-500 block w-full sm:text-sm border-gray-300 rounded-md"
										placeholder="Cool New Project"
									/>
								</div>
								<div className="mt-1 relative rounded-md shadow-sm w-1/3">
									<Button className="mt-4 w-full font-semibold rounded-full inline-flex items-center justify-center border border-transparent transition whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none text-gray-700 border-gray-400 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-brand-700 dark:hover:border-gray-600 dark:hover:text-gray-200 text-base px-4 py-2">
										Add Project
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
