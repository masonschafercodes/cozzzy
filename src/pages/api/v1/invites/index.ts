import { NextApiRequest, NextApiResponse } from 'next';
import CozzyPrismaProvider from '~/CozzyProviders/CozzyPrismaProvider';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { method } = req;

	const cp = new CozzyPrismaProvider();

	if (method === 'POST') {
		const { teamId, email }: { teamId: string | null; email: string | null } =
			req.body;

		if (!teamId) return res.status(400).json({ error: 'Missing teamId' });
		if (!email) return res.status(400).json({ error: 'Missing email' });

		try {
			const teamInvite = await cp.createTeamInviteByEmail({
				teamId,
				email,
			});
			return res.status(200).json(teamInvite);
		} catch (e: any) {
			return res.status(400).json({ name: e.name, error: e.message });
		}
	} else {
		return res.status(405).json({ error: 'Invalid method' });
	}
}
