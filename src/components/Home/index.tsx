import { useSession } from 'next-auth/react';
import Navbar from '../ui/Navbar';

export function Home() {
	const { data: session } = useSession();

	return (
		<div>
			<div>
				<Navbar session={session} />
			</div>
		</div>
	);
}
