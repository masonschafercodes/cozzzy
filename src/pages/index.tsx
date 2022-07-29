import { getSession, GetSessionParams } from 'next-auth/react';
import { prisma } from '~/utils/prisma';
import { Home } from '../components/Home';

export async function getServerSideProps(ctx: GetSessionParams | undefined) {
	const session = await getSession(ctx);

	if (!session) {
		return {
			props: {},
		};
	}

	const user = await prisma.user.findUnique({
		where: {
			email: session.user!.email!,
		},
		include: {
			team: true,
		},
	});

	console.log(user);

	return {
		props: {
			user: JSON.parse(JSON.stringify(user)),
			hasTeam: !user?.team ? false : true,
		},
	};
}

export default Home;
