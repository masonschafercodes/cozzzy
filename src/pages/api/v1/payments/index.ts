import { NextApiRequest, NextApiResponse } from 'next';
import CozzyPrismaProvider from '~/CozzyProviders/CozzyPrismaProvider';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { method } = req;

	const cp = new CozzyPrismaProvider();

	if (method === 'POST') {
		const { teamId }: { teamId: string | null } = req.body;

		if (!teamId) return res.status(400).json({ error: 'Missing teamId' });

		try {
			const teamSubscription = await cp.createTeamSubscription(teamId);

			if (teamSubscription.url) {
				return res.status(200).json({
					url: teamSubscription.url,
				});
			} else {
				return res.status(500).json({ error: 'Something went wrong' });
			}
		} catch (e: any) {
			return res.status(400).json({ name: e.name, error: e.message });
		}
	} else {
		return res.status(405).json({ error: 'Invalid method' });
	}
}
