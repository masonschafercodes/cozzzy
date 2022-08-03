import { CubeTransparentIcon } from '@heroicons/react/outline';
import { Project } from '@prisma/client';
import React from 'react';
import { Button } from './Button';

export default function ProjectCard({ projects }: { projects: Project[] }) {
	return (
		<>
			<ul
				role="list"
				className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
			>
				{projects.map((project) => (
					<li
						key={project.id}
						className="col-span-1 bg-brand-700 border-2 border-brand-600 rounded-lg shadow divide-y divide-brand-500"
					>
						<div className="w-full flex items-center justify-between p-6 space-x-6">
							<div className="flex-1 truncate">
								<div className="flex items-center space-x-3">
									<h3 className="text-gray-200 text-lg font-bold truncate">
										{project.name}
									</h3>
								</div>
							</div>
						</div>
						<div>
							<div className="-mt-px flex divide-x divide-gray-200">
								<div className="w-0 flex-1 flex">
									<Button
										href={`/projects/${project.id}`}
										className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-200 font-medium border border-transparent rounded-bl-lg hover:text-gray-300"
									>
										<CubeTransparentIcon
											className="w-5 h-5 text-gray-200"
											aria-hidden="true"
										/>
										<span className="ml-3 font-semibold">View Project</span>
									</Button>
								</div>
							</div>
						</div>
					</li>
				))}
			</ul>
		</>
	);
}
