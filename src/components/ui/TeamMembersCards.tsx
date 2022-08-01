/* eslint-disable @next/next/no-img-element */
import {
	LockClosedIcon,
	LockOpenIcon,
	MailIcon,
	PhoneIcon,
	XIcon,
} from '@heroicons/react/outline';
import { PERMISSION, User } from '@prisma/client';
import React from 'react';
import { Button } from './Button';

export default function TeamMembersCards({
	people,
	userId,
	permLevel,
}: {
	people: User[];
	userId: string;
	permLevel: PERMISSION;
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

	async function changePermRole(userId: string, role: PERMISSION) {
		const response = await fetch('/api/v1/teams', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				action: 'change-team-member-permissions',
				userId: userId,
				permRole: role,
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
						className={
							person.id !== userId
								? 'col-span-1 bg-brand-700 rounded-lg shadow divide-y divide-brand-500'
								: 'col-span-1 bg-brand-700 rounded-lg shadow'
						}
					>
						<div className="w-full flex items-center justify-between p-6 space-x-6">
							<div className="flex-1 truncate">
								<div className="flex items-center space-x-3">
									<h3 className="text-gray-200 text-sm font-medium truncate">
										{person.name}
									</h3>
									{person.permission === 'ADMIN' ? (
										<span className="flex-shrink-0 inline-block px-2 py-0.5 text-red-800 text-xs font-semibold bg-red-100 rounded-full">
											{person.permission}
										</span>
									) : (
										<span className="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-semibold bg-green-100 rounded-full">
											{person.permission}
										</span>
									)}
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
								{person.id === userId && (
									<div className="px-6 py-4">
										<h1 className="font-semibold text-sm">
											No actions for yourself ✨
										</h1>
									</div>
								)}
								{person.id !== userId && permLevel === 'USER' && (
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
								)}
								{person.id !== userId && permLevel === 'ADMIN' && (
									<div className="-ml-px w-0 flex-1 flex">
										<Button
											onClick={async () =>
												await removeTeamMember(
													person.id,
													person.teamId as string,
												)
											}
											className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-red-300 font-medium border border-transparent rounded-br-lg hover:text-red-200"
										>
											<XIcon
												className="w-5 h-5 text-red-300"
												aria-hidden="true"
											/>
											<span className="ml-3">Remove from Team</span>
										</Button>
									</div>
								)}
								{person.id !== userId &&
									permLevel === 'ADMIN' &&
									person.permission !== 'ADMIN' && (
										<div className="-ml-px w-0 flex-1 flex">
											<Button
												onClick={async () =>
													await changePermRole(person.id, 'ADMIN')
												}
												className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-yellow-300 font-medium border border-transparent rounded-br-lg hover:text-yellow-200"
											>
												<LockClosedIcon
													className="w-5 h-5 text-yellow-300"
													aria-hidden="true"
												/>
												<span className="ml-3">Promote to Admin</span>
											</Button>
										</div>
									)}

								{person.id !== userId &&
									permLevel === 'ADMIN' &&
									person.permission !== 'USER' && (
										<div className="-ml-px w-0 flex-1 flex">
											<Button
												onClick={async () =>
													await changePermRole(person.id, 'USER')
												}
												className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-yellow-300 font-medium border border-transparent rounded-br-lg hover:text-yellow-200"
											>
												<LockOpenIcon
													className="w-5 h-5 text-yellow-300"
													aria-hidden="true"
												/>
												<span className="ml-3">Demote User</span>
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
