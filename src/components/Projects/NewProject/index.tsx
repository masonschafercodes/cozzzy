import { TEAM_SUBSCRIPTION } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react';
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
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<p>{teamId}</p>
				{subscriptionType === TEAM_SUBSCRIPTION.FREE && numberOfProjects === 3 && (
					<div>
						<p>You have reached the maximum number of projects</p>
						<p>Please consider upgrading to a paid version</p>
					</div>
				)}
			</div>
		</>
	);
}
