import { NextApiRequest, NextApiResponse } from 'next';
import CozzyPrismaProvider from '~/CozzyProviders/CozzyPrismaProvider';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { teamInviteId } = req.query;
	const { method } = req;

	if (!teamInviteId) return res.status(400).json({ error: 'Missing teamId' });

	const cp = new CozzyPrismaProvider();

	if (method === 'GET') {
		const teamInvite = await cp.getTeamInviteById(teamInviteId as string);
		return res.status(200).json(teamInvite);
	} else if (method === 'POST') {
		const { action } = req.query;

		if (!action)
			return res.status(400).json({
				error: 'Missing action',
				exampleActions: ['accept', 'reject'],
			});

		try {
			const teamInvite = await cp.handleTeamInvite(
				teamInviteId as string,
				action as string,
			);
			return res.status(200).json(teamInvite);
		} catch (e: any) {
			return res.status(400).json({ name: e.name, error: e.message });
		}
	} else {
		return res.status(405).json({ error: 'Invalid method' });
	}
}
