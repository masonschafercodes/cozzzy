import { useSession } from 'next-auth/react';
import React from 'react';
import Navbar from '~/components/ui/Navbar';

export function NewProject({ teamId }: { teamId: string }) {
	const { data: session } = useSession();
	return (
		<>
			<Navbar session={session} />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<p>{teamId}</p>
			</div>
		</>
	);
}
