import { SearchIcon } from '@heroicons/react/outline';
import { PERMISSION, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react';
import Navbar from '../ui/Navbar';
import TeamMembersCards from '../ui/TeamMembersCards';

export function Team({
	teamMembers,
	teamName,
	userId,
	userPermission,
}: {
	teamMembers: User[];
	teamName: string;
	userId: string;
	userPermission: PERMISSION;
}) {
	const { data: session } = useSession();
	const [search, setSearch] = React.useState('');
	return (
		<>
			<Navbar session={session} />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div>
					<h1 className="text-3xl font-bold leading-tight text-brand-200">
						{teamName} Team
					</h1>
				</div>
				<div className="my-4">
					<div className="mt-1 relative rounded-md shadow-sm">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<SearchIcon
								className="h-5 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</div>
						<input
							type="text"
							name="name-search"
							id="name-search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="shadow-sm pl-10 py-3 mt-2 text-gray-300 bg-brand-700 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
							placeholder="Searching is always easier..."
						/>
					</div>
				</div>
				<div className="mt-12">
					<TeamMembersCards
						people={
							search !== ''
								? teamMembers.filter((person) => {
										return person.name
											?.toLowerCase()
											.includes(search.toLowerCase());
								  })
								: teamMembers
						}
						userId={userId}
						permLevel={userPermission}
					/>
				</div>
			</div>
		</>
	);
}
