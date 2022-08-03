import { PERMISSION } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import CozzyPrismaProvider from '~/CozzyProviders/CozzyPrismaProvider';

export default async function teamsAPIHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { teamId } = req.query;
	const { method } = req;

	if (!teamId) return res.status(400).json({ error: 'Missing teamId' });

	const cp = new CozzyPrismaProvider();

	if (method === 'GET') {
		const team = await cp.getTeamMembers(teamId as string);
		return res.status(200).json(team);
	} else if (method === 'POST') {
		const { userId } = req.query;
		const { role } = req.query;

		if (!role || !userId)
			return res.status(400).json({ error: 'Missing permRole' });

		const user = await cp.changeUserPermissions(
			userId as string,
			role as PERMISSION,
		);

		return res.status(200).json({
			status: 'success',
			message: 'User promoted to admin',
			user,
		});
	} else if (method === 'DELETE') {
		const { userId } = req.query;

		if (!userId) return res.status(400).json({ error: 'Missing userId' });

		const team = await cp.removeUserFromTeam(
			userId as string,
			teamId as string,
		);

		return res.status(200).json(team);
	} else {
		return res.status(405).json({ error: 'Invalid method' });
	}
}
