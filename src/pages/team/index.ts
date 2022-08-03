import { getSession } from 'next-auth/react';
import CozzyPrismaProvider from '~/CozzyProviders/CozzyPrismaProvider';
import { Team } from '~/components/Team';

export async function getServerSideProps(ctx: any) {
	const session = await getSession(ctx);
	const cp = new CozzyPrismaProvider();

	if (!session) {
		return {
			redirect: {
				permanent: false,
				destination: '/api/auth/signin',
			},
		};
	} else {
		const team = await cp.getTeamByUserEmail(session?.user?.email as string);
		if (!team) {
			return {
				redirect: {
					permanent: true,
					destination: '/',
				},
			};
		}

		const user = await cp.getUserByEmail(session?.user?.email as string);

		const teamMembers = await cp.getTeamMembers(team.id);

		try {
			if (!team.stripeId) {
				await cp.appendStripedId(team.id);
			}
		} catch (e: any) {
			console.error(e);
		}

		return {
			props: {
				users: JSON.parse(JSON.stringify(teamMembers.users)),
				teamName: team.name,
				teamId: team.id,
				userId: user?.id,
				userPermission: user?.permission,
				teamSubscriptionType: team.subscriptionType,
			},
		};
	}
}

export default Team;
