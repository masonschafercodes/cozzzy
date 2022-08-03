import { NextApiRequest, NextApiResponse } from 'next';
import CozzyPrismaProvider from '~/CozzyProviders/CozzyPrismaProvider';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { teamId } = req.query;
	const { method } = req;

	if (!teamId) return res.status(400).json({ error: 'Missing teamId' });

	const cp = new CozzyPrismaProvider();

	if (method === 'GET') {
		const team = await cp.getTeamById(teamId as string);
		return res.status(200).json(team);
	} else {
		return res.status(405).json({ error: 'Invalid method' });
	}
}
