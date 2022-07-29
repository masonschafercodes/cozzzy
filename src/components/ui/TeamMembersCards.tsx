import { MailIcon, PhoneIcon, XIcon } from '@heroicons/react/outline';
import { User } from '@prisma/client';
import React from 'react';
import { Button } from './Button';

export default function TeamMembersCards({
	people,
	userId,
}: {
	people: User[];
	userId: string;
}) {
	async function removeTeamMember(userId: string, teamId: string) {
		const response = await fetch('/api/v1/teams', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				action: 'remove-team-member',
				teamId: teamId,
				userId: userId,
			}),
		});

		if (response.ok) {
			window.location.reload();
		}
	}
	return (
		<>
			<ul
				role="list"
				className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
			>
				{people.map((person) => (
					<li
						key={person.email}
						className="col-span-1 bg-brand-700 rounded-lg shadow divide-y divide-brand-500"
					>
						<div className="w-full flex items-center justify-between p-6 space-x-6">
							<div className="flex-1 truncate">
								<div className="flex items-center space-x-3">
									<h3 className="text-gray-200 text-sm font-medium truncate">
										{person.name}
									</h3>
									<span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-semibold bg-green-100 rounded-full">
										Team Member
									</span>
								</div>
								<p className="mt-1 text-gray-300 text-sm truncate">
									{person.email}
								</p>
							</div>
							<img
								className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
								src={person.image ? person.image : ''}
								alt=""
							/>
						</div>
						<div>
							<div className="-mt-px flex divide-x divide-brand-500">
								<div className="w-0 flex-1 flex">
									<a
										href={`mailto:${person.email}`}
										className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-200 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
									>
										<MailIcon
											className="w-5 h-5 text-gray-400"
											aria-hidden="true"
										/>
										<span className="ml-3">Email</span>
									</a>
								</div>
								{person.id !== userId && (
									<div className="-ml-px w-0 flex-1 flex">
										<Button
											onClick={async () =>
												await removeTeamMember(
													person.id,
													person.teamId as string,
												)
											}
											className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-red-500 font-medium border border-transparent rounded-br-lg hover:text-red-300"
										>
											<XIcon
												className="w-5 h-5 text-gray-400"
												aria-hidden="true"
											/>
											<span className="ml-3">Remove from Team</span>
										</Button>
									</div>
								)}
							</div>
						</div>
					</li>
				))}
			</ul>
		</>
	);
}
