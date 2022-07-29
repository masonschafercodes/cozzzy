import { useSession } from 'next-auth/react';
import Navbar from '../ui/Navbar';

export function Home({ user, hasTeam }: { user: any; hasTeam: boolean }) {
	const { data: session } = useSession();

	return (
		<div>
			<div>
				<Navbar session={session} />
				<div>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<pre>
							<code>{JSON.stringify(user, null, 2)}</code>
						</pre>
						<pre>
							<code>On a Team: {JSON.stringify(hasTeam, null, 2)}</code>
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
