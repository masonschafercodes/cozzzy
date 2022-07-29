import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react';
import Navbar from '../ui/Navbar';
import TeamMembersCards from '../ui/TeamMembersCards';

export function Team({
	teamMembers,
	teamName,
	userId,
}: {
	teamMembers: User[];
	teamName: string;
	userId: string;
}) {
	const { data: session } = useSession();
	return (
		<>
			<Navbar session={session} />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div>
					<h1 className="text-3xl font-bold leading-tight text-gray-200">
						{teamName}
					</h1>
				</div>
				<div className="mt-12">
					<TeamMembersCards people={teamMembers} userId={userId} />
				</div>
			</div>
		</>
	);
}
