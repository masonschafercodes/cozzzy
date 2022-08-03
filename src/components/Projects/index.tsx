import { SearchIcon } from '@heroicons/react/outline';
import { Project } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react';
import { Button } from '../ui/Button';
import { Empty } from '../ui/Empty';
import Navbar from '../ui/Navbar';
import ProjectCard from '../ui/ProjectCard';
import ProjectDropdown from '../ui/ProjectDropdown';

export function Projects({ projects }: { projects: Project[] }) {
	const { data: session } = useSession();
	const [search, setSearch] = React.useState('');
	return (
		<>
			<Navbar session={session} />
			<div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8">
				<div>
					<h1 className="text-3xl font-bold leading-tight text-gray-300">
						Projects
					</h1>
				</div>
				<div className="my-4 flex items-center justify-center gap-4 w-full">
					<div className="flex-1 w-full mt-1 relative rounded-md shadow-sm">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<SearchIcon
								className="h-5 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</div>
						<input
							type="text"
							name="project-search"
							id="project-search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="shadow-sm pl-10 py-3 text-gray-300 bg-brand-700 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
							placeholder="Searching is always easier..."
						/>
					</div>
					<div className="mt-2">
						<ProjectDropdown />
					</div>
				</div>
				<div className="mt-12">
					{projects.length > 0 ? (
						<ProjectCard
							projects={
								search !== ''
									? projects.filter((project) => {
											return project.name
												?.toLowerCase()
												.includes(search.toLowerCase());
									  })
									: projects
							}
						/>
					) : (
						<Empty />
					)}
				</div>
			</div>
		</>
	);
}
