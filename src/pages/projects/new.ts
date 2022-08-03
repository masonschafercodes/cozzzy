import { getSession } from 'next-auth/react';
import CozzyPrismaProvider from '~/CozzyProviders/CozzyPrismaProvider';
import { NewProject } from '~/components/Projects/NewProject';

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

		return {
			props: {
				teamId: team.id,
			},
		};
	}
}

export default NewProject;
