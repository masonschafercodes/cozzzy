import { useSession } from 'next-auth/react';
import Hero from '../ui/Hero';
import Navbar from '../ui/Navbar';

export function Home() {
	const { data: session } = useSession();

	return (
		<div>
			<Navbar session={session} />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mt-12">
					<Hero />
				</div>
			</div>
		</div>
	);
}
